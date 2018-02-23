<template>
  <div class="wrapper">
    <el-container>
      <class-list-aside type="STUDY" />

      <el-main>
        <div
          class="info-box"
          v-if="isStudyingClassListEmpty"
        >
          TODO: Studying Class List Empty!
        </div>
        <div
          class="info-box"
          v-else-if="!currentStudyingClass"
        >
          TODO: Select Class from left menus!
        </div>
        <div v-else>
          <h3>{{ currentStudyingClass.name }}</h3><hr>

          <!-- TODO: translation -->
          <!-- TODO: Link to each page per button-->
          <el-button>과목지식맵</el-button>
          <el-button>과목큐레이션</el-button>
          <el-button>과목저널링</el-button>
          <br /><br />

          <class-scenario type="STUDY" />

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
import ClassListAside from '../partials/ClassListAside';


export default {
  name: 'StudentClassIndex',
  computed: {
    ...mapState('class', ['studyingClassList', 'currentClassIndex']),
    ...mapGetters('class', [
      'currentStudyingClass',
      'isStudyingClassListEmpty',
    ]),
  },
  components: {
    ClassScenario,
    ClassStatistics,
    ClassListAside,
  },
  methods: {
  },
};

</script>
