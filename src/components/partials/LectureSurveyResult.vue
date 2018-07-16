<template>
  <div>
    <div v-if="surveyResult">
      <br>
      <br>
      <el-row>
        <el-col :span="5"><strong>현재 수강 인원</strong></el-col>
        <el-col :span="8"> 실시간 수강 인원  / {{ numberOfStudentInClass }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="3"><strong>학생 제출</strong></el-col>
        <el-col :span="3">총 {{ surveyResult.numberOfStudent }}건</el-col>
        <el-button style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
      </el-row>
      <el-table v-show="surveyResult.type === '서술'"
                :data="surveyResult.answers"
                :header-cell-style="changeHead"
                height="500">
        <el-table-column
          label="학생 아이디">
          <template slot-scope="scope">
            <p>***</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변">
        </el-table-column>
      </el-table>
      <el-table v-show="surveyResult.type === '객관'"
                :data="surveyResult.answers"
                :header-cell-style="changeHead">
        <el-table-column
          prop="choice"
          label="보기">
        </el-table-column>
        <el-table-column
          prop="number"
          label="선택한 학생 수">
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      에러..
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
    props: ['classId', 'itemId', 'itemType'],
    data() {
      return {
        activeTab: 'question',
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
    //   if (!vm.theResult) {
      await vm.getClassTotalResult({
        classId: vm.classId,
      });
    //   }
      vm.getSurveyResult({
        itemId: vm.itemId,
      });
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getSurveyResult',
      ]),
      async refresh() {
        const vm = this;
        await vm.getClassTotalResult({
          classId: vm.classId,
          isStudent: false,
        });
        if (vm.itemType === 0) {
          vm.getQuestionResult({
            itemId: vm.itemId,
          });
        } else if (vm.itemType === 1) {
          vm.getSurveyResult({
            itemId: vm.itemId,
          });
        }
      },
      changeHead() {
        return { backgroundColor: 'rgb(229, 233, 242)' };
      },
    },
  };
</script>
