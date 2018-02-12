<template>
  <div>
    <!-- TODO: action path -->
    <el-upload
      action="#"
      :auto-upload="true"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      multiple
      :limit="5"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      :http-request="doUpload"
      :on-error="handleError"
      :on-success="handleSuccess"
      ref="upload">
      <el-button slot="trigger" size="small" type="primary">파일추가 [+]</el-button>
    </el-upload>
    <i class="el-icon-loading" v-if="loading" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';


export default {
  name: 'Upload',
  props: ['from'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('teacher', ['sc']),
    ...mapGetters('teacher', ['currentEditingScItem']),
    fileList: {
      get() {
        const vm = this;
        switch (vm.from) {
          case 'ScMaterialEditor': {
            // for fileList from ScMaterialEditor
            const scItem = vm.currentEditingScItem;
            return scItem ? scItem.fileList : [];
          }
          default: {
            throw new Error(`not defined type ${vm.type.from}`);
          }
        }
      },
      set(fileList) {
        const vm = this;
        switch (vm.from) {
          default:
          case 'ScMaterialEditor': {
            // for fileList of ScMaterialEditor
            vm.assignCurrentEditingScItem({
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
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
    ...mapActions('teacher', ['postFile', 'deleteFile']),
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
    handleSuccess(res, file, fileList) {
      const vm = this;
      vm.loading = false;
      console.log(res, file, fileList); // eslint-disable-line
      vm.$notify({
        title: '업로드 성공',
        message: `${file.name} 업로드 성공`,
        type: 'success',
      });
    },
    handleError(err, file, fileList) {
      const vm = this;
      vm.loading = false;
      console.log(err, file, fileList); // eslint-disable-line
      vm.$notify({
        title: '업로드 실패',
        message: `${file.name} ${err}`,
        type: 'error',
      });
    },
    handleChange(file, fileList) {
      const vm = this;
      vm.fileList = fileList;
      console.log('handleChange', file, fileList); // eslint-disable-line
    },
    async doUpload(req) {
      console.log('req', req); // eslint-disable-line
      const vm = this;
      vm.loading = true;
      await vm.postFile({
        file: req.file,
      });
    },
  },
};
</script>
