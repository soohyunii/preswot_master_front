<template>
  <div>
    <el-container>
      <teaching-class-list @moveClass="moveClass"/>

      <el-main>
        <h3>{{ currentClassName }}</h3><hr>

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
import LectureList from '../partials/LectureList';
import LectureStatistics from '../partials/LectureStatistics';
import TeachingClassList from '../partials/TeachingClassList';
import teacherService from '../../services/teacherService';

export default {
  name: 'TeacherHome',
  data() {
    return {
      scenarioList: [],
      currentClassName: '',
    };
  },
  // TODO: Replace dummy functions
  methods: {
    async moveClass({ whereToMove }) {
      const vm = this;
      vm.currentClassName = whereToMove;
      // window.console.log('parent', whereToMove);
      const teachingClassName = vm.currentClassName;
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