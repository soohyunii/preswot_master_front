<template>
  <div id="teacher_lecture_index" class="bt-container">
    <h2>TODO: 과목명 classId: {{ classId }}</h2>

    <lecture-list
      @row-click="onClickLecture"
      @delete="onClickDelete"
      type="TEACHER"
      :list="[]"
    />
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
    onClickLecture(row, a, column) {
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

