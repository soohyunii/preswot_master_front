<template>
  <div>
    <!-- TODO: action path -->
    <el-upload
      action="#"
      :auto-upload="true"
      :on-remove="handleRemove"
      :file-list="fileList"
      multiple
      :limit="SQLite? 1 : 5"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      :http-request="doUpload"
      :on-error="handleError"
      :on-success="handleSuccess"
      ref="upload">
      <el-button slot="trigger" size="small" type="primary">파일추가 [+]</el-button>
      <el-select
        v-if="SQLite"
        v-model="selectedSqliteFile"
        placeholder="이전 업로드 선택"
        @change="onChange('previousSql')">
        <el-option
          v-for="file in previousSqliteFile"
          :label="file.name"
          :value="file.file_guid">
        </el-option>
      </el-select>
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
      SQLite: false,
      selectedSqliteFile: '',
    };
  },
  computed: {
    ...mapState('scItem', ['sc']),
    ...mapGetters('scItem', ['currentEditingScItem']),
    fileList: {
      get() {
        const vm = this;
        switch (vm.from) {
          case 'ScQuestionEditor':
          case 'ScSurveyEditor':
          case 'ScHomeworkEditor':
          case 'ScMaterialEditor': {
            const scItem = vm.currentEditingScItem;
            return scItem ? scItem.fileList : [];
          }
          case 'ScQuestionSQLite': {
            vm.SQLite = true;
            const scItem = vm.currentEditingScItem;
            vm.selectedSqliteFile = '';
            return scItem ? scItem.SQLiteFile : [];
          }
          default: {
            throw new Error(`not defined type ${vm.from}`);
          }
        }
      },
      set(fileList) {
        const vm = this;
        switch (vm.from) {
          case 'ScQuestionEditor':
          case 'ScSurveyEditor':
          case 'ScHomeworkEditor':
          case 'ScMaterialEditor': {
            // for fileList of ScMaterialEditor
            vm.assignCurrentEditingScItem({
              currentEditingScItem: {
                fileList,
              },
            });
            break;
          }
          case 'ScQuestionSQLite': {
            vm.assignCurrentEditingScItem({
              currentEditingScItem: {
                SQLiteFile: fileList,
              },
            });
            break;
          }
          default: {
            break;
          }
        }
      },
    },
    previousSqliteFile: {
      get() {
        const vm = this;
        return vm.currentEditingScItem.question.previousSqliteFiles;
      },
    },
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem']),
    ...mapActions('scItem', [
      'getScItem',
      'postFile',
      'selectPreviousSqlite',
      'deleteFile',
      'deleteFileSqlite',
    ]),
    handleExceed(files, fileList) {
      // TODO: translate
      if (this.SQLite) {
        this.$message.warning(
          'SQLite Database 파일은 1개만 업로드 할 수 있습니다.',
        );
      } else {
        this.$message.warning(
          `최대 5개의 파일을 업로드 할 수 있습니다.
        ${files.length}개의 파일을 선택하셨습니다.
        업로드 하려는 파일의 총 개수 : ${files.length + fileList.length}`,
        );
      }
    },
    beforeRemove(file) {
      // TODO: translate
      return this.$confirm(`${file.name} 파일을 삭제하시겠습니까？`);
    },
    async handleRemove(file) {
      const vm = this;
      try {
        vm.loading = true;
        if (!vm.SQLite) {
          vm.deleteFile({
            fileGuid: file.guid,
          });
        } else {
          vm.deleteFileSqlite({
            fileGuid: file.guid,
            questionId: vm.currentEditingScItem.question.id,
          });
          vm.fileList = [];
        }
        vm.$notify({
          title: '삭제 성공',
          message: `${file.name} 삭제 성공`,
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        vm.$notify({
          title: `${file.name} 삭제 실패`,
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      } finally {
        vm.loading = false;
      }
    },
    handleSuccess(res, file) {
      const vm = this;
      vm.loading = false;
      // console.log(res, file, fileList);
      vm.$notify({
        title: '업로드 성공',
        message: `${file.name} 업로드 성공`,
        type: 'success',
      });
    },
    handleError(err, file) {
      const vm = this;
      vm.loading = false;
      // console.log(err, file, fileList);
      vm.$notify({
        title: '업로드 실패',
        message: `${file.name} ${err}`,
        type: 'error',
      });
    },
    // handleChange(file, fileList) {
    //   const vm = this;
    //   // vm.fileList.push(file);
    //   // vm.fileList = fileList;
    //   console.log('handleChange', file, fileList);
    // },
    async doUpload(req) {
      // console.log('req', req);
      const vm = this;
      vm.loading = true;
      switch (vm.from) {
        case 'ScQuestionEditor':
        case 'ScSurveyEditor':
        case 'ScHomeworkEditor':
        case 'ScMaterialEditor': {
          await vm.postFile({
            file: req.file,
          });
          break;
        }
        case 'ScQuestionSQLite': {
          await vm.postFile({
            file: req.file,
            SQLite: true,
          });
          break;
        }
        default: {
          throw new Error(`not defined from ${vm.from}`);
        }
      }
    },
    async onChange(type) {
      const vm = this;
      switch (type) {
        case 'previousSql': {
          if (vm.fileList.length > 0) {
            this.$message.warning(
              'SQLite Database 파일은 1개만 업로드 할 수 있습니다.',
            );
            vm.selectedSqliteFile = '';
          } else {
            await vm.selectPreviousSqlite({
              guid: vm.selectedSqliteFile,
              questionId: vm.currentEditingScItem.question.id,
            });
            vm.getScItem({
              scItemId: vm.currentEditingScItem.id,
            });
          }
          break;
        }
        default: {
          throw new Error('not defined onChange type');
        }
      }
    },
  },
};
</script>
