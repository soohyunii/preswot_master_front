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
          <el-slider v-model="defaultValue"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_understanding_score}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_understanding_score}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_understanding_score}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_understanding_score}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_understanding_score}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="집중도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="defaultValue"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_concentration_score}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_concentration_score}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_concentration_score}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_concentration_score}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_concentration_score}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="참여도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="defaultValue"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_participation_score}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_participation_score}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_participation_score}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_participation_score}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_participation_score}}</div>
          </div>
        </template>
      </el-table-column>
      <!--
      <el-table-column
        prop="index"
        label="통계 보기"
        sortable
        width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="onClick('LECTURE_ANALYSIS', scope.row.lecture_id)">
            강의 상세 로그
          </el-button>
        </template>
      </el-table-column>
      -->
    </el-table>
    <teacher-class-journal-detail :lectureId = "lectureId" v-if = "isActiveInfo"/>
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
  }
  .slider_label_q{
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    font-size: 10px;
  }
  .slider_label_q.q1{
    width:23.6%;
  }
  .slider_label_q.q2{
    width:24.9%;
  }
  .slider_label_q.q3{
    width:25.1%;
  }
  .slider_label_q.q4{
    width:20%;
  }
  .slider_label_q.q5{
  }
  .slider_label{
    border-radius: 50%;
  }

</style>

<style lang="scss">
  .el-slider__button-wrapper{
    display:none !important;
  }
  .el-slider__runway{
    cursor: auto;
  }
  .el-progress-bar__outer{
    background-color:#ffffff;
  }

</style>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import utils from '../../utils';
  import TimeLine from '../partials/TimeLine';
  import TeacherClassJournalDetail from '../partials/TeacherClassJournalDetail';

  export default {
    name: 'TeacherLectureJournal',
    components: {
      TimeLine,
      TeacherClassJournalDetail,
    },
    data() {
      return {
        defaultValue: 0,
        isStudent: 0,
      };
    },
    async beforeMount() {
      const vm = this;
      /*
      vm.updateLectureId({
        lectureId: 1,
      });
      */
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 0,
      });
      vm.updateAnalysisOpt({
        analysisOpt: 1,
      });
      await vm.getAnalysisData();
      console.log(vm.analysisData);
    },
    methods: {
      ...mapMutations('analysis', ['updateClassId', 'updateUserId', 'updateIsStudent', 'updateIsActiveInfo', 'updateLectureId', 'updateAnalysisOpt']),
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      onClick(type, lectureId) {
        const vm = this;
        switch (type) {
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
          var returnArr = [];
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
            })
          /*
          return vm.analysisData.map((lecture, index) => {
            const type = utils.convertScType(sc.type);

            const date = (() => {
              if (!sc.intended_start) {
                return '미정 TODO: 미정 없어져야함'; // TODO: intended_start 꼭 있어야함!
              }
              const startDate = new Date(sc.intended_start);
              if (!sc.intended_end) {
                return `${utils.formatDate(startDate)} ~ 계속`;
              }
              const endDate = new Date(sc.intended_end);
              return `${utils.formatDate(startDate)} ~ ${utils.formatDate(endDate)}`;
            })();

            return {
              index,
              type,
              scId: sc.lecture_id,
              scType: '실시간',
              teacher: sc.teacher_id,
              title: sc.name,
              date,
            };
          });
          */
          return returnArr;
        },
      },
    },
  };
</script>
