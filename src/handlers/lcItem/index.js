import lectureItemService from '../../services/lectureItemService';
import utils from '../../utils';

export default class LcItemHandler {
  static async postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    const res1 = await lectureItemService.postLectureItem({
      lectureId,
      lectureItemOrder: inputHead.lcItemOrder,
      lectureItemType: utils.convertLcItemType(inputHead.lcItemType),
    });

    let lcItemOffset = 0;
    if (inputHead.lcItemOffset !== null) {
      lcItemOffset = (3600 * inputHead.lcItemOffset.getHours()) +
        (60 * inputHead.lcItemOffset.getMinutes()) + inputHead.lcItemOffset.getSeconds();
    }

    alert(`put lecture item - ${JSON.stringify(inputHead)}`)
    const lectureItemId = res1.data.lecture_item_id;
    await lectureItemService.putLectureItem({
      lectureItemId,
      name: inputHead.lcItemName,
      sequence: inputHead.lcItemSequence,
      result: inputHead.lcItemResult,
      offset: lcItemOffset,
    });
    await this.postChildLectureItem({
      lcItemId: lectureItemId,
      inputBody,
      inputTail,
    });
    return res1;
  }

  static postChildLectureItem() { // JS는 함수 이름만으로 같은 함수인지 아닌지 판별,
    // JAVA에서 함수이름 + 인자까지 다 보는 것과는 상반됨
    throw new Error('Child class should implement postChildLectureItem()');
  }

  static async putLcItem({ lectureItemId, inputHead, ...others }) {
    let lcItemOffset = 0;
    if (inputHead.lcItemOffset !== null) {
      lcItemOffset = (3600 * inputHead.lcItemOffset.getHours()) +
        (60 * inputHead.lcItemOffset.getMinutes()) + inputHead.lcItemOffset.getSeconds();
    }

    await lectureItemService.putLectureItem({
      lectureItemId,
      name: inputHead.lcItemName,
      order: inputHead.lcItemOrder,
      result: inputHead.lcItemResult ? 1 : 0,
      offset: lcItemOffset,
    });

    await this.putChildLectureItem({
      lectureItemId,
      ...others,
    });
  }

  static putChildLectureItem() {
    throw new Error('Child class should implement putChildLectureItem()');
  }
}
