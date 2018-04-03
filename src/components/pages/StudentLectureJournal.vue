<template>
  <div>
    <div class="classTitle">과목명: {{ analysisData['result1'][0].name }}</div>
    <div class="num_student">수강 인원: {{ analysisData['result1'][0].num_student_on_lecture }}</div>
    <time-line :chartData = "analysisData.result2"/>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="index"
        label="강의 명"
        sortable
        width="120">
        <template slot-scope="scope">
          {{ scope.row.row_name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="이해도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="scope.row.percentUnderstanding"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_understanding_score.toFixed(1)}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_understanding_score.toFixed(1)}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_understanding_score.toFixed(1)}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_understanding_score.toFixed(1)}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_understanding_score.toFixed(1)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="집중도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="scope.row.percentConcentration"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_concentration_score.toFixed(1)}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_concentration_score.toFixed(1)}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_concentration_score.toFixed(1)}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_concentration_score.toFixed(1)}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_concentration_score.toFixed(1)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="참여도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="scope.row.percentParticipation"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_participation_score.toFixed(1)}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_participation_score.toFixed(1)}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_participation_score.toFixed(1)}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_participation_score.toFixed(1)}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_participation_score.toFixed(1)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="통계 보기"
        sortable
        width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="onClick('LECTURE_ANALYSIS', scope.row.lecture_id)">
            상세 로그
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
  .slider_div{
    position: relative;
  }
  .emptyDiv{
    width:100%;
    height:1px;
  }
  .slider_label{
    width: 100%;
    top: 0px;
    height: 100%;
    border-radius: 50%;
    .q1 {
      width: 23.6%;
    }
    .q2 {
      width: 24.9%;
    }
    .q3 {
      width: 25.1%;
    }
    .q4 {
      width: 20%;
    }
  }
  .slider_label_q{
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    font-size: 10px;
  }
</style>

<style lang="scss">
  .el-slider__button{
    width:0px;
    height:0px;
    border: none;
  }
  .el-slider__runway{
    cursor: context-menu;
  }
  .el-slider__runway.disabled, .el-slider__runway.disabled .el-slider__button-wrapper:hover, .el-slider__runway.disabled .el-slider__button-wrapper.hover
  {
    cursor: context-menu;
  }
  .el-progress-bar__outer{
    background-color:#ffffff;
  }
  .el-slider__runway.disabled .el-slider__bar{
    background-color:#41355e;
  }

