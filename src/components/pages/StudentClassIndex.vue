<template>
  <div class="wrapper">
    <el-container>
      <class-list-aside type="STUDENT" />

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
          <el-button @click="onClick('ANALYSIS')">과목저널링</el-button>
          <br /><br />

          <class-scenario type="STUDENT" />

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
import { mapState, mapGetters, mapMutations } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import ClassListAside from '../partials/ClassListAside';
import utils from '../../utils';

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
    ...mapMutations('analysis', ['updateClassId']),
    onClick(type) {
      const vm = this;
      const userId = utils.getUserIdFromJwt();
      switch (type) {
        case 'ANALYSIS': {
          vm.updateClassId({
            classId: vm.currentStudyingClass.class_id,
          });
          vm.$router.push(`/a/student/class/${vm.currentStudyingClass.class_id}/${userId}/journal`);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};

</script>
