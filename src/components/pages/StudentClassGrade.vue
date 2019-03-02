<template>
  <div id="student_class_grade_wrapper" class="bt-container">
    <h2>{{ currentStudyingClass(classId) ? currentStudyingClass(classId).name : '' }} > 결과보기</h2>
    <div class="one-lecture-wrapper" v-for="lecture in questionList" :key="lecture">
      <h3>{{ lecture.name }}</h3>
      <el-table :data="lecture.questions">
        <el-table-column
          prop="no"
          label="No."
          width="100px">
        </el-table-column>
        <el-table-column
          prop="type"
          label="타입"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="question"
          label="문제">
        </el-table-column>
        <el-table-column
          label="제출"
          width="100px">
          <template slot-scope="scope">
            {{ scope.row.numberOfStudent === 1 ? '제출' : '미제출' }}
          </template>
        </el-table-column>
        <el-table-column
          label="배점"
          width="100px">
          <template slot-scope="scope">
            {{ scope.row.avgScore }} / {{scope.row.score}}
          </template>
        </el-table-column>
        <el-table-column
          label=""
          width="150px">
          <template slot-scope="scope">
            <el-button @click="onClickResult(scope.row.itemId)">상세보기</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="문항 결과 상세 보기" :visible.sync="detailModalVisible">
      <div v-if="questionResult">
        <h3>문항 ({{ questionResult.type }})</h3>
        <p>{{ questionResult.question }} ({{ questionResult.score }}점)</p>

        <div v-if="questionResult.type === '객관'">
          <el-radio-group style="width: 100%;" disabled>
            <div v-for="(choice,index) in questionResult.choice" :key="index">
              <el-radio :label="index">{{ index + 1 }} . {{ choice }}</el-radio>
            </div>
          </el-radio-group>
        </div>

        <div v-if="questionResult.type === 'SW'">
          <el-row>
            <el-col :span="4">제출 가능 언어</el-col>
            <el-col :span="20">{{ questionResult.acceptLanguage.join(', ') }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">입력 설명</el-col>
            <el-col :span="20">{{ questionResult.inputDescription }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">출력 설명</el-col>
            <el-col :span="20">{{ questionResult.outputDescription }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">샘플 입력</el-col>
            <el-col :span="20">{{ questionResult.sampleInput }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">샘플 출력</el-col>
            <el-col :span="20">{{ questionResult.sampleOutput }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">시간 제한</el-col>
            <el-col :span="20">{{ questionResult.timeLimit }}초</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">메모리 제한</el-col>
            <el-col :span="20">{{ questionResult.memoryLimit }}MB</el-col>
          </el-row>
        </div>

        <h3>제출 답안</h3>
        <p v-if="questionResult.summitted">{{ questionResult.answers[0].answer[0]}}</p>
        <p v-else>( 미제출 )</p>

        <!--
        <div v-if="['객관', '단답', '서술', 'SQL'].includes(questionResult.type)">
          <h3>정답</h3>
          <p>{{ questionResult.answer }}</p>
        </div>
        -->
        <div v-if="questionResult.type === 'SW' && questionResult.summitted">
          <h3>결과</h3>
          <p>{{ questionResult.answers[0].swResult }}</p>
          <p>{{ questionResult.answers[0].oj_solution.time }}ms, {{ questionResult.answers[0].oj_solution.memory }}KB</p>
          <p v-if="questionResult.answers[0].swResult === '컴파일 에러'">{{ questionResult.answers[0].oj_compileinfo.error }}</p>
          <p v-if="questionResult.answers[0].swResult === '런타임 에러'">{{ questionResult.answers[0].oj_runtimeinfo.error }}</p>
        </div>

        <h3>배점</h3>
        <p>{{ questionResult.avgScore }} / {{questionResult.score}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  #student_class_grade_wrapper {
    .one-lecture-wrapper {
      margin-bottom: 40px;
    }
  }
</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';


export default {
  name: 'StudentClassGrade',
  created() {
    const vm = this;
    vm.getClassTotalResult({
      classId: vm.classId,
      isStudent: true,
    });
  },
  data() {
    return {
      detailModalVisible: false,
    };
  },
  computed: {
    ...mapState('grading', [
      'theResult',
      'questionList',
      'questionResult',
    ]),
    ...mapGetters('NNclass', [
      'currentStudyingClass',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
  },
  methods: {
    ...mapActions('grading', [
      'getClassTotalResult',
      'getQuestionResult',
    ]),
    onClickResult(itemId) {
      const vm = this;
      vm.getQuestionResult({ itemId });
      vm.detailModalVisible = true;
    },
  },
};
</script>

