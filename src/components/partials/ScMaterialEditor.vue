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
    <!-- TODO: delete debug -->
    <h1>debug</h1>
    lecture scenario:
    <pre style="font-size: 70%;">{{ sc }}</pre> <br />
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
  },
  components: {
    Upload,
  },
};
</script>
