<template>
  <div>
    <!-- TODO: action path -->
    <el-upload
      action="#"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      multiple
      :limit="5"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      ref="upload">
      <el-button slot="trigger" size="small" type="primary">파일추가 [+]</el-button>
      <el-button size="small" type="success" @click="submitUpload">upload Test</el-button>
    </el-upload>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';


export default {
  name: 'Upload',
  props: ['type'],
  computed: {
    ...mapState('teacher', ['sc']),
    fileList: {
      get() {
        const vm = this;
        switch (vm.type.from) {
          default:
            throw new Error(`not defined type ${vm.type.from}`);
          case 'ScMaterialEditor': {
            // for fileList from ScMaterialEditor
            const index = vm.type.currentEditingScItemIndex;
            if (index !== null && index > -1) {
              // FIXME: replace with currentEditingScItem
              return vm.sc[vm.type.currentEditingScItemIndex].fileList || [];
            }
            return [];
          }
        }
      },
      set(fileList) {
        const vm = this;
        switch (vm.type.from) {
          default:
          case 'ScMaterialEditor': {
            // for fileList of ScMaterialEditor
            vm.updateCurrentEditingScItem({
              currentEditingScItem: {
                fileList,
              },
            });
          }
        }
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
    submitUpload() {
      this.$refs.upload.submit();
      window.console.log('upload Test');
    },
    handleExceed(files, fileList) {
      // TODO: translate
      this.$message.warning(
        `최대 5개의 파일을 업로드 할 수 있습니다.
        ${files.length}개의 파일을 선택하셨습니다.
        업로드 하려는 파일의 총 개수 : ${files.length + fileList.length}`,
      );
    },
    beforeRemove(file) {
      // TODO: translate
      return this.$confirm(`${file.name} 파일을 삭제하시겠습니까？`);
    },
    handleRemove(file, fileList) {
      const vm = this;
      vm.fileList = fileList;
    },
    handleChange(files, fileList) {
      const vm = this;
      vm.fileList = fileList;
    },
  },
};
</script>
