<template>
  <!--<div v-if="analysisData && analysisData[0]" class="bt-container">
    <div class="classTitle">{{ analysisData[0].class_name }} > 저널링</div>-->
  <div class="bt-container">
    <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
      <el-breadcrumb-item :to="{ path: '/a/teacher/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
      <el-breadcrumb-item>저널링</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="강의 흐름" name="basic">
        <span>대상 : </span>
        <span style="display: inline-block; width: 100px">
        <el-select v-model="selectValue" placeholder="Select" @change="onChange()">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </span>
        <line-chart :chartCategories = "chartCategories" :chartData = "chartData"/>

        <el-table
          :data="allData.average"
          style="width: 100%">
          <el-table-column
            label="강의명"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>

          <el-table-column
            label="평균 참여도"
            style="width: 10%">
            <template slot-scope="scope">
              <span v-if="selectValue === '전체'">{{ (scope.row.participation * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '예습'">{{ (scope.row.beforeParticipation * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '본강'">{{ (scope.row.curParticipation * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '복습'">{{ (scope.row.afterParticipation * 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="평균 이해도"
            style="width: 10%">
            <template slot-scope="scope">
              <span v-if="selectValue === '전체'">{{ (scope.row.understanding * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '예습'">{{ (scope.row.beforeUnderstanding * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '본강'">{{ (scope.row.curUnderstanding * 100).toFixed(2) }}</span>
              <span v-if="selectValue === '복습'">{{ (scope.row.afterUnderstanding * 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <!--
          <el-table-column
            prop="index"
            label="집중도"
            sortable
            style="width: 10%">
            <template slot-scope="scope">
              <el-slider v-model="defaultValue"   :step="25" disabled show-stops :show-tooltip="false"></el-slider>
              <div class = "slider_label">
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.min_concentration_score)" placement="top">
                  <div class= "slider_label_qq q1"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q1_concentration_score)" placement="top">
                  <div class= "slider_label_qq q2"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q2_concentration_score)" placement="top">
                  <div class= "slider_label_qq q3"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q3_concentration_score)" placement="top">
                  <div class= "slider_label_qq q4"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.max_concentration_score)" placement="top">
                  <div class= "slider_label_qq q5"></div>
                </el-tooltip>
             </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="index"
            label="참여도"
            sortable
            style="width: 10%">
            <template slot-scope="scope">
              <el-slider v-model="defaultValue"  :step="25" disabled show-stops :show-tooltip="false"></el-slider>
              <div class = "slider_label">
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.min_participation_score)" placement="top">
                  <div class= "slider_label_qq q1"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q1_participation_score)" placement="top">
                  <div class= "slider_label_qq q2"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q2_participation_score)" placement="top">
                  <div class= "slider_label_qq q3"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q3_participation_score)" placement="top">
                  <div class= "slider_label_qq q4"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.max_participation_score)" placement="top">
                  <div class= "slider_label_qq q5"></div>
                </el-tooltip>
             </div>
            </template>
          </el-table-column>
          -->

          <el-table-column
            label="통계 보기"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="onClick('STUDENT_STAT', scope.row.lecture_id)">
                학생 상세 통계
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="통계 보기"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="onClick('LECTURE_ANALYSIS', scope.row.lecture_id)">
                강의 상세 통계
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        
        <teacher-class-journal-detail :lectureId = "lectureId" v-if = "isActiveInfo"/>
      </el-tab-pane>
      <el-tab-pane label="키워드 저널링" name="keyword">
        <el-row v-if="keyword">
          <el-col :span="12">
            <p>키워드별 학생 평균 이해도</p>
            <el-table :data="keyword" border height="400" style="width:700px">
              <el-table-column
                prop="keyword"
                label="키워드"
                sortable >
              </el-table-column>
              <el-table-column
                prop="understanding"
                label="이해도"
                sortable >
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <word-cloud
              style="min-height: 400px;"
              :data="keyword"
              nameKey="keyword"
              valueKey="understanding"
              fontScale="sqrt"
              :fontSize="[40, 120]"
              :wordClick="() => {}"
            ></word-cloud>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.classTitle {
  margin-bottom: 15px;
}
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

  }
  .slider_label_q{
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    font-size: 10px;
    width: 22%;
  }
  .slider_label_qq{
    position: absolute;
    width: 15px;
    height: 15px;
    top: 25px;
  }
  .slider_label_qq.q2 {
    left:24%;
  }
  .slider_label_qq.q3 {
    left:48%;
  }
  .slider_label_qq.q4 {
    left:72%;
  }
  .slider_label_qq.q5 {
    left:94%;
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
  .el-slider__runway.disabled .el-slider__bar{
    background-color:#41355e;
  }

</style>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import utils from '../../utils';
  import LineChart from '../partials/NNLineChart';
  import TeacherClassJournalDetail from '../partials/TeacherClassJournalDetail';
  import WordCloud from '../partials/WordCloud';
  import analysisService from '../../services/analysisService';
  import classService from '../../services/classService';

  export default {
    name: 'TeacherClassJournal',
    components: {
      LineChart,
      TeacherClassJournalDetail,
      WordCloud,
    },
    data() {
      return {
        className: '',
        defaultValue: 0,
        isStudent: false,
        activeTab: 'basic',
        selectOptions: [{
          value: '전체',
          label: '전체',
        }, {
          value: '예습',
          label: '예습',
        }, {
          value: '본강',
          label: '본강',
        }, {
          value: '복습',
          label: '복습',
        }],
        selectValue: '전체',
        allData: '',
        chartData: [],
        chartCategories: [],
      };
    },
    async beforeMount() {
      const vm = this;

      const res = await classService.getClass({ id: vm.classId });
      vm.className = res.data.name;
      /*
        // 참여도 (>= 이해도) // deprecated
        const res = await analysisService.NNgetParticipation({ classId: vm.$route.params.classId });
        console.log('@TeacherClassJournal res.data = ', res.data);
        vm.participationData = res.data;
      */

      // 참여도 + 이해도
      const res2 = await analysisService.NNgetUnderstanding({ classId: vm.classId });
      vm.allData = res2.data;
      // console.log('@TeacherClassJournal res.data = ', res.data);

      // TODO 집중도 - 서버 구현되면 추가될 예정

      vm.onChange();

      vm.updateClassId({
        classId: Number.parseInt(vm.classId, 10),
      });
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 0,
      });
      vm.updateAnalysisOpt({
        analysisOpt: 0,
      });
      await vm.getAnalysisData();
      // console.log('@TeacherClassJournal analysisData = ', vm.analysisData);
    },
    methods: {
      ...mapMutations('analysis', ['updateClassId', 'updateUserId', 'updateIsStudent', 'updateIsActiveInfo', 'updateLectureId', 'updateAnalysisOpt']),
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      nullToZero(s) {
        if (typeof s === 'undefined' || s === null) {
          return '0';
        }
        return s.toFixed(1).toString();
      },
      onClick(type, lectureId) {
        const vm = this;
        switch (type) {
          case 'STUDENT_STAT': {
            vm.updateLectureId({
              lectureId,
            });
            vm.updateIsActiveInfo({
              isActiveInfo: true,
            });
            break;
          }
          case 'LECTURE_ANALYSIS': {
            vm.updateLectureId({
              lectureId,
            });
            vm.$router.push(`/a/teacher/lecture/${lectureId}/journal`);
            break;
          }
          default: {
            throw new Error('not defined type', type);
          }
        }
      },
      onChange() {
        const vm = this;
        switch (vm.selectValue) {
          case '전체':
            vm.chartData[0] = vm.allData.average.map(x => (x.participation * 100).toFixed(2));
            vm.chartData[1] = vm.allData.average.map(x => (x.understanding * 100).toFixed(2));
            break;
          case '예습':
            vm.chartData[0] = vm.allData.average.map(x => (x.beforeParticipation * 100).toFixed(2));
            vm.chartData[1] = vm.allData.average.map(x => (x.beforeUnderstanding * 100).toFixed(2));
            break;
          case '본강':
            vm.chartData[0] = vm.allData.average.map(x => (x.curParticipation * 100).toFixed(2));
            vm.chartData[1] = vm.allData.average.map(x => (x.curUnderstanding * 100).toFixed(2));
            break;
          case '복습':
            vm.chartData[0] = vm.allData.average.map(x => (x.afterParticipation * 100).toFixed(2));
            vm.chartData[1] = vm.allData.average.map(x => (x.afterUnderstanding * 100).toFixed(2));
            break;
          default :
            break;
        }
        vm.chartCategories = vm.allData.average.map(x => x.name);
        vm.chartData[0].unshift('평균 참여도');
        vm.chartData[1].unshift('평균 이해도');
        // console.log('vm.chartCategories = ', vm.chartCategories);
        // console.log('vm.chartData[0] = ', vm.chartData[0]);
        // console.log('vm.chartData[1] = ', vm.chartData[1]);
        vm.chartData.push(''); // 자식 컴포넌트에 변화 알릴 목적
        vm.$emit('onChange');
      },
    },
    computed: {
      ...mapState('analysis', ['analysisData', 'isActiveInfo', 'lectureId', 'keyword']),
      classId() {
        return this.$route.params.classId;
      },
    },
  };
</script>
