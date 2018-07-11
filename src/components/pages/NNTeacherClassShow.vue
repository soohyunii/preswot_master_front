<template>
  <div id="teacher_lecture_index_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }}</h2>
    <div class="right-align margin-bottom-15">
      <el-button @click="onClick('EVALUATION')">과목진단</el-button>
      <el-button @click="onClick('ANALYSIS')">과목저널링</el-button>
      <el-button @click="onClick('Report')">성적표</el-button>
      <el-button @click="onClick('Q&A')">게시판</el-button>
      <el-button @click="onClick('GRADING')">결과보기</el-button>
    </div>
    <lecture-list
      @row-click="onClickLecture"
      @delete="onClickDelete"
      type="TEACHER"
      :list="lectureList"
    />

    <br />

    <div class="right-align">
      <router-link :to="`/a/teacher/NNlecture/new?classId=${classId}`">
        <el-button type="primary">강의 추가</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
// TODO : 180629 - 기존 Q&A 가 '게시판' 으로 바꼈습니다. 모든 변수, 파일명의 Q&A를 board로 바꿀지..?
import { mapState, mapActions, mapGetters } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';
import lectureService from '../../services/lectureService';

export default {
  name: 'TeacherLectureIndex',
  components: {
    LectureList,
  },
  data() {
    return {
    };
  },
  async mounted() {
    const vm = this;
    await vm.getMyClassLists();
    // FIXME: vm.getClass가 불릴 때 classStore.state.teachingClassList가
    // 아직 채워지지 않은 경우가 있음
    // 그래서 그냥 불렀는데. 구조적으로 개선이 필요함
    // 지금 꽤나 여러군데에서 getMyClassLists를 부르고 있다는 것이.. 좀..
    await vm.getClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
    ...mapGetters('NNclass', [
      'currentTeachingClass',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
    lectureList() {
      const vm = this;
      if (!vm.teachingClassList) {
        return [];
      }
      const currentClass = vm.currentTeachingClass(vm.classId);
      if (currentClass && currentClass.lectures) {
        return currentClass.lectures.map((item) => {
          const type = utils.convertScType(item.type);
          // eslint-disable-next-line no-param-reassign
          item.type = type;
          // eslint-disable-next-line no-param-reassign
          item.수강한학생수 = '0'; // TODO 변수명 변경, 값 할당
          // eslint-disable-next-line no-param-reassign
          item.capacity = vm.currentTeachingClass(vm.classId).capacity;
          // eslint-disable-next-line no-param-reassign
          item.수강생이해도 = '0'; // TODO 변수명 변경, 값 할당
          return item;
        });
      }
      return [];
    },
  },
  methods: {
    ...mapActions('NNclass', [
      'getClass',
      'getMyClassLists',
      'deleteScenario',
    ]),
    onClick(type) {
      const vm = this;
      const userId = utils.getUserIdFromJwt();
      switch (type) {
        case 'EVALUATION': {
          vm.$router.push(`/a/teacher/class/${vm.classId}/evaluation`);
          break;
        }
        case 'ANALYSIS': {
          vm.$router.push(`/a/teacher/class/${vm.classId}/journal`);
          break;
        }
        case 'Report': {
          vm.$router.push(`/a/report/teacher/${userId}/class/${vm.classId}/`);
          break;
        }
        case 'Q&A': {
          vm.$router.push(`/a/class/${vm.classId}/board/0`);
          break;
        }
        case 'GRADING': {
          vm.$router.push(`/a/teacher/class/${vm.classId}/grading`);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickLecture(row, _, column) {
      if (column.label === '-') {
        return;
      }
      const vm = this;
      vm.$router.push(`/a/teacher/NNclass/${row.class_id}`);
    },
    onClickDelete(index) {
      const vm = this;
      vm.$confirm('정말로 이 강의를 삭제하시겠습니까?', `${vm.scTitle || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            const currentClass = vm.teachingClassList.find(item => item.class_id === vm.classId);
            const targetLecture = currentClass.lectures[index];
            await lectureService.deleteLecture({ lectureId: targetLecture.lecture_id });
            vm.$notify({
              title: '삭제됨',
              message: '강의가 삭제됨',
              type: 'success',
              duration: 3000,
            });
            vm.deleteScenario({
              classId: vm.classId,
              lectureId: targetLecture.lecture_id,
            });
          } catch (error) {
            vm.$notify({
              title: '강의 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '강의 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_lecture_index_wrapper {
  .right-align {
    text-align: right;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }
}
</style>
