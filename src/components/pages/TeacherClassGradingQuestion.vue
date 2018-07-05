<template>
  <div class="bt-container">
    <div v-if="questionResult">
      <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{ questionResult.lectureName }}</h2>
      <br />
      <p><strong>{{ questionResult.itemName }}</strong></p>
      <br />
      <div class="basic-info">
        <el-row>
          <el-col :span="4">도구 유형</el-col>
          <el-col :span="20">문항 > {{ questionResult.type }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">문제</el-col>
          <el-col :span="20">{{ questionResult.question }}</el-col>
        </el-row>
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
        <el-row v-if="questionResult.type === '객관'">
          <el-col :span="4">보기</el-col>
          <el-col :span="20">
            <span class="choices" v-for="(choice, index) in questionResult.choice"><span class="index">{{ index + 1 }} .</span> {{ choice }}</span>
          </el-col>
        </el-row>
        <el-row v-if="['객관', '서술', '단답', 'SQL'].includes(questionResult.type)">
          <el-col :span="4">정답</el-col>
          <el-col :span="20">{{ questionResult.answer }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">키워드</el-col>
          <el-col :span="20">
            <transition-group type="transition">
              <el-tag class="tag" type="primary" v-for="k in questionResult.keywords" :key="k.keyword">{{ k.keyword }} / {{ k.score_portion }}</el-tag>
            </transition-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">배점</el-col>
          <el-col :span="20">{{ questionResult.score }}</el-col>
        </el-row>
      </div>
      <br />
      <br />
      <el-row>
        <el-col :span="3"><strong>학생 제출</strong></el-col>
        <el-col :span="8">총 {{ questionResult.numberOfStudent }}건</el-col>
        <el-col :span="5">평균점수 {{ questionResult.avgScore }} / {{ questionResult.score }}</el-col>
      </el-row>
      <br>
      <el-table v-if="questionResult.type === '객관'"
                :data="questionResult.obAnswers"
                border
                style="margin-bottom: 20px;">
        <el-table-column
          prop="choice"
          label="보기">
        </el-table-column>
        <el-table-column
          prop="number"
          label="선택한 학생 수">
        </el-table-column>
      </el-table>
      <el-table v-if="['객관', '서술', '단답', 'SQL'].includes(questionResult.type)"
                :data="questionResult.answers"
                border
                height="500">
        <el-table-column
          label="학생 아이디">
          <template slot-scope="scope">
            <p>{{ scope.row.user.email_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변">
        </el-table-column>
        <el-table-column
          label="점수">
          <template slot-scope="scope">
            <p>{{ scope.row.score }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="['SW'].includes(questionResult.type)"
                :data="questionResult.answers"
                border
                height="500">
        <el-table-column
          label="학생 아이디">
          <template slot-scope="scope">
            <p>{{ scope.row.user.email_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변">
        </el-table-column>
        <el-table-column
          label="결과">
          <template slot-scope="scope">
            <p>{{ scope.row.swResult }}</p>
            <p>{{ scope.row.oj_solution.time }}ms, {{ scope.row.oj_solution.memory }}KB</p>
            <p v-if="scope.row.swResult === '컴파일 에러'">{{ scope.row.oj_compileinfo.error }}</p>
            <p v-if="scope.row.swResult === '런타임 에러'">{{ scope.row.oj_runtimeinfo.error }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="점수">
          <template slot-scope="scope">
            <p>{{ scope.row.score }}</p>
          </template>
        </el-table-column>
      </el-table>
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
    name: 'TeacherClassGradingQuestion',
    data() {
      return {
        activeTab: 'question',
      };
    },
    computed: {
      ...mapState('grading', [
        'theResult',
        'questionResult',
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
      vm.getQuestionResult({
        itemId: vm.itemId,
      });
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getQuestionResult',
      ]),
    },
  };
</script>
