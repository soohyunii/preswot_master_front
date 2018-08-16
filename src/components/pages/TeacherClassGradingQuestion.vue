<template>
  <div class="bt-container">
    <div v-if="questionResult">
      <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{ questionResult.lectureName }}</h2>
      <br />
      <br />
      <p><strong>{{ questionResult.itemName }}</strong></p>
      <br />
      <div class="basic-info">
        <el-card>
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
              <span class="choices" v-for="(choice, index) in questionResult.choice" :key="(choice, index)"><span class="index">{{ index + 1 }} .</span> {{ choice }}</span>
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
        </el-card>
      </div>
      <br />
      <br />
      <lecture-question-result
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
  import LectureQuestionResult from '../partials/LectureQuestionResult';

  export default {
    name: 'TeacherClassGradingQuestion',
    components: {
      LectureQuestionResult,
    },
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
      ...mapActions('NNclass', [
        'putScore',
      ]),
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
        /*
        const res = await vm.putScore({ id, score });
        if (res && res.status === 200) {
        }
        */
      },
    },
  };
</script>
