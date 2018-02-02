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

          <class-scenario />

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
import { mapGetters } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import TeachingClassListAside from '../partials/TeachingClassListAside';
// import teacherService from '../../services/teacherService';
// import classService from '../../services/classService';


export default {
  name: 'TeacherClassIndex',
  computed: {
    ...mapGetters('teacher', [
      'isTeachingClassListEmpty',
      'currentClass',
    ]),
  },
  components: {
    ClassScenario,
    ClassStatistics,
    TeachingClassListAside,
  },
};

</script>
