import LcItemHandler from './index';
import practiceService from '../../services/practiceService';
// import utils from '../../utils';

export default class PracticeHandler extends LcItemHandler {

  /* eslint-disable no-param-reassign */
  static initViewModel(vm) {
    const item = vm.lectureItem;
    const p = item.lecture_code_practices[0];
    vm.inputTail.code = p.code;
  }
  /* eslint-enable no-param-reassign */

  // @Override
  static async postChildLectureItem({ lcItemId, inputTail }) {
    const res1 = await practiceService.postPractice({
      lectureItemId: lcItemId,
    });

    const practiceId = res1.data.practice_id;

    this.putChildLectureItem({
      practiceId,
      inputTail,
    });
  }

  static async putChildLectureItem({ practiceId, inputTail }) {
    await practiceService.putPractice({
      practiceId,
      code: inputTail.code,
    });
  }
}
