<template>
  <div>
    {{ classId }}
    NNTeacherLectureIndex template
  </div>
</template>

<script>
export default {
  name: 'TeacherLectureIndex',
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
}
</script>

