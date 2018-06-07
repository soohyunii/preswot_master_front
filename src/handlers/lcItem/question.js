import LcItemHandler from './index';
import questionService from '../../services/questionService';
import lectureItemService from '../../services/lectureItemService';
import utils from '../../utils';

export default class QuestionHandler extends LcItemHandler {
  static postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    super.postLcItem({ lectureId, inputHead, inputBody, inputTail });
  }

  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await questionService.postQuestion({
      lectureItemId: lcItemId,
    });
    const questionId = res1.data.question_id;
    const questionType = utils.convertQuestionType2(inputBody.questionType);

    questionService.putQuestionType({
      questionId,
      type: questionType,
    });

    const answer = Array.isArray(inputTail.answer) ?
      inputTail.answer : [inputTail.answer];
    // TODO: add params such as choice, ... etc.
    await questionService.putQuestion({
      questionId: res1.data.question_id,
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
