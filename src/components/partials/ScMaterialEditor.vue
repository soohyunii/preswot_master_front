<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="파일 업로드">
            <upload :type="{ from: 'ScMaterialEditor', currentEditingScItemIndex }"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Upload from './Upload';

export default {
  name: 'ScMaterialEditor',
  methods: {
    // ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    // FIXME: 굳이 upload의 prop으로 넘겨줄 이유가 있을까? Upload에서도 이렇게 받아오면 되는데
    ...mapState('teacher', ['currentEditingScItemIndex']),
    // description: {
    //   get() {
    //     const vm = this;
    //     if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
    //       return vm.currentEditingScItem.description || '';
    //     }
    //     return '';
    //   },
    //   set(description) {
    //     const vm = this;
    //     vm.updateCurrentEditingScItem({
    //       currentEditingScItem: {
    //         ...vm.currentEditingScItem,
    //         description,
    //       },
    //       lectureElementIndex: vm.currentEditingScItemIndex,
    //     });
    //   },
    // },
  },
  components: {
    Upload,
  },
};
</script>
