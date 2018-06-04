import LcItemHandler from './index';
import discussionService from '../../services/discussionService';
import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  static postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    super.postLcItem({ lectureId, inputHead, inputBody, inputTail });
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    console.log('//TODO 서버측 스펙 답변을 받으면 이 부분을 구현할 것.');
    /*
    const res1 = await discussionService.postSurvey({
      lectureItemId: lcItemId,
    });
    const surveyId = res1.data.survey_id;
    const surveyType = utils.convertSurveyType2(inputBody.surveyType);

    discussionService.putSurvey({
      surveyId,
      comment: inputTail.comment,
      type: surveyType,
      choice: (inputTail.surveyItemList === undefined) ? undefined :
        inputTail.surveyItemList.map(item => item.value),
    });
    */
  }
}
