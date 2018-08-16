import deepCopy from 'deep-copy';
import LcItemHandler from './index';
import questionService from '../../services/questionService';
import lectureItemService from '../../services/lectureItemService';
import fileService from '../../services/fileService';
import utils from '../../utils';

export default class QuestionHandler extends LcItemHandler {
  // static postLcItem() {
  //   super.postLcItem();
  //   console.log('QuestionHandler postLcItem');
  // }
  /* eslint-disable no-param-reassign */
  static async initViewModel(vm) {
    const item = vm.lectureItem;
    const q = item.questions[0];

    console.log(q);

    // FIXME: 아래 메소드가 일부 클라이언트에서 알 수 없는 이유로 동적 매핑이 안되는 현상이 있습니다. 임시로 vm.$set 을 사용합니다.
    // vm.inputTail.question = q.question;
    vm.$set(vm.inputTail, 'question', q.question);

    vm.inputTail.difficulty = q.difficulty;
    const keywordList = await lectureItemService.getQuestionKeywords({
      questionId: q.question_id,
    });
    keywordList.data.forEach((element) => {
      element.score = element.score_portion;
    });
    vm.inputTail.assignedKeywordList = keywordList.data;

    switch (q.type) {
      case 1: { // 단답
        vm.inputBody.questionType = 'SHORT_ANSWER';
        vm.$set(vm.inputTail, 'answer', q.answer[0]);
        break;
      }
      case 0: { // 객관
        vm.inputBody.questionType = 'MULTIPLE_CHOICE';
        vm.$set(vm.inputTail, 'questionList', q.choice);
        vm.$set(vm.inputTail, 'answer', q.answer);
        break;
      }
      case 2: { // 서술
        vm.inputBody.questionType = 'DESCRIPTION';
        vm.$set(vm.inputTail, 'answer', q.answer[0]);
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'answerFile', vm.$refs.questionEditor.$refs.answerUpload.uploadFiles);
          if (q.files[0] !== undefined) {
            vm.$refs.questionEditor.$refs.answerUpload.uploadFiles.push({
              name: q.files[0].name,
              file_guid: q.files[0].file_guid,
            });
            vm.$set(vm.inputTail, 'oldfile', {
              name: q.files[0].name,
              file_guid: q.files[0].file_guid,
            });
          }
        });
        break;
      }
      case 3: { // SW
        vm.inputBody.questionType = 'SW';
        vm.$set(vm.inputTail, 'language', q.accept_language[0]);
        vm.$set(vm.inputTail, 'inputDescription', q.input_description);
        vm.$set(vm.inputTail, 'outputDescription', q.output_description);
        vm.$set(vm.inputTail, 'sampleInput', q.sample_input);
        vm.$set(vm.inputTail, 'sampleOutput', q.sample_output);
        vm.$set(vm.inputTail, 'memoryLimit', q.memory_limit);
        vm.$set(vm.inputTail, 'timeLimit', q.time_limit);
        vm.$set(vm.inputTail, 'testCaseList', q.problem_testcases);
        vm.$set(vm.inputTail, 'testCaseListOld', deepCopy(q.problem_testcases));
        break;
      }
      case 4: { // SQL
        vm.inputBody.questionType = 'SQL';
        vm.$set(vm.inputTail, 'answer', q.answer[0]);
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'sqlFile', vm.$refs.questionEditor.$refs.sqlUpload.uploadFiles);
          if (q.sql_lite_file[0] !== undefined) {
            vm.$refs.questionEditor.$refs.sqlUpload.uploadFiles.push({
              name: q.sql_lite_file[0].name,
              file_guid: q.sql_lite_file[0].file_guid,
            });
            vm.$set(vm.inputTail, 'sqlFileOld', {
              name: q.sql_lite_file[0].name,
              file_guid: q.sql_lite_file[0].file_guid,
            });
          }
        });
        break;
      }
      default: {
        throw new Error(`not defined question type ${q.type}`);
      }
    }
  }
  /* eslint-enable no-param-reassign */

  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await questionService.postQuestion({
      lectureItemId: lcItemId,
    });
    const questionId = res1.data.question_id;
    this.putChildLectureItem({ questionId, inputBody, inputTail });
  }

  static async putChildLectureItem({ questionId, inputBody, inputTail }) {
    const questionType = utils.convertQuestionType2(inputBody.questionType);

    await questionService.putQuestionType({
      questionId,
      type: questionType,
    });

    const answer = Array.isArray(inputTail.answer) ?
      inputTail.answer : [inputTail.answer];
    // TODO: add params such as choice, ... etc.
    await questionService.putQuestion({
      questionId,
      question: inputTail.question,
      choice: inputTail.questionList,
      answer,
      difficulty: inputTail.difficulty,
      languageList: [inputTail.language],
      inputDescription: inputTail.inputDescription,
      outputDescription: inputTail.outputDescription,
      sampleInput: inputTail.sampleInput,
      sampleOutput: inputTail.sampleOutput,
      timeLimit: inputTail.timeLimit,
      memoryLimit: inputTail.memoryLimit,
    });

    await lectureItemService.deleteQuestionKeywords({
      questionId,
    });
    await lectureItemService.postQuestionKeywords({
      questionId,
      data: inputTail.assignedKeywordList,
    });

    // 서술형인 경우
    if (inputBody.questionType === 'DESCRIPTION') {
      // 기존 파일이 존재
      if (inputTail.oldfile !== undefined) {
        // 새 파일 없으면 수정 전 파일 삭제
        if (inputTail.answerFile[0] === undefined) {
          fileService.deleteFile({
            fileGuid: inputTail.oldfile.file_guid,
          });
        }
        // 수정 후 파일 존재할 경우 기존 파일 삭제 및 새 파일 추가
        if (inputTail.answerFile[0] !== undefined && inputTail.answerFile[0].raw !== undefined) {
          fileService.deleteFile({
            fileGuid: inputTail.oldfile.file_guid,
          });
          questionService.postQuestionFile({
            questionId,
            file: inputTail.answerFile[0].raw,
          });
        }
      }
      // 수정 전 파일이 존재하지 않음
      if (inputTail.oldfile === undefined) {
        // 수정 후 파일 존재할 경우 파일 추가
        if (inputTail.answerFile[0] !== undefined && inputTail.answerFile[0].raw !== undefined) {
          questionService.postQuestionFile({
            questionId,
            file: inputTail.answerFile[0].raw,
          });
        }
      }
    }

    // SW인 경우
    if (inputBody.questionType === 'SW') {
      // 기존 testCase가 있다면 싹다 지운다.
      if (inputTail.testCaseListOld !== undefined) {
        inputTail.testCaseListOld.forEach((element) => {
          questionService.deleteQuestionTestCase({
            questionId,
            num: element.num,
          });
        });
      }
      // 새로운 testCase 싹다 넣는다.
      await questionService.postQuestionTestCase({
        questionId,
        testcase: inputTail.testCaseList,
      });
    }

    // SQL인 경우
    if (inputBody.questionType === 'SQL') {
      // 기존 파일 있었다.
      if (inputTail.sqlFileOld !== undefined) {
        // 현재 파일 없다.
        if (inputTail.sqlFile[0] === undefined) {
          // 기존파일 삭제
          fileService.deleteFileSqlite({
            fileGuid: inputTail.sqlFileOld.file_guid,
            questionId,
          });
        }
        // 현재 파일 새로올렸다.
        if (inputTail.sqlFile !== undefined
          && inputTail.sqlFile[0] !== undefined
          && inputTail.sqlFile[0].raw !== undefined) {
          // 기존파일 삭제
          await fileService.deleteFileSqlite({
            fileGuid: inputTail.sqlFileOld.file_guid,
            questionId,
          });
          // 현재 파일 등록
          questionService.postQuestionSQLiteFile({
            questionId,
            file: inputTail.sqlFile[0].raw,
          });
        }
        // 현재 파일 그대로다.
          // 할일 없음
      }
      // 기존 파일 없었다.
      if (inputTail.sqlFileOld === undefined) {
        // 현재 파일 새로올렸다.
        if (inputTail.sqlFile !== undefined
          && inputTail.sqlFile[0] !== undefined
          && inputTail.sqlFile[0].raw !== undefined) {
          // 현재파일 등록
          questionService.postQuestionSQLiteFile({
            questionId,
            file: inputTail.sqlFile[0].raw,
          });
        }
        // 현재 파일 없다.
          // 할일 없음
      }
    }
  }
}
