import deepCopy from 'deep-copy';
import LcItemHandler from './index';
import questionService from '../../services/questionService';
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

    vm.$set(vm.inputTail, 'question', q.question);

    vm.inputTail.difficulty = q.difficulty;
    const keywordList = await questionService.getQuestionKeywords({
      questionId: q.question_id,
    });
    keywordList.data.forEach((element) => {
      element.score = element.score_portion;
    });
    vm.inputTail.assignedKeywordList = keywordList.data;

    switch (q.type) {
      case 1: { // 단답
        vm.inputBody.questionType = 'SHORT_ANSWER';
        vm.$set(vm.inputTail, 'answer', q.answer);
        break;
      }
      case 0: { // 객관
        vm.inputBody.questionType = 'MULTIPLE_CHOICE';
        if (q.answer.length === 0) {
          vm.$set(vm.inputTail, 'answer', []);
        } else {
          vm.$set(vm.inputTail, 'answer', q.answer);
        }
        if (q.choice.length === 0) {
          vm.$set(vm.inputTail, 'questionList', []);
        } else {
          vm.$set(vm.inputTail, 'questionList', q.choice);
        }
        break;
      }
      case 2: { // 서술
        vm.inputBody.questionType = 'DESCRIPTION';
        vm.$set(vm.inputTail, 'answer', q.answer);
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'answerFile', vm.$refs.questionEditor.$refs.answerUpload.uploadFiles);
          if (q.files.length !== 0) {
            for (let i = 0; i < q.files.length; i += 1) {
              vm.$refs.questionEditor.$refs.answerUpload.uploadFiles.push({
                name: q.files[i].name,
                file_guid: q.files[i].file_guid,
              });
            }
            // 문항 유형 변경시에도 기존 파일 목록 유지하기 위해 inputBody에 삽입.
            vm.$set(vm.inputBody, 'oldAnswerFile', q.files);
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
        vm.$set(vm.inputTail, 'answer', q.answer);
        vm.$nextTick(() => {
          vm.$set(vm.inputTail, 'sqlFile', vm.$refs.questionEditor.$refs.sqlUpload.uploadFiles);
          if (q.sql_lite_file[0] !== undefined) {
            vm.$refs.questionEditor.$refs.sqlUpload.uploadFiles.push({
              name: q.sql_lite_file[0].name,
              file_guid: q.sql_lite_file[0].file_guid,
            });
            // 문항 유형 변경시에도 기존 파일 목록 유지하기 위해 inputBody에 삽입.
            vm.$set(vm.inputBody, 'sqlFileOld', {
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

    vm.$nextTick(() => {
      vm.$set(vm.inputTail, 'questionFile', vm.$refs.questionEditor.$refs.questionUpload.uploadFiles);
      if (q.question_material.length !== 0) {
        for (let i = 0; i < q.question_material.length; i += 1) {
          vm.$refs.questionEditor.$refs.questionUpload.uploadFiles.push({
            name: q.question_material[i].name,
            file_guid: q.question_material[i].file_guid,
          });
        }
        // 문항 유형 변경시에도 기존 파일 목록 유지하기 위해 inputBody에 삽입.
        vm.$set(vm.inputBody, 'oldQuestionFile', q.question_material);
      }
    });
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

    // 기존 파일 목록이 존재
    if (inputBody.oldQuestionFile !== undefined) {
      // 기존 파일 중 수정 파일 목록에 존재하지 않는 것을 삭제
      const deleteList = [];
      for (let i = 0; i < inputBody.oldQuestionFile.length; i += 1) {
        let existance = false;
        for (let j = 0; j < inputTail.questionFile.length; j += 1) {
          if (inputBody.oldQuestionFile[i].name === inputTail.questionFile[j].name) {
            existance = true;
            break;
          }
        }
        if (!existance) {
          deleteList.push({ file_guid: inputBody.oldQuestionFile[i].file_guid });
        }
      }
      for (let i = 0; i < deleteList.length; i += 1) {
        fileService.deleteFile({
          fileGuid: deleteList[i].file_guid,
        });
      }

      // 수정 파일 중 기존 파일 목록에 존재하지 않는 것을 추가
      const newList = [];
      for (let i = 0; i < inputTail.questionFile.length; i += 1) {
        let existance = false;
        for (let j = 0; j < inputBody.oldQuestionFile.length; j += 1) {
          if (inputTail.questionFile[i].name === inputBody.oldQuestionFile[j].name) {
            existance = true;
            break;
          }
        }
        if (!existance) {
          newList.push({ file: inputTail.questionFile[i].raw });
        }
      }
      for (let i = 0; i < newList.length; i += 1) {
        questionService.postQuestionFile({
          questionId,
          file: newList[i].file,
        });
      }
    }

    // 기존 파일 목록이 존재하지 않음
    if (inputBody.oldQuestionFile === undefined) {
      // 추가할 파일이 존재할 경우 파일 추가
      if (inputTail.questionFile.length !== 0) {
        for (let i = 0; i < inputTail.questionFile.length; i += 1) {
          questionService.postQuestionFile({
            questionId,
            file: inputTail.questionFile[i].raw,
          });
        }
      }
    }

    await questionService.deleteQuestionKeywords({
      questionId,
    });
    await questionService.postQuestionKeywords({
      questionId,
      data: inputTail.assignedKeywordList,
    });

    // 서술형인 경우
    if (inputBody.questionType === 'DESCRIPTION') {
      // 기존 파일 목록이 존재
      if (inputBody.oldAnswerFile !== undefined) {
        // 기존 파일 중 수정 파일 목록에 존재하지 않는 것을 삭제
        const deleteList = [];
        for (let i = 0; i < inputBody.oldAnswerFile.length; i += 1) {
          let existance = false;
          for (let j = 0; j < inputTail.answerFile.length; j += 1) {
            if (inputBody.oldAnswerFile[i].name === inputTail.answerFile[j].name) {
              existance = true;
              break;
            }
          }
          if (!existance) {
            deleteList.push({ file_guid: inputBody.oldAnswerFile[i].file_guid });
          }
        }

        for (let i = 0; i < deleteList.length; i += 1) {
          fileService.deleteFile({
            fileGuid: deleteList[i].file_guid,
          });
        }

        // 수정 파일 중 기존 파일 목록에 존재하지 않는 것을 추가
        const newList = [];
        for (let i = 0; i < inputTail.answerFile.length; i += 1) {
          let existance = false;
          for (let j = 0; j < inputBody.oldAnswerFile.length; j += 1) {
            if (inputTail.answerFile[i].name === inputBody.oldAnswerFile[j].name) {
              existance = true;
              break;
            }
          }
          if (!existance) {
            newList.push({ file: inputTail.answerFile[i].raw });
          }
        }
        for (let i = 0; i < newList.length; i += 1) {
          questionService.postQuestionAnswerFile({
            questionId,
            file: newList[i].file,
          });
        }
      }

      // 기존 파일 목록이 존재하지 않음
      if (inputBody.oldAnswerFile === undefined) {
        // 추가할 파일이 존재할 경우 파일 추가
        if (inputTail.answerFile.length !== 0) {
          for (let i = 0; i < inputTail.answerFile.length; i += 1) {
            questionService.postQuestionAnswerFile({
              questionId,
              file: inputTail.answerFile[i].raw,
            });
          }
        }
      }
    } else if (inputBody.oldAnswerFile !== undefined) {
      for (let i = 0; i < inputBody.oldAnswerFile.length; i += 1) {
        fileService.deleteFile({
          fileGuid: inputBody.oldAnswerFile[i].file_guid,
        });
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
      if (inputBody.sqlFileOld !== undefined) {
        // 현재 파일 없다.
        if (inputTail.sqlFile[0] === undefined) {
          // 기존파일 삭제
          fileService.deleteFileSqlite({
            fileGuid: inputBody.sqlFileOld.file_guid,
            questionId,
          });
        }
        // 현재 파일 새로올렸다.
        if (inputTail.sqlFile !== undefined
          && inputTail.sqlFile[0] !== undefined
          && inputTail.sqlFile[0].raw !== undefined) {
          // 기존파일 삭제
          await fileService.deleteFileSqlite({
            fileGuid: inputBody.sqlFileOld.file_guid,
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
      if (inputBody.sqlFileOld === undefined) {
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
    } else if (inputBody.sqlFileOld !== undefined) {
      fileService.deleteFile({
        fileGuid: inputBody.sqlFileOld.file_guid,
        questionId,
      });
    }
  }
}
