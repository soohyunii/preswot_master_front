<template>
  <div id="teacher_class_grading_wrapper">
    teacher class graindg template {{ $route.params.classId }}
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TeacherClassGrading',
  created() {
    const vm = this;
    const classId = vm.$route.params.classId;
    vm.getClassNeedGrading({
      classId,
    });
  },
  methods: {
    ...mapActions('grading', [
      'getClassNeedGrading',
    ]),
  },
};
</script>
