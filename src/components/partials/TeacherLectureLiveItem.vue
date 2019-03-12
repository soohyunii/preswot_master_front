<template>
  <div>
    <div>
      <p>
        강의도구 화면
        <!--<el-button style="float:right" type="primary" @click="onClick('HIDE',lectureItemId)">숨기기</el-button>-->
      </p>
      <!-- <p>현재: {{ data.name }}</p> -->
    </div>
      <lecture-live-item
        :data="data"
        :onClick="onClick"
        type="TEACHER"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import lectureItemService from '../../services/lectureItemService';
import LectureLiveItem from './LectureLiveItem';
import LectureQuestionResult from './LectureQuestionResult';
import LectureSurveyResult from './LectureSurveyResult';

export default {
  async created() {
    const vm = this;
    const res = await lectureItemService.getLectureItem({
      lectureItemId: vm.lectureItemId,
    });
    vm.data = res.data;
  },
  props: ['onClick', 'lectureItemId', 'classId'],
  data() {
    return {
      data: undefined,
    };
  },
  components: {
    LectureLiveItem,
    LectureQuestionResult,
    LectureSurveyResult,
  },
  computed: {
    ...mapState('grading', [
      'theResult',
      'questionResult',
      'surveyResult',
    ]),
    ...mapGetters('class', [
      'numberOfStudentInClass',
    ]),
  },
  methods: {
    ...mapActions('grading', [
      'getClassTotalResult',
      'getQuestionResult',
      'getSurveyResult',
    ]),
    preOnClick(type) {
      const vm = this;
      vm.onClick(type);
    },
  },
};
</script>

<style>

</style>
