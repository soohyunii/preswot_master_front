<template>
  <div>
    <h1>Sc Material Editor Template</h1>
    <h2>내용</h2>
    <el-row>
      <el-col :span="6">
        파일 업로드
      </el-col>
      <el-col :span="18">
        <upload :type="{ from: 'ScMaterialEditor', currentEditingScItemIndex }"/>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        설명
      </el-col>
      <el-col :span="18">

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Upload from './Upload';

export default {
  name: 'ScMaterialEditor',
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
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
