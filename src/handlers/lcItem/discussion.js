import LcItemHandler from './index';
import discussionService from '../../services/discussionService';
// import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  static initViewModel(vm) {
    const item = vm.lectureItem;
    const d = item.discussions[0]; // eslint-disable-line
    console.log('아직 API가 안 뚫려서 discussions가 빈 배열로 들어온닷..!'); // eslint-disable-line
    // TODO: init vm.inputTail with d
    // vm.$set(vm.inputTail, 'content', d);
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputTail }) { // eslint-disable-line no-unused-vars, max-len
    this.putChildLectureItem({ lectureItemId: lcItemId, inputTail });
  }
  static async putChildLectureItem({ lectureItemId, inputTail }) {
    discussionService.putDiscussion({
      id: lectureItemId,
      share: true, // TODO share 값 입력 필요하다면 구현할 것
      topic: inputTail.content,
    });
  }
}
