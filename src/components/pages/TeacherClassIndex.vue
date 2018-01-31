<template>
  <div>
    <el-container>
      <teaching-class-list-aside />

      <el-main>
        <h3>{{ currentEditingClass }}</h3><hr>

        <!-- TODO: translation -->
        <!-- TODO: Link to each page per button-->
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />

        <class-scenario :tableData="scenarioList"></class-scenario>

        <!-- TODO: Implement dummy response about lecture statistics -->
        <class-statistics />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import TeachingClassListAside from '../partials/TeachingClassListAside';
import teacherService from '../../services/teacherService';

export default {
  name: 'TeacherHome',
  // TODO: Replace dummy functions
  data() {
    return {
      scenarioList: [],
    };
  },
  computed: {
    ...mapState('teacher', ['currentEditingClass']),
  },
  methods: {
    async changeScenario() {
      const vm = this;
      const teachingClassName = vm.currentEditingClass;
      vm.scenarioList = await teacherService.fetchScenarioList({ teachingClassName });
    },
  },
  components: {
    ClassScenario,
    ClassStatistics,
    TeachingClassListAside,
  },
};

</script>

<style lang="scss" scoped>
</style>