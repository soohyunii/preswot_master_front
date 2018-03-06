<template>
  <div>
    <div class="classTitle">과목명: {{ analysisData[0].class_name }}</div>
    <div class="num_student">수강 인원: {{ analysisData[0].class_num_student }}</div>
    <line-chart :chartData = "analysisData" :isStudent = "isStudent"/>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="index"
        label="강의 명"
        sortable
        width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="이해도"
        sortable
        style="width: 10%">
        <template slot-scope="scope">
          <el-slider v-model="(scope.row.class_num_student - scope.row.num_better_understanding_score)/scope.row.class_num_student * 100"  :step="25" disabled show-stops>
            <div class="sex">zxc</div>
          </el-slider>
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
          <el-slider v-model="(scope.row.class_num_student - scope.row.num_better_concentration_score)/scope.row.class_num_student * 100"  :step="25" disabled show-stops></el-slider>
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
          <el-slider v-model="(scope.row.class_num_student - scope.row.num_better_participation_score)/scope.row.class_num_student * 100"  :step="25" disabled show-stops></el-slider>
          <div class = "slider_label">
            <div class= "slider_label_q q1">{{scope.row.min_participation_score}}</div>
            <div class= "slider_label_q q2">{{scope.row.q1_participation_score}}</div>
            <div class= "slider_label_q q3">{{scope.row.q2_participation_score}}</div>
            <div class= "slider_label_q q4">{{scope.row.q3_participation_score}}</div>
            <div class= "slider_label_q q5">{{scope.row.max_participation_score}}</div>
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
            강의 상세 통계
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

</style>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import utils from '../../utils';
  import LineChart from '../partials/LineChart';

  export default {
    name: 'StudentClassJournal',
    components: {
      LineChart,
    },
    data() {
      return {
        defaultValue: 0,
        isStudent: 1,
      };
    },
    async beforeMount() {
      const vm = this;
      vm.updateClassId({
        classId: 2,
      });
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 1,
      });
      vm.updateAnalysisOpt({
        analysisOpt: 0,
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
        console.log(lectureId);
        switch (type) {
          case 'STUDENT_STAT': {
            vm.updateLectureId({
              // eslint-disable-next-line
              lectureId: lectureId,
            });
            vm.updateIsActiveInfo({
              isActiveInfo: true,
            });
            break;
          }
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
      ...mapState('analysis', ['analysisData', 'isActiveInfo', 'lectureId']),
      tableData: {
        get() {
          const vm = this;
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
          return vm.analysisData;
        },
      },
    },
  };
</script>
