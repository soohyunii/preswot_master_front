import LcItemHandler from './index';
import surveyService from '../../services/surveyService';
import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await surveyService.postSurvey({
      lectureItemId: lcItemId,
    });
    const surveyId = res1.data.survey_id;
    this.putChildLectureItem({ surveyId, inputBody, inputTail });
  }
  static async putChildLectureItem({ surveyId, inputBody, inputTail }) {
    const surveyType = utils.convertSurveyType2(inputBody.surveyType);
    surveyService.putSurvey({
      surveyId,
      comment: inputTail.comment,
      type: surveyType,
      choice: (inputTail.surveyItemList === undefined) ? undefined :
        inputTail.surveyItemList.map(item => item.value),
    });
  }

  /* eslint-disable no-param-reassign */
  static async initViewModel(vm) {
    const item = vm.lectureItem;
    const s = item.surveys[0];
    switch (s.type) {
      case 0: { // 객관
        vm.inputBody.surveyType = 'MULTIPLE_CHOICE';
        vm.$set(vm.inputTail, 'comment', s.comment);
        vm.inputTail.surveyItemList = s.choice.map(x => ({ value: x }));
        break;
      }
      case 1: { // 서술
        vm.inputBody.surveyType = 'DESCRIPTION';
        vm.$set(vm.inputTail, 'comment', s.comment);
        break;
      }
      default: {
        throw new Error(`not defined question type ${s.type}`);
      }
    }
  }
}
