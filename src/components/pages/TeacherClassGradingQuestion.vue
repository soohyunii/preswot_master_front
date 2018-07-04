<template>
  <div id="teacher_class_grading_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > 결과보기</h2>
    question
  </div>
</template>

<style lang="scss" scoped>
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'TeacherClassGradingQuestion',
    data() {
      return {
        activeTab: 'question',
      };
    },
    computed: {
      ...mapState('grading', [
        'theResult',
        'surveyList',
        'questionList',
      ]),
      ...mapGetters('NNclass', [
        'currentTeachingClass',
      ]),
      classId() {
        const vm = this;
        return Number.parseInt(vm.$route.params.classId, 10);
      },
    },
    created() {
      const vm = this;
      vm.getClassTotalResult({
        classId: vm.classId,
      });
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
      ]),
    },
  };
</script>
