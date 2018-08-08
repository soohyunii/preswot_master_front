<template>
  <div>
    <div>
      <p>강의도구 화면</p>
      <el-button style="float:right" type="primary" size="small" @click="onClick('HIDE',lectureItemId)">내리기</el-button>
      <p>현재: {{ data.name }}</p>
    </div>
    <lecture-live-item
      :data="data"
      :lectureItemId="lectureItemId"
      :onClick="onClick"/>
    <!-- <lecture-question-result
      v-if="data.type === 0"
      :classId="classId"
      :itemId="lectureItemId"
      resultType="실시간"/>
    <lecture-survey-result
      v-if="data.type === 1"
      :classId="classId"
      :itemId="lectureItemId"
      resultType="실시간"/> -->
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
      data: {},
    };
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
  },
  components: {
    LectureLiveItem,
    LectureQuestionResult,
    LectureSurveyResult,
  },
};
</script>