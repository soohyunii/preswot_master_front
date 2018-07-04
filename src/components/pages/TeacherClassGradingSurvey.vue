<template>
  <div class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > 결과보기</h2>
    survey
  </div>
</template>

<style lang="scss" scoped>
  #teacher_class_grading_wrapper {
  }
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'TeacherClassGradingSurvey',
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
      if (!vm.theResult) {
        vm.getClassTotalResult({
          classId: vm.classId,
        });
      }

    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getQuestionResult',
      ]),
    },
  };
</script>
