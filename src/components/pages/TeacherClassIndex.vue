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
          currentClass: <pre style="font-size: 70%;">{{ currentClass }}</pre>
          <h3>{{ currentClass.name }}</h3><hr>

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
import { mapGetters, mapActions } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import TeachingClassListAside from '../partials/TeachingClassListAside';
// import teacherService from '../../services/teacherService';
// import classService from '../../services/classService';


export default {
  name: 'TeacherClassIndex',
  // TODO: Replace dummy functions
  data() {
    return {
      scenarioList: [],
    };
  },
  computed: {
    ...mapGetters('teacher', [
      'isTeachingClassListEmpty',
      'currentClass',
    ]),
  },
  methods: {
    ...mapActions('teacher', ['fetchClass']),
    // TODO: delete
    //   async changeScenario() {
  //     const vm = this;
  //     const teachingClassName = vm.currentEditingClass;
  //     vm.scenarioList = await teacherService.fetchScenarioList({ teachingClassName });
  //   },
  },
  // TODO: delete
  async mounted() {
    const vm = this;
    vm.$watch(
      () => (vm.currentClass),
      async () => {
        await vm.fetchClass();
        vm.$forceUpdate();
        // console.log('ddd', vm.currentClass);
        // const res = await classService.fetchClass({
        //   id: vm.currentClass.class_id,
        // });
        // console.log('res', res);
      },
    );
  },
  components: {
    ClassScenario,
    ClassStatistics,
    TeachingClassListAside,
  },
};

</script>
