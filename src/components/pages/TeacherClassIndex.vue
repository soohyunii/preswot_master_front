<template>
  <div class="wrapper">
    <el-container>
      <class-list-aside />

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
          <h3>{{ currentClass.name }}</h3><hr>

          <!-- TODO: translation -->
          <!-- TODO: Link to each page per button-->
          <el-button>과목지식맵</el-button>
          <el-button>과목큐레이션</el-button>
          <el-button>과목저널링</el-button>
          <el-button type="primary" @click="onClick('EDIT')">과목수정</el-button>
          <el-button type="danger" @click="onClick('DELETE')">과목삭제</el-button>
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import ClassScenario from '../partials/ClassScenario';
import ClassStatistics from '../partials/ClassStatistics';
import ClassListAside from '../partials/ClassListAside';


export default {
  name: 'TeacherClassIndex',
  computed: {
    ...mapState('class', ['teachingClassList', 'currentClassIndex']),
    ...mapGetters('class', [
      'currentClass',
      'isTeachingClassListEmpty',
    ]),
  },
  components: {
    ClassScenario,
    ClassStatistics,
    ClassListAside,
  },
  methods: {
    ...mapMutations('class', ['deleteTeachingClass']),
    ...mapActions('class', ['deleteClass']),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'EDIT': {
          vm.$router.push(`/a/teacher/class/${vm.currentClass.class_id}/edit`);
          break;
        }
        case 'DELETE': {
          vm.$confirm('정말로 이 과목을 삭제하시겠습니까?', `${vm.currentClass.name || ''} 삭제`, {
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
