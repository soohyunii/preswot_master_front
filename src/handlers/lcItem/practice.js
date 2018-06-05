import LcItemHandler from './index';
import practiceService from '../../services/practiceService';
// import utils from '../../utils';

export default class PracticeHandler extends LcItemHandler {

  // @Override
  static async postChildLectureItem({ lcItemId, inputTail }) {
    const res1 = await practiceService.postPractice({
      lectureItemId: lcItemId,
    });

    const practiceId = res1.data.practice_id;

    await practiceService.putPractice({
      practiceId,
      code: inputTail.code,
    });
  }
}
