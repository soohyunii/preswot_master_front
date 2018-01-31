<template>
  <div class="wrapper">
    <el-container>
      <teaching-class-list-aside />

      <el-main>
        <div
          class="info-box"
          v-if="isTeachingClassListEmpty"
        >
          TODO: Teaching Class List Empty!
        </div>
        <div
          class="info-box"
          v-else-if="!currentClass"
        >
          TODO: Select Class from left menus!
        </div>
        <div v-else>
          <h3>{{ currentEditingClass }}</h3><hr>

          <!-- TODO: translation -->
          <!-- TODO: Link to each page per button-->
          <el-button>과목지식맵</el-button>
          <el-button>과목큐레이션</el-button>
          <el-button>과목저널링</el-button>
          <br /><br />

          <class-scenario :tableData="scenarioList"></class-scenario>

          <!-- TODO: Implement dummy response about class statistics -->
          <class-statistics />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  .info-box {
    background-color: white;
    padding: 200px 0px;
    text-align: center;
  }
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import TeachingClassListAside from '../partials/TeachingClassListAside';
import teacherService from '../../services/teacherService';

export default {
  name: 'TeacherClassIndex',
  // TODO: Replace dummy functions
  data() {
    return {
      scenarioList: [],
    };
  },
  computed: {
    ...mapState('teacher', ['currentEditingClass']),
    ...mapGetters('teacher', ['isTeachingClassListEmpty']),
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
