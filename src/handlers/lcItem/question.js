import LcItemHandler from './index';
import questionService from '../../services/questionService';
import lectureItemService from '../../services/lectureItemService';
import utils from '../../utils';

export default class QuestionHandler extends LcItemHandler {
  // static postLcItem() {
  //   super.postLcItem();
  //   console.log('QuestionHandler postLcItem');
  // }

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
      // choice:
      answer,
      difficulty: inputTail.difficulty,
    });

    await lectureItemService.postQuestionKeywords({
      questionId,
      data: inputTail.assignedKeywordList,
    });
  }
}
