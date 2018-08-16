<template>
  <div v-if="analysisData && analysisData[0]" class="bt-container">
    <div class="classTitle">{{ analysisData[0].class_name }} > 저널링</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="강의 흐름" name="basic">
        <line-chart :chartData = "analysisData" :isStudent = "isStudent"/>
        <el-table
          :data="analysisData"
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
            <el-slider v-model="defaultValue"   :step="25" disabled show-stops :show-tooltip="false"></el-slider>
            <div class = "slider_label">
              <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.min_understanding_score)" placement="top">
                <div class= "slider_label_qq q1"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q1_understanding_score)" placement="top">
                <div class= "slider_label_qq q2"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q2_understanding_score)" placement="top">
                <div class= "slider_label_qq q3"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.q3_understanding_score)" placement="top">
                <div class= "slider_label_qq q4"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="nullToZero(scope.row.max_understanding_score)" placement="top">
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
          <el-table-column
            prop="index"
            label="통계 보기"
            sortable
            width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="onClick('STUDENT_STAT', scope.row.lecture_id)">
                학생 상세 통계
              </el-button>
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
  import LineChart from '../partials/LineChart';
  import TeacherClassJournalDetail from '../partials/TeacherClassJournalDetail';
  import WordCloud from '../partials/WordCloud';

  export default {
    name: 'TeacherClassJournal',
    components: {
      LineChart,
      TeacherClassJournalDetail,
      WordCloud,
    },
    data() {
      return {
        defaultValue: 0,
        isStudent: false,
        activeTab: 'basic',
      };
    },
    async beforeMount() {
      const vm = this;
      vm.updateClassId({
        classId: Number.parseInt(vm.$route.params.classId, 10),
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
    },
    computed: {
      ...mapState('analysis', ['analysisData', 'isActiveInfo', 'lectureId', 'keyword']),
    },
  };
</script>
