<template>
  <div class="bt-container" oncontextmenu="return false">
    <div v-if="surveyResult">
      <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{surveyResult.lectureName}}</h2>
      <br />
      <br />
      <p><strong>{{ surveyResult.itemName }}</strong></p>
      <br />
      <div class="basic-info">
        <el-card>
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
              <span class="choices" v-for="(choice, index) in surveyResult.choice" :key="(choice, index)"><span class="index">{{ index + 1 }} .</span> {{ choice }}</span>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <br />
      <br />
      <lecture-survey-result
        :classId="classId"
        :itemId="itemId"
        resultType="결과보기"
      />
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
  import LectureSurveyResult from '../partials/LectureSurveyResult';

  export default {
    name: 'TeacherClassGradingSurvey',
    components: {
      LectureSurveyResult,
    },
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
