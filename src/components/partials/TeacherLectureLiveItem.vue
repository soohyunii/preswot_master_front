<template>
  <div>
    <div>
      <p>
        강의도구 화면
        <el-button style="float:right" type="primary" size="small" @click="onClick('HIDE',lectureItemId)">내리기</el-button>
      </p>
      <!-- <p>현재: {{ data.name }}</p> -->
    </div>
    <div v-for="(lectureItem, index) in data" :key="lectureItem.lecture_item_id">
      <lecture-live-item
        :dataIndex="index"
        :data="lectureItem"
        :answers="answers"
        :lectureItemId="lectureItem.lecture_item_id"
        :onClick="onClick"/>
    </div>
    <el-button style="float:right" type="primary" size="small" @click="preOnClick('SUBMIT')">제출</el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import lectureItemService from '../../services/lectureItemService';
import LectureLiveItem from './LectureLiveItem';
import LectureQuestionResult from './LectureQuestionResult';
import LectureSurveyResult from './LectureSurveyResult';
import { EventBus } from '../../event-bus';

export default {
  async created() {
    const vm = this;
    vm.lectureItemId.forEach(async (item) => {
      const res = await lectureItemService.getLectureItem({
        lectureItemId: item,
      });
      vm.data.push(res.data);
      vm.answers.push([]);
    });
  },
  mounted() {
    const vm = this;
    EventBus.$on('clearAnswer', vm.clearAnswer);
  },
  props: ['onClick', 'lectureItemId', 'classId'],
  data() {
    return {
      data: [],
      answers: [],
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
      vm.clearAnswer();
    },
    clearAnswer() {
      const vm = this;
      vm.answers = [];
      vm.data.forEach(async (item) => {
        if (item.questions.length !== 0) {
          vm.answers.push([]);
        }
      });
    },
  },
};
</script>

<style>

</style>
