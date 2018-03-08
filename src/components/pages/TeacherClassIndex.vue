<template>
  <div class="wrapper">
    <el-container>
      <class-list-aside type="TEACH" />

      <el-main>
        <div
          class="info-box"
          v-if="isTeachingClassListEmpty"
        >
          TODO: Teaching Class List Empty!
        </div>
        <div
          class="info-box"
          v-else-if="!currentTeachingClass"
        >
          TODO: Select Class from left menus!
        </div>
        <div v-else>
          <h3>{{ currentTeachingClass.name }}</h3><hr>

          <!-- TODO: translation -->
          <!-- TODO: Link to each page per button-->
          <el-button @click="onClick('EVALUATION')">과목진단</el-button>
          <el-button @click="onClick('OPEN_KNOWLEDGEMAP_MODAL')">과목지식맵</el-button>
          <el-button @click="onClick('ANALYSIS')">과목저널링</el-button>
          <el-button type="primary" @click="onClick('EDIT')">과목수정</el-button>
          <el-button type="danger" @click="onClick('DELETE')">과목삭제</el-button>
          <br /><br />

          <class-scenario type="TEACH" />

          <!-- TODO: Implement dummy response about class statistics -->
          <class-statistics />
        </div>
        <el-col>
      <el-dialog
        title="과목 지식맵 & 워드 클라우드"
        :visible.sync="isModalVisible"
        width="70%"
        center
      >
        <class-knowledge-map />
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="onClick('CONFIRM')"
          >
            Confirm
          </el-button>
        </span>
      </el-dialog>
    </el-col>
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import ClassKnowledgeMap from '../partials/ClassKnowledgeMap';
// import teacherService from '../../services/teacherService';
// import classService from '../../services/classService';
import ClassListAside from '../partials/ClassListAside';


export default {
  name: 'TeacherClassIndex',
  data() {
    return {
      isModalVisible: false,
    };
  },
  computed: {
    ...mapState('class', ['teachingClassList', 'currentClassIndex']),
    ...mapGetters('class', [
      'currentTeachingClass',
      'isTeachingClassListEmpty',
    ]),
  },
  components: {
    ClassScenario,
    ClassStatistics,
    ClassKnowledgeMap,
    ClassListAside,
  },
  methods: {
    ...mapMutations('class', ['deleteTeachingClass']),
    ...mapMutations('analysis', ['updateClassId']),
    ...mapActions('class', ['deleteClass']),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'EVALUATION': {
          vm.$router.push(`/a/teacher/class/${vm.currentClass.class_id}/evaluation`);
          break;
        }
        case 'ANALYSIS': {
          vm.updateClassId({
            classId: vm.currentTeachingClass.class_id,
          });
          vm.$router.push('/a/teacher/class/journal');
          break;
        }
        case 'OPEN_KNOWLEDGEMAP_MODAL': {
          vm.isModalVisible = true;
          break;
        }
        case 'CONFIRM': {
          vm.isModalVisible = false;
          break;
        }
        case 'EDIT': {
          vm.$router.push(`/a/teacher/class/${vm.currentTeachingClass.class_id}/edit`);
          break;
        }
        case 'DELETE': {
          vm.$confirm('정말로 이 과목을 삭제하시겠습니까?', `${vm.currentTeachingClass.name || ''} 삭제`, {
            confirmButtonText: '예, 삭제합니다.',
            cancelButtonText: '아니요, 삭제하지 않습니다.',
            type: 'warning',
          })
            .then(async () => {
              try {
                const index = vm.currentClassIndex;
                await vm.deleteClass();
                vm.deleteTeachingClass({
                  teachingClassIndex: index,
                });
                vm.$notify({
                  title: '삭제됨',
                  message: '과목이 삭제됨',
                  type: 'success',
                  duration: 3000,
                });
              } catch (error) {
                vm.$notify({
                  title: '과목 삭제 실패',
                  message: error.toString(),
                  type: 'error',
                  duration: 3000,
                });
              }
            })
            .catch(() => {
              vm.$notify({
                title: '취소됨',
                message: '과목 삭제 취소됨',
                type: 'info',
                duration: 3000,
              });
            });
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
