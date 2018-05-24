<template>
  <div id="teacher_lecture_live_wrapper" class="bt-container">
    NN teacher lecture live template,<br />
    lecture id : {{ lectureId }}
  </div>
</template>

<script>
export default {
  name: 'TeacherLectureLive',
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
  },
};
</script>

