<template>
  <div>
    <h1>Lecture Scenario Material Editor template</h1>
    <h2>내용</h2>
    <el-row>
      <el-col :span="6">
        파일 업로드
      </el-col>
      <el-col :span="18">
        <!-- TODO: action path -->
        <el-upload
          action="#"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="fileList"
          multiple
          :limit="5"
          :on-exceed="handleExceed"
          :before-remove="beforeRemove"
          ref="upload">
          <el-button slot="trigger" size="small" type="primary">파일추가 [+]</el-button>
          <el-button size="small" type="success" @click="submitUpload">upload Test</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        설명
      </el-col>
      <el-col :span="18">
        <el-input
          type="textarea"
          :rows="3"
          v-model="description"
        >
          <!-- v-model="description" -->
        </el-input>
      </el-col>
    </el-row>
    <h1>debug</h1>
    lecture scenario:
    <pre>{{ lectureScenario }}</pre> <br />
    <pre>{{fileList}}</pre>
    description: {{ description }}
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';

/**
 * @description 강의자료 에디터
 */
export default {
  name: 'LectureScenarioMaterialEditor',
  data() {
    const vm = this;
    return {
      url: vm.$route.path,
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
      window.console.log('aaa');
    },
    ...mapMutations('teacher', ['updateCurrentEditingLectureScenarioItem']),
    handleExceed(files, fileList) {
      // TODO: translate
      this.$message.warning(
        `최대 3개의 파일을 업로드 할 수 있습니다.
        ${files.length}개의 파일을 선택하셨습니다.
        업로드 하려는 파일의 총 개수 : ${files.length + fileList.length}`,
      );
    },
    beforeRemove(file) {
      // TODO: translate
      return this.$confirm(`${file.name} 파일을 삭제하시겠습니까？`);
    },
    handleChange(files, fileList) {
      const vm = this;
      vm.fileList = fileList;
    },
  },
  computed: {
    ...mapState('teacher', ['lectureScenario', 'currentEditingLectureScenarioItem']),
    ...mapGetters('teacher', ['isLectureScenarioEmpty']),
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLectureScenarioItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLectureScenarioItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingLectureScenarioItem({
          currentEditingLectureScenarioItem: {
            ...vm.currentEditingLectureScenarioItem,
            description,
          },
        });
      },
    },
    fileList: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLectureScenarioItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLectureScenarioItem.fileList || [];
        }
        return [];
      },
      set(fileList) {
        const vm = this;
        vm.updateCurrentEditingLectureScenarioItem({
          currentEditingLectureScenarioItem: {
            ...vm.currentEditingLectureScenarioItem,
            fileList,
          },
        });
      },
    },
  },
};
</script>
