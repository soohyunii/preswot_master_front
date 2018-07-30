<template>
  <div id="teacher_class_grading_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > 결과보기</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="문항 결과" name="question">
        <div class="one-lecture-wrapper" v-for="lecture in questionList">
          <h3>{{ lecture.name }}</h3>
          <el-table :data="lecture.questions">
            <el-table-column
              prop="no"
              label="No.">
            </el-table-column>
            <el-table-column
              prop="type"
              label="타입">
            </el-table-column>
            <el-table-column
              prop="name"
              label="강의 도구 이름">
            </el-table-column>
            <el-table-column
              label="체점한 수강생 수">
              <template slot-scope="scope">
                {{ scope.row.numberOfScored }} / {{scope.row.numberOfStudent}}
              </template>
            </el-table-column>
            <el-table-column
              label="평균 점수">
              <template slot-scope="scope">
                {{ scope.row.avgScore }} / {{scope.row.score}}
              </template>
            </el-table-column>
            <el-table-column
              label="">
              <template slot-scope="scope">
                <el-button size="small" @click="onClickResult('QUESTION', scope.row.itemId)">상세보기</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="설문 결과" name="survey">
        <div class="one-lecture-wrapper" v-for="lecture in surveyList">
          <h3>{{ lecture.name }}</h3>
          <el-table :data="lecture.surveys">
            <el-table-column
              prop="no"
              label="No.">
            </el-table-column>
            <el-table-column
              prop="type"
              label="타입">
            </el-table-column>
            <el-table-column
              prop="name"
              label="강의 도구 이름">
            </el-table-column>
            <el-table-column
              prop="numberOfStudent"
              label="설문 참여자 수">
            </el-table-column>
            <el-table-column
              label="">
              <template slot-scope="scope">
                <el-button size="small" @click="onClickResult('SURVEY', scope.row.itemId)">결과보기</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
  #teacher_class_grading_wrapper {
    .one-lecture-wrapper {
      margin-bottom: 40px;
    }
    .align-right {
      text-align: right;
    }
  }
</style>


<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'TeacherClassGrading',
  data() {
    return {
      activeTab: 'question',
    };
  },
  computed: {
    ...mapState('grading', [
      'theResult',
      'surveyList',
      'questionList',
    ]),
    ...mapGetters('NNclass', [
      'currentTeachingClass',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
  },
  created() {
    const vm = this;
    vm.getClassTotalResult({
      classId: vm.classId,
    });
  },
  methods: {
    ...mapActions('grading', [
      'getClassTotalResult',
    ]),
    onClickResult(type, itemId) {
      const vm = this;
      if (type === 'QUESTION') {
        vm.$router.push(`/a/teacher/class/${vm.classId}/grading/question/${itemId}`);
      } else if (type === 'SURVEY') {
        vm.$router.push(`/a/teacher/class/${vm.classId}/grading/survey/${itemId}`);
      }
    },
  },
};
</script>
