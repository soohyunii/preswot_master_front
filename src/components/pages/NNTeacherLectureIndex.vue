<template>
  <div id="teacher_lecture_index_wrapper" class="bt-container">
    <h2>TODO: 과목명 classId: {{ classId }}</h2>

    <!-- teachingClassList: {{ teachingClassList }} -->

    <lecture-list
      @row-click="onClickLecture"
      @delete="onClickDelete"
      type="TEACHER"
      :list="lectureList"
    />

    <br />

    <div class="right-align">
      <router-link to="/a/teacher/NNlecture/new">
        <el-button type="primary">강의 추가</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';

export default {
  name: 'TeacherLectureIndex',
  components: {
    LectureList,
  },
  data() {
    return {
    };
  },
  mounted() {
    const vm = this;
    vm.NNgetClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('class', [
      'teachingClassList',
    ]),
    lectureList() {
      const vm = this;
      if (!vm.teachingClassList) {
        return [];
      }
      const currentClass = vm.teachingClassList.find(item => item.class_id === vm.classId);
      if (currentClass && currentClass.scenarioList) {
        return currentClass.scenarioList.map((item) => {
          const type = utils.convertScType(item.type);
          item.type = type; // eslint-disable-line no-param-reassign
          return item;
        });
      }
      return [];
    },
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
  },
  methods: {
    ...mapActions('class', [
      'NNgetClass',
    ]),
    onClickLecture(row, _, column) {
      if (column.label === '-') {
        return;
      }
      const vm = this;
      vm.$router.push(`/a/teacher/NNclass/${row.class_id}`);
    },
    onClickDelete() {

    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_lecture_index_wrapper {
  .right-align {
    text-align: right;
  }
}
</style>

