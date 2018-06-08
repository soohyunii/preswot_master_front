import LcItemHandler from './index';
import questionService from '../../services/questionService';
import lectureItemService from '../../services/lectureItemService';
import utils from '../../utils';

export default class QuestionHandler extends LcItemHandler {
  // static postLcItem() {
  //   super.postLcItem();
  //   console.log('QuestionHandler postLcItem');
  // }
  /* eslint-disable no-param-reassign */
  static initViewModel(vm) {
    const item = vm.lectureItem;
    const q = item.questions[0];
    vm.inputTail.question = q.question;
    vm.inputTail.difficulty = q.difficulty;
    // TODO: keyword init
    switch (q.type) {
      case 1: { // 단답
        vm.inputBody.questionType = 'SHORT_ANSWER';
        vm.inputTail.answer = q.answer[0];
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

    questionService.putQuestionType({
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
    });

    await lectureItemService.postQuestionKeywords({
      questionId,
      data: inputTail.assignedKeywordList,
    });

    // SW인 경우 testCase 입력
    if (inputTail.testCaseList.length > 0) {
      inputTail.testCaseList.forEach((testcase) => {
        questionService.postQuestionTestCase({
          questionId: res1.data.question_id,
          input: testcase.input,
          output: testcase.output,
        });
      });
    }

    // SQL인 경우 fileList 입력
    if (inputTail.sqlFileUidGuidList !== undefined) {
      inputTail.sqlFileUidGuidList.forEach((element) => {
        questionService.postQuestionSQLiteFile({
          questionId,
          file: element.raw,
        });
      });
    }
  }
}
