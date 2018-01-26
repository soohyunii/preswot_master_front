<template>
  <div>
    <h1>Lecture Scenario Material Editor template</h1>
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
        <el-input
          type="textarea"
          :rows="3"
          v-model="description"
        >
          <!-- v-model="description" -->
        </el-input>
      </el-col>
    </el-row>
    <!-- TODO: delete debug -->
    <h1>debug</h1>
    lecture scenario:
    <pre>{{ sc }}</pre> <br />
    description: {{ description }} <br />
    currentEditingScItem: {{ currentEditingScItem }}
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import Upload from './Upload';

/**
 * @description 강의자료 에디터
 */
export default {
  name: 'ScMaterialEditor',
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex']), // TODO: delete 'sc' from list
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            description,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    fileList: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.fileList || [];
        }
        return [];
      },
      set(fileList) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            fileList,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
  components: {
    Upload,
  },
};
</script>
