<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    NN teacher lecture manage template<br />
    lecture id: {{ lectureId }}
  </div>
</template>

<script>
export default {
  name: 'TeacherLcetureManage',
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
  },
};
</script>

