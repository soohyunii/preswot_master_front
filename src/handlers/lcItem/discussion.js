import LcItemHandler from './index';
// import discussionService from '../../services/discussionService';
// import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  static postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    super.postLcItem({ lectureId, inputHead, inputBody, inputTail });
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) { // eslint-disable-line no-unused-vars, max-len
    /*
      TODO
      현재 post discussion은 없음.
      post lectureItem에서 type = discussion으로 생성하는게 토론 생성의 전부인 상태.
      토론주제, 키워드, 난이도를 저장하려면 서버 스펙을 변경해야 함.
      서버 개발자분께 말씀드리고 기다리고 있는 상태
    */
  }
}
