<template>
  <div>
    <div v-if="questionResult">
      <el-row v-if="resultType === '실시간'">
        <el-col :span="5"><strong>현재 수강 인원</strong></el-col>
        <!-- <el-col :span="8"> 실시간 수강 인원  / {{ numberOfStudentInClass }} </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="3"><strong>학생 답변</strong></el-col>
        <el-col :span="7">총 {{ questionResult.numberOfStudent }}건</el-col>
        <el-button v-if="resultType === '실시간'" style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
      </el-row>
      <br />
      <el-row>
        <el-col :span="12">
          {{ questionResult.obAnswers }}
          <el-table v-if="questionResult.type === '객관'"
                    :data="questionResult.obAnswers"
                    :header-cell-style="changeHead"
                    style="margin-bottom: 20px;">
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

      <el-table :data="questionResult.answers"
                :header-cell-style="changeHead"
                :default-sort="{prop: 'score', order: 'ascending'}"
                height="500">
        <el-table-column
          label="학생 아이디"
          align="center"
          width="250px">
          <template slot-scope="scope">
            <p>{{ scope.row.user.email_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변"
          align="center">
          <template slot-scope="scope">
            <span v-for="(answer, index) in scope.row.answer" class="item" :key="index">
              <span>{{ answer }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="questionResult.type === 'SW'"
          label="결과"
          align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.swResult }}</p>
            <p>{{ scope.row.oj_solution.time }}ms, {{ scope.row.oj_solution.memory }}KB</p>
            <p v-if="scope.row.swResult === '컴파일 에러'">{{ scope.row.oj_compileinfo.error }}</p>
            <p v-if="scope.row.swResult === '런타임 에러'">{{ scope.row.oj_runtimeinfo.error }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="점수"
          width="150px"
          align="center">
            <template slot-scope="scope">
              <div v-if="questionResult.type !== '서술'">
                <p v-if="scope.row.score === null">-</p>
                <p v-else>{{ scope.row.score }}</p>
              </div>
              <div v-else>
                <el-input placeholder="Please input"
                        v-model="scope.row.score"
                        type="number"
                        min="0"
                        :max="questionResult.score" />
              </div>
            </template>
        </el-table-column>
        <el-table-column
          v-if="questionResult.type === '서술'"
          label=""
          width="100px"
          align="center">
          <template slot-scope="scope">
            <el-button type="info"
                      plain
                      size="small"
                      @click="scoreSubmit(scope.row.score, scope.row.student_answer_log_id)">
              확인
            </el-button>
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
  .item + .item:before {
    content: ", ";
  }
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';

  export default {
    name: 'LectureQuestionResult',
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
      // TODO: 부모 component에서 받아 오는 형식으로 수정
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
        return { backgroundColor: '#EAEAEA' };
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
