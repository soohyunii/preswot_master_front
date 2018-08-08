<template>
  <div id="student_lecture_index_wrapper" class="bt-container" oncontextmenu="return false">
    <h2>{{ currentStudyingClass(classId) ? currentStudyingClass(classId).name : '' }}</h2>
    <div class="right-align margin-bottom-15">
      <!-- <el-button @click="onClick('KNOWLEDGEMAP')">과목지식맵</el-button> -->
      <!-- <el-button @click="onClick('ANALYSIS')">과목저널링</el-button> -->
      <el-button :class="$attachReactablePostfix('btn-board')" @click="onClick('Q&A')">게시판</el-button>
      <el-button :class="$attachReactablePostfix('btn-show-result')" @click="onClick('GRADE')">결과보기</el-button>
    </div>
    <lecture-list
      @row-click="onClickLecture"
      type="STUDENT"
      :list="lectureList"
    />
    <br />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';

export default {
  name: 'StudentClassShow',
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
    await vm.getClass({
      type: 'STUDENT',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('NNclass', [
      'studyingClassList',
    ]),
    ...mapGetters('NNclass', [
      'currentStudyingClass',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
    lectureList() {
      const vm = this;
      if (!vm.studyingClassList) {
        return [];
      }
      const currentClass = vm.currentStudyingClass(vm.classId);
      if (currentClass && currentClass.lectures) {
        return currentClass.lectures.map((item) => {
          const type = utils.convertLcItemTypeKor(item.type);
          // eslint-disable-next-line no-param-reassign
          item.type = type;
          // eslint-disable-next-line no-param-reassign
          item.heard = (item.heartbeat_counts.length > 0) ? '수강완료' : '수강미완료';
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
      switch (type) {
        case 'KNOWLEDGEMAP': {
          // TODO : link
          // vm.$router.push(`/a/teacher/class/${vm.classId}/evaluation`);
          break;
        }
        case 'ANALYSIS': {
          // TODO : link
          // vm.$router.push(`/a/teacher/class/${vm.classId}/journal`);
          break;
        }
        case 'Q&A': {
          vm.$router.push(`/a/class/${vm.classId}/board/0`);
          break;
        }
        case 'GRADE': {
          vm.$router.push(`/a/student/class/${vm.classId}/grade`);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickLecture() {
      // 없으면 LectureList.vue 에러나는데 TeacherClassShow와 같이 쓰고있어서 빈 메소드를 넣어둠.
    },
  },
};
</script>

<style lang="scss" scoped>
#student_lecture_index_wrapper {
  .right-align {
    text-align: right;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }
}
.btn-board-phone {
  display: none;
}
.btn-show-result-phone {
  display: none;
}
</style>
