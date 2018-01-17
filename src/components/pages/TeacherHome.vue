<template>
  <div>
    <el-container>
      <teaching-class-list @moveClass="changeScenario"/>

      <el-main>
        <h3>{{ currentEditingClass }}</h3><hr>

        <!-- TODO: translation -->
        <!-- TODO: Link to each page per button-->
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />

        <lecture-list :tableData="scenarioList"></lecture-list>

        <!-- TODO: Implement dummy response about lecture statistics -->
        <lecture-statistics></lecture-statistics>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LectureList from '../partials/LectureList';
import LectureStatistics from '../partials/LectureStatistics';
import TeachingClassList from '../partials/TeachingClassList';
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
    LectureList,
    LectureStatistics,
    TeachingClassList,
  },
};

</script>

<style lang="scss" scoped>
</style>