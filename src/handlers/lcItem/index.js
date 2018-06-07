import lectureItemService from '../../services/lectureItemService';
import utils from '../../utils';

export default class LcItemHandler {
  static async postLcItem({ lectureId, inputHead, inputBody, inputTail }) {
    const res1 = await lectureItemService.postLectureItem({
      lectureId,
      lectureItemOrder: inputHead.type,
      lectureItemType: utils.convertLcItemType(inputHead.lcItemType),
    });

    const lectureItemId = res1.data.lecture_item_id;
    await lectureItemService.putLectureItem({
      lectureItemId,
      name: inputHead.lcItemName,
    });
    await this.postChildLectureItem({
      lcItemId: lectureItemId,
      inputBody,
      inputTail,
    });
  }

  static postChildLectureItem() { // JS는 함수 이름만으로 같은 함수인지 아닌지 판별,
    // JAVA에서 함수이름 + 인자까지 다 보는 것과는 상반됨
    throw new Error('Child class should implement postChildLectureItem()');
  }

  static async putLcItem({ lectureItemId, inputHead, ...others }) {
    await lectureItemService.putLectureItem({
      lectureItemId,
      name: inputHead.lcItemName,
      order: inputHead.type,
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
