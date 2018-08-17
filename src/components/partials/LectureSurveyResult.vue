<template>
  <div>
    <div v-if="studentSurveyResult">
      <el-row v-if="resultType === '실시간'">
        <el-col :span="5"><strong>현재 수강 인원</strong></el-col>
        <!-- <el-col :span="8"> 실시간 수강 인원  / {{ numberOfStudentInClass }} </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="3"><strong>학생 답변</strong></el-col>
        <el-col :span="3">총 {{ studentSurveyResult.numberOfStudent }}건</el-col>
        <el-button v-if="resultType === '실시간'" style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
      </el-row>
      <br />
      <el-table v-show="studentSurveyResult.type === '서술'"
                :data="studentSurveyResult.answers"
                :header-cell-style="changeHead">
                <!-- height="500"> -->
        <el-table-column
          label="학생 아이디"
          align="center"
          width="250px">
          <template slot-scope="scope">
            <p>***</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변"
          align="center">
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">
          <el-table v-show="studentSurveyResult.type === '객관'"
                    :data="studentSurveyResult.answers"
                    :header-cell-style="changeHead">
            <el-table-column
              prop="choice"
              label="보기"
              align="center">
            </el-table-column>
            <el-table-column
              prop="number"
              label="선택한 학생 수"
              align="center">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .choices {
    padding-right: 25px;
    .index {
      color: #888888;
    }
  }
  .el-row {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'LectureSurveyResult',
    props: ['classId', 'itemId', 'resultType'],
    data() {
      return {
        activeTab: 'survey',
        studentSurveyResult: undefined,
      };
    },
    computed: {
      ...mapState('grading', [
        'theResult',
        'surveyResult',
      ]),
      ...mapGetters('NNclass', [
        'currentTeachingClass',
      ]),
      ...mapGetters('class', [
        'numberOfStudentInClass',
      ]),
    },
    async created() {
      const vm = this;
      await vm.getClassTotalResult({
        classId: vm.classId,
      });
      console.log(vm.itemId);
      vm.getSurveyResult({
        itemId: vm.itemId,
      });
      vm.studentSurveyResult = vm.surveyResult;
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getSurveyResult',
      ]),
      ...mapActions('NNclass', [
        'putScore',
      ]),
      async refresh() {
        const vm = this;
        await vm.getClassTotalResult({
          classId: vm.classId,
          isStudent: false,
        });
        vm.getSurveyResult({
          itemId: vm.itemId,
        });
        vm.studentSurveyResult = vm.surveyResult;
      },
      changeHead() {
        return { backgroundColor: '#EAEAEA' };
      },
      async scoreSubmit(score, id) { // eslint-disable-line
        const vm = this;
        if (score < 0 || score > vm.questionResult.score) {
          vm.$notify({
            title: '점수 범위를 확인하세요',
            message: '',
            type: 'error',
            duration: 2000,
          });
        }
      },
    },
  };
</script>
