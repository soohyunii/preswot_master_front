import LcItemHandler from './index';
import materialService from '../../services/materialService';
import utils from '../../utils';

export default class MaterialHandler extends LcItemHandler {
  /* eslint-disable no-param-reassign */
  static async initViewModel(vm) {
    const item = vm.lectureItem;
    const m = item.materials[0];
    switch (m.type) {
      case 0: {
        vm.inputBody.materialType = 'FILE';
        vm.$set(vm.inputTail, 'file', m.file);
        break;
      }
      case 1: {
        vm.inputBody.materialType = 'LINK';
        vm.$set(vm.inputTail, 'link', m.link);
        break;
      }
      case 2: {
        vm.inputBody.materialType = 'YOUTUBE';
        vm.$set(vm.inputTail, 'clip', m.clip);
        vm.$set(vm.inputTail, 'clip_start', m.clipStart);
        vm.$set(vm.inputTail, 'clip_end', m.clipEnd);
        break;
      }
      default: {
        throw new Error(`not defined material type ${m.type}`);
      }
    }
  }

  // @Override
  static async postChildLectureItem({ lcItemId, inputBody, inputTail }) {
    const res1 = await materialService.postMaterial({
      lectureItemId: lcItemId,
    });
    const materialId = res1.data.material_id;
    this.putChildLectureItem({ materialId, inputBody, inputTail });
  }

  static async putChildLectureItem({ materialId, inputBody, inputTail }) {
    const materialType = utils.convertMaterialType2(inputBody.materialType);

    // TODO: add params
    await materialService.putMaterialType({
      materialId,
      type: materialType,
    });

    materialService.putMaterial({
      materialId,
      type: materialType,
      inputTail,
    });
  }
}