</style>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import utils from '../../utils';
  import TimeLine from '../partials/TimeLine';
  import TeacherClassJournalDetail from '../partials/TeacherClassJournalDetail';

  export default {
    name: 'StudentLectureJournal',
    components: {
      TimeLine,
      TeacherClassJournalDetail,
    },
    data() {
      return {
        defaultValue: 0,
        isStudent: 1,
      };
    },
    async beforeMount() {
      const vm = this;
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 1,
      });
      vm.updateAnalysisOpt({
        analysisOpt: 1,
      });
      vm.updateLectureId({
        lectureId: Number.parseInt(vm.$route.params.lectureId, 10),
      });
      await vm.getAnalysisData();
    },
    methods: {
      ...mapMutations('analysis', ['updateClassId', 'updateUserId', 'updateIsStudent', 'updateLectureId', 'updateAnalysisOpt']),
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      onClick(type, lectureId) {
        const vm = this;
        switch (type) {
          case 'LECTURE_ANALYSIS': {
            vm.updateLectureId({
              // eslint-disable-next-line
              lectureId: lectureId,
            });
            vm.$router.push({
              name: 'StudentLectureJournal',
            });
            break;
          }
          default: {
            throw new Error('not defined type', type);
          }
        }
      },
    },
    computed: {
      ...mapState('analysis', ['analysisData', 'lectureId']),
      tableData: {
        get() {
          const vm = this;
          const returnArr = [];
          // eslint-disable-next-line
          const o0PercentParticipation = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o0_num_better_participation_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o0PercentUnderstanding = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o0_num_better_understanding_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o0PercentConcentration = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o0_num_better_concentration_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o1PercentParticipation = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o1_num_better_participation_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o1PercentUnderstanding = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o1_num_better_understanding_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o1PercentConcentration = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o1_num_better_concentration_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o2PercentParticipation = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o2_num_better_participation_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o2PercentUnderstanding = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o2_num_better_understanding_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          // eslint-disable-next-line
          const o2PercentConcentration = (vm.analysisData.result1[0].num_student_on_lecture - vm.analysisData.result1[0].o2_num_better_concentration_score) / vm.analysisData.result1[0].num_student_on_lecture * 100;
          returnArr.push({
            row_name: '예습',
            max_participation_score: vm.analysisData.result1[0].o0_max_participation_score,
            max_concentration_score: vm.analysisData.result1[0].o0_max_concentration_score,
            max_understanding_score: vm.analysisData.result1[0].o0_max_understanding_score,
            q1_participation_score: vm.analysisData.result1[0].o0_q1_participation_score,
            q1_concentration_score: vm.analysisData.result1[0].o0_q1_concentration_score,
            q1_understanding_score: vm.analysisData.result1[0].o0_q1_understanding_score,
            q2_participation_score: vm.analysisData.result1[0].o0_q2_participation_score,
            q2_concentration_score: vm.analysisData.result1[0].o0_q2_concentration_score,
            q2_understanding_score: vm.analysisData.result1[0].o0_q2_understanding_score,
            q3_participation_score: vm.analysisData.result1[0].o0_q3_participation_score,
            q3_concentration_score: vm.analysisData.result1[0].o0_q3_concentration_score,
            q3_understanding_score: vm.analysisData.result1[0].o0_q3_understanding_score,
            min_participation_score: vm.analysisData.result1[0].o0_min_participation_score,
            min_concentration_score: vm.analysisData.result1[0].o0_min_concentration_score,
            min_understanding_score: vm.analysisData.result1[0].o0_min_understanding_score,
            // eslint-disable-next-line
            num_better_participation_score: vm.analysisData.result1[0].o0_num_better_participation_score,
            // eslint-disable-next-line
            num_better_concentration_score: vm.analysisData.result1[0].o0_num_better_concentration_score,
            // eslint-disable-next-line
            num_better_understanding_score: vm.analysisData.result1[0].o0_num_better_understanding_score,
            num_student_on_lecture: vm.analysisData.result1[0].num_student_on_lecture,
            percentParticipation: o0PercentParticipation,
            percentUnderstanding: o0PercentUnderstanding,
            percentConcentration: o0PercentConcentration,
          },
            {
              row_name: '본강의',
              max_participation_score: vm.analysisData.result1[0].o1_max_participation_score,
              max_concentration_score: vm.analysisData.result1[0].o1_max_concentration_score,
              max_understanding_score: vm.analysisData.result1[0].o1_max_understanding_score,
              q1_participation_score: vm.analysisData.result1[0].o1_q1_participation_score,
              q1_concentration_score: vm.analysisData.result1[0].o1_q1_concentration_score,
              q1_understanding_score: vm.analysisData.result1[0].o1_q1_understanding_score,
              q2_participation_score: vm.analysisData.result1[0].o1_q2_participation_score,
              q2_concentration_score: vm.analysisData.result1[0].o1_q2_concentration_score,
              q2_understanding_score: vm.analysisData.result1[0].o1_q2_understanding_score,
              q3_participation_score: vm.analysisData.result1[0].o1_q3_participation_score,
              q3_concentration_score: vm.analysisData.result1[0].o1_q3_concentration_score,
              q3_understanding_score: vm.analysisData.result1[0].o1_q3_understanding_score,
              min_participation_score: vm.analysisData.result1[0].o1_min_participation_score,
              min_concentration_score: vm.analysisData.result1[0].o1_min_concentration_score,
              min_understanding_score: vm.analysisData.result1[0].o1_min_understanding_score,
              // eslint-disable-next-line
              num_better_participation_score: vm.analysisData.result1[0].o1_num_better_participation_score,
              // eslint-disable-next-line
              num_better_concentration_score: vm.analysisData.result1[0].o1_num_better_concentration_score,
              // eslint-disable-next-line
              num_better_understanding_score: vm.analysisData.result1[0].o1_num_better_understanding_score,
              num_student_on_lecture: vm.analysisData.result1[0].num_student_on_lecture,
              percentParticipation: o1PercentParticipation,
              percentUnderstanding: o1PercentUnderstanding,
              percentConcentration: o1PercentConcentration,
            },
            {
              row_name: '복습',
              max_participation_score: vm.analysisData.result1[0].o2_max_participation_score,
              max_concentration_score: vm.analysisData.result1[0].o2_max_concentration_score,
              max_understanding_score: vm.analysisData.result1[0].o2_max_understanding_score,
              q1_participation_score: vm.analysisData.result1[0].o2_q1_participation_score,
              q1_concentration_score: vm.analysisData.result1[0].o2_q1_concentration_score,
              q1_understanding_score: vm.analysisData.result1[0].o2_q1_understanding_score,
              q2_participation_score: vm.analysisData.result1[0].o2_q2_participation_score,
              q2_concentration_score: vm.analysisData.result1[0].o2_q2_concentration_score,
              q2_understanding_score: vm.analysisData.result1[0].o2_q2_understanding_score,
              q3_participation_score: vm.analysisData.result1[0].o2_q3_participation_score,
              q3_concentration_score: vm.analysisData.result1[0].o2_q3_concentration_score,
              q3_understanding_score: vm.analysisData.result1[0].o2_q3_understanding_score,
              min_participation_score: vm.analysisData.result1[0].o2_min_participation_score,
              min_concentration_score: vm.analysisData.result1[0].o2_min_concentration_score,
              min_understanding_score: vm.analysisData.result1[0].o2_min_understanding_score,
              // eslint-disable-next-line
              num_better_participation_score: vm.analysisData.result1[0].o2_num_better_participation_score,
              // eslint-disable-next-line
              num_better_concentration_score: vm.analysisData.result1[0].o2_num_better_concentration_score,
              // eslint-disable-next-line
              num_better_understanding_score: vm.analysisData.result1[0].o2_num_better_understanding_score,
              num_student_on_lecture: vm.analysisData.result1[0].num_student_on_lecture,
              percentParticipation: o2PercentParticipation,
              percentUnderstanding: o2PercentUnderstanding,
              percentConcentration: o2PercentConcentration,
            });
          return returnArr;
        },
      },
    },
  };
</script>
