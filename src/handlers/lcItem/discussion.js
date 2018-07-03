import LcItemHandler from './index';
import discussionService from '../../services/discussionService';
// import utils from '../../utils';

export default class SurveyHandler extends LcItemHandler {
  static initViewModel(vm) {
    const item = vm.lectureItem;
    const d = item.discussion_info;
    vm.$set(vm.inputTail, 'content', d.topic);
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