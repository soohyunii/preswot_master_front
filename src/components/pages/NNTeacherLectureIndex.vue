<template>
  <div id="teacher_lecture_index_wrapper" class="bt-container">
    <h2>TODO: 과목명 classId: {{ classId }}</h2>

    <lecture-list
      @row-click="onClickLecture"
      @delete="onClickDelete"
      type="TEACHER"
      :list="[]"
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
import LectureList from '../partials/LectureList';

export default {
  name: 'TeacherLectureIndex',
  components: {
    LectureList,
  },
  data() {
    return {
    };
  },
  computed: {
    classId() {
      const vm = this;
      return vm.$route.params.classId;
    },
  },
  methods: {
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

