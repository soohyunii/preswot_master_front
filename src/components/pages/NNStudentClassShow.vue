<template>
  <div id="student_lecture_index_wrapper" class="bt-container">
    <h2>{{ currentStudyingClass(classId) ? currentStudyingClass(classId).name : '' }}</h2>
    <div class="right-align margin-bottom-15">
      <el-button @click="onClick('KNOWLEDGEMAP')">과목지식맵</el-button>
      <el-button @click="onClick('ANALYSIS')">과목저널링</el-button>
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
    // FIXME: vm.getClass가 불릴 때 classStore.state.teachingClassList가
    // 아직 채워지지 않은 경우가 있음
    // 그래서 그냥 불렀는데. 구조적으로 개선이 필요함
    // 지금 꽤나 여러군데에서 getMyClassLists를 부르고 있다는 것이.. 좀..
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
          // TODO : 수강 여부 서버쪽 개발되면 반영할 것
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
</style>
