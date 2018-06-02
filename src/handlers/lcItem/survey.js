import LcItemHandler from './index';
import surveyService from '../../services/surveyService';
import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  static postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    super.postLcItem({ lectureId, inputHead, inputBody, inputTail });
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await surveyService.postSurvey({
      lectureItemId: lcItemId,
    });
    const surveyId = res1.data.survey_id;
    const surveyType = utils.convertSurveyType2(inputBody.surveyType);

    surveyService.putSurvey({
      surveyId,
      comment: inputTail.comment,
      type: surveyType,
      choice: (inputTail.surveyItemList === undefined) ? undefined :
        inputTail.surveyItemList.map(item => item.value),
    });
  }
}
