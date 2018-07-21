<template>
  <div>
    <div v-if="questionResult">
      <br>
      <br>
      <el-row v-if="resultType === '실시간'">
        <el-col :span="5"><strong>현재 수강 인원</strong></el-col>
        <el-col :span="8"> 실시간 수강 인원  / {{ numberOfStudentInClass }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><strong>학생 제출</strong></el-col>
        <el-col :span="8">총 {{ questionResult.numberOfStudent }}건</el-col>
        <el-button v-if="resultType === '실시간'" style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
      </el-row>
      <el-table v-if="questionResult.type === '객관'"
                :data="questionResult.obAnswers"
                size="mini"
                :header-cell-style="changeHead"
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

      <el-table v-show="['객관', '단답', 'SQL'].includes(questionResult.type)"
                :data="questionResult.answers"
                :header-cell-style="changeHead"
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
          prop="score"
          label="점수"
          width="70px"
          sortable>
          <template slot-scope="scope">
            <p>{{ scope.row.score }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-show="['서술'].includes(questionResult.type)"
                :data="questionResult.answers"
                :header-cell-style="changeHead"
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
          prop="score"
          label="점수"
          sortable>
          <template v-if="resultType === '실시간'" slot-scope="scope">
            <p v-if="scope.row.score === null">-</p>
            <p v-else>{{ scope.row.score }}</p>
          </template>
          <template v-if="resultType !== '실시간'" slot-scope="scope">
            <el-input placeholder="Please input"
                      v-model="scope.row.score"
                      type="number"
                      min="0"
                      :max="questionResult.score"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-if="resultType !== '실시간'"
          label="확인">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" circle @click="scoreSubmit(scope.row.score, scope.row.student_answer_log_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-show="['SW'].includes(questionResult.type)"
                :data="questionResult.answers"
                :header-cell-style="changeHead"
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
          label="결과"
          width="60px">
          <template slot-scope="scope">
            <p>{{ scope.row.swResult }}</p>
            <!-- time 부분에서 null 에러 발생 -->
            <!-- <p>{{ scope.row.oj_solution.time }}ms, {{ scope.row.oj_solution.memory }}KB</p> -->
            <p v-if="scope.row.swResult === '컴파일 에러'">{{ scope.row.oj_compileinfo.error }}</p>
            <p v-if="scope.row.swResult === '런타임 에러'">{{ scope.row.oj_runtimeinfo.error }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="점수"
          width="70px"
          sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.score === null">-</p>
            <p v-else>{{ scope.row.score }}</p>
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
  .el-row {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'NNLectureQuestionResult',
    props: ['classId', 'itemId', 'resultType'],
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
      async refresh() {
        const vm = this;
        await vm.getClassTotalResult({
          classId: vm.classId,
          isStudent: false,
        });
        vm.getQuestionResult({
          itemId: vm.itemId,
        });
      },
      changeHead() {
        return { backgroundColor: 'rgb(229, 233, 242)' };
      },
      async scoreSubmit(score, id) {
        const vm = this;
        if (score < 0 || score > vm.questionResult.score) {
          vm.$notify({
            title: '점수 범위를 확인하세요',
            message: '',
            type: 'error',
            duration: 2000,
          });
          return;
        }
        const res = await vm.putScore({ id, score });
        if (res && res.status === 200) {
          vm.$notify({
            title: '완료',
            type: 'success',
            duration: 1000,
          });
        }
      },
    },
  };
</script>
