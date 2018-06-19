<template>
  <div v-if="analysisData && analysisData.result1 && analysisData.result1[0]">
    <div class="classTitle">{{ analysisData['result1'][0].name }} > 저널링</div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="강의 흐름" name="basic">
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
            <el-slider v-model="defaultValue"   :step="25" disabled show-stops></el-slider>
            <div class = "slider_label">
              <el-tooltip class="item" effect="dark" :content="scope.row.min_understanding_score" placement="top">
                <div class= "slider_label_qq q1"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.q1_understanding_score" placement="top">
                <div class= "slider_label_qq q2"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.q2_understanding_score" placement="top">
                <div class= "slider_label_qq q3"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.q3_understanding_score" placement="top">
                <div class= "slider_label_qq q4"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.max_understanding_score" placement="top">
                <div class= "slider_label_qq q5"></div>
              </el-tooltip>
           </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="index"
            label="집중도"
            sortable
            style="width: 10%">
            <template slot-scope="scope">
              <el-slider v-model="defaultValue"   :step="25" disabled show-stops></el-slider>
              <div class = "slider_label">
                <el-tooltip class="item" effect="dark" :content="scope.row.min_concentration_score" placement="top">
                  <div class= "slider_label_qq q1"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q1_concentration_score" placement="top">
                  <div class= "slider_label_qq q2"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q2_concentration_score" placement="top">
                  <div class= "slider_label_qq q3"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q3_concentration_score" placement="top">
                  <div class= "slider_label_qq q4"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.max_concentration_score" placement="top">
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
              <el-slider v-model="defaultValue"  :step="25" disabled show-stops></el-slider>
              <div class = "slider_label">
                <el-tooltip class="item" effect="dark" :content="scope.row.min_participation_score" placement="top">
                  <div class= "slider_label_qq q1"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q1_participation_score" placement="top">
                  <div class= "slider_label_qq q2"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q2_participation_score" placement="top">
                  <div class= "slider_label_qq q3"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.q3_participation_score" placement="top">
                  <div class= "slider_label_qq q4"></div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.max_participation_score" placement="top">
                  <div class= "slider_label_qq q5"></div>
                </el-tooltip>
             </div>
            </template>
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
  import TimeLine from '../partials/TimeLine';
  import TeacherClassJournalDetail from '../partials/TeacherClassJournalDetail';
  import WordCloud from '../partials/WordCloud';

  export default {
    name: 'TeacherLectureJournal',
    components: {
      TimeLine,
      TeacherClassJournalDetail,
      WordCloud,
    },
    data() {
      return {
        defaultValue: 0,
        isStudent: 0,
        activeTab: 'basic',
      };
    },
    async beforeMount() {
      const vm = this;
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 0,
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
      ...mapMutations('analysis', ['updateClassId', 'updateUserId', 'updateIsStudent', 'updateIsActiveInfo', 'updateLectureId', 'updateAnalysisOpt']),
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      nullToZero(s) {
        if (typeof s == 'undefined' || s == null) {
          return '0';
        }
        else {
          return s.toFixed(1).toString();
        }
      }
    },
    computed: {
      ...mapState('analysis', ['analysisData', 'lectureId', 'keyword']),
      tableData: {
        get() {
          const vm = this;
          const returnArr = [];
          returnArr.push({
            row_name: '예습',
            max_participation_score: vm.nullToZero(vm.analysisData.result1[0].o0_max_participation_score),
            max_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o0_max_concentration_score),
            max_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o0_max_understanding_score),
            q1_participation_score: vm.nullToZero(vm.analysisData.result1[0].o0_q1_participation_score),
            q1_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o0_q1_concentration_score),
            q1_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o0_q1_understanding_score),
            q2_participation_score: vm.nullToZero(vm.analysisData.result1[0].o0_q2_participation_score),
            q2_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o0_q2_concentration_score),
            q2_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o0_q2_understanding_score),
            q3_participation_score: vm.nullToZero(vm.analysisData.result1[0].o0_q3_participation_score),
            q3_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o0_q3_concentration_score),
            q3_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o0_q3_understanding_score),
            min_participation_score: vm.nullToZero(vm.analysisData.result1[0].o0_min_participation_score),
            min_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o0_min_concentration_score),
            min_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o0_min_understanding_score),
          },
            {
              row_name: '본강의',
              max_participation_score: vm.nullToZero(vm.analysisData.result1[0].o1_max_participation_score),
              max_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o1_max_concentration_score),
              max_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o1_max_understanding_score),
              q1_participation_score: vm.nullToZero(vm.analysisData.result1[0].o1_q1_participation_score),
              q1_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o1_q1_concentration_score),
              q1_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o1_q1_understanding_score),
              q2_participation_score: vm.nullToZero(vm.analysisData.result1[0].o1_q2_participation_score),
              q2_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o1_q2_concentration_score),
              q2_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o1_q2_understanding_score),
              q3_participation_score: vm.nullToZero(vm.analysisData.result1[0].o1_q3_participation_score),
              q3_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o1_q3_concentration_score),
              q3_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o1_q3_understanding_score),
              min_participation_score: vm.nullToZero(vm.analysisData.result1[0].o1_min_participation_score),
              min_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o1_min_concentration_score),
              min_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o1_min_understanding_score),
            },
            {
              row_name: '복습',
              max_participation_score: vm.nullToZero(vm.analysisData.result1[0].o2_max_participation_score),
              max_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o2_max_concentration_score),
              max_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o2_max_understanding_score),
              q1_participation_score: vm.nullToZero(vm.analysisData.result1[0].o2_q1_participation_score),
              q1_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o2_q1_concentration_score),
              q1_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o2_q1_understanding_score),
              q2_participation_score: vm.nullToZero(vm.analysisData.result1[0].o2_q2_participation_score),
              q2_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o2_q2_concentration_score),
              q2_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o2_q2_understanding_score),
              q3_participation_score: vm.nullToZero(vm.analysisData.result1[0].o2_q3_participation_score),
              q3_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o2_q3_concentration_score),
              q3_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o2_q3_understanding_score),
              min_participation_score: vm.nullToZero(vm.analysisData.result1[0].o2_min_participation_score),
              min_concentration_score: vm.nullToZero(vm.analysisData.result1[0].o2_min_concentration_score),
              min_understanding_score: vm.nullToZero(vm.analysisData.result1[0].o2_min_understanding_score),
            });
          return returnArr;
        },
      },
    },
  };
</script>
