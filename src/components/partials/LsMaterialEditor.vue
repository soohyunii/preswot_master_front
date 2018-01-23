<template>
  <div>
    <h1>Lecture Scenario Material Editor template</h1>
    <h2>내용</h2>
    <el-row>
      <el-col :span="6">
        파일 업로드
      </el-col>
      <el-col :span="18">
        TODO: 업로드 [ + ]
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
    description: {{ description }}
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

/**
 * @description 강의자료 에디터
 */
export default {
  name: 'LectureScenarioMaterialEditor',
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingLsItem']),
  },
  computed: {
    ...mapState('teacher', ['lectureScenario', 'currentEditingLsItem']),
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLsItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLsItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingLsItem({
          currentEditingLsItem: {
            ...vm.currentEditingLsItem,
            description,
          },
        });
      },
    },
  },
};
</script>
