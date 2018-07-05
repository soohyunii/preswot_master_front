<template>
  <div class="bt-container">
    <div v-if="surveyResult">
      <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{surveyResult.lectureName}}</h2>
      <br />
      <p><strong>{{ surveyResult.itemName }}</strong></p>
      <br />
      <div class="basic-info">
        <el-row>
          <el-col :span="4">도구 유형</el-col>
          <el-col :span="20">설문 > {{ surveyResult.type }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">문항</el-col>
          <el-col :span="20">{{ surveyResult.comment }}</el-col>
        </el-row>
        <el-row v-if="surveyResult.type === '객관'">
          <el-col :span="4">보기</el-col>
          <el-col :span="20">
            <span class="choices" v-for="(choice, index) in surveyResult.choice"><span class="index">{{ index + 1 }} .</span> {{ choice }}</span>
          </el-col>
        </el-row>
      </div>
      <br />
      <br />
      <el-row>
        <el-col :span="3"><strong>학생 제출</strong></el-col>
        <el-col :span="3">총 {{ surveyResult.numberOfStudent }}건</el-col>
      </el-row>
      <br>
      <el-table v-if="surveyResult.type === '서술'" :data="surveyResult.answers" border height="500">
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
      <el-table v-if="surveyResult.type === '객관'" :data="surveyResult.answers" border>
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
  .basic-info {
    .el-row {
      padding-bottom: 10px;
    }
  }
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'TeacherClassGradingSurvey',
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
      classId() {
        const vm = this;
        return Number.parseInt(vm.$route.params.classId, 10);
      },
      itemId() {
        const vm = this;
        return Number.parseInt(vm.$route.params.itemId, 10);
      },
    },
    async created() {
      const vm = this;
      if (!vm.theResult) {
        await vm.getClassTotalResult({
          classId: vm.classId,
        });
      }
      vm.getSurveyResult({
        itemId: vm.itemId,
      });
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getSurveyResult',
      ]),
    },
  };
</script>
