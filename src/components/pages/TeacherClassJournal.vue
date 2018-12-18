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
        <span>필터 : </span>
        <span style="display: inline-block; width: 100px">
          <el-select v-model="selectRange1">
            <el-option
              v-for="item in selectOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span style="display: inline-block; width: 100px">
          <el-select v-model="selectRange2">
            <el-option
              v-for="item in selectOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <el-button type="primary" @click="onClick('SEARCH')">조회하기</el-button>

        <line-chart :chartCategories = "chartCategories" :chartData = "chartData"/>

        <el-table
          :data="allData.average"
          style="width: 100%">
          <!--
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
          -->

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
              <el-button type="primary" size="small" @click="onClick('STUDENT_STAT', scope.$index)">
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
        <teacher-class-journal-detail @childs-close-event="closeStatusBar()" :propDataSet = "studentDataSet" v-if = "isActiveInfo"/>
      </el-tab-pane>
      
      <!--
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
      -->
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
  import LineChart from '../partials/NNLineChart';
  import TeacherClassJournalDetail from '../partials/NNTeacherClassJournalDetail';
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
        selectOptions1: [{
          value: '예습',
          label: '예습',
        }, {
          value: '본강',
          label: '본강',
        }, {
          value: '복습',
          label: '복습',
        }],
        selectOptions2: [{
          value: '문항',
          label: '문항',
        }, {
          value: '설문',
          label: '설문',
        }, {
          value: '자료',
          label: '자료',
        }],
        selectRange1: '본강',
        selectRange2: '문항',
        allData: '',
        isActiveInfo: false,
        studentDataSet: [],
        chartData: [],
        chartCategories: [],
      };
    },
    async beforeMount() {
      const vm = this;
      const res = await classService.getClass({ id: vm.classId });

      // 강의 번호 목록
      console.log('res.data = ', res.data);

      const lectureIdList = res.data.lectures.map(element => (element.lecture_id));
      console.log('lectureIdList = ', lectureIdList);

      for (let index = 0; index < lectureIdList.length; index += 1) {
        // 참여도 가져오기 / allData에 넣기
        const res1 = await analysisService.getParticipation({ lectureId: lectureIdList[index] }); // eslint-disable-line
        console.log('res1 = ', res1);
        // vm.allData.push...

        // 이해도 가져오기 / allData에 넣기
        const res2 = await analysisService.getUnderstanding({ lectureId: lectureIdList[index] }); // eslint-disable-line
        console.log('res2 = ', res2);
        // vm.allData.push...

        // 집중도 가져오기 / allData에 넣기
        const res3 = await analysisService.getConcentration({ lectureId: lectureIdList[index] }); // eslint-disable-line
        console.log('res3 = ', res3);
        // vm.allData.push...
      }
    },
    methods: {
      onClick(type, payload) {
        const vm = this;
        switch (type) {
          case 'SEARCH': {
            // vm.allData 필터링해서 vm.chartData에 넣기
            // vm.allData 필터링해서 vm.tableData에 넣기 (?)
            break;
          }
          case 'STUDENT_STAT': {
            vm.studentDataSet = vm.allData.students[payload];
            vm.isActiveInfo = true;
            break;
          }
          case 'LECTURE_ANALYSIS': {
            /*
            vm.updateLectureId({
              lectureId: payload,
            });
            */
            vm.$router.push(`/a/teacher/lecture/${payload}/journal`);
            break;
          }
          default: {
            throw new Error('not defined type', type);
          }
        }
      },
      closeStatusBar() {
        const vm = this;
        vm.isActiveInfo = false;
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
      classId() {
        return this.$route.params.classId;
      },
    },
  };
</script>
