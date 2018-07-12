<template>
  <div>
    <div>
      <p>강의도구 화면</p>
      <el-button style="float:right" type="primary" size="small" @click="onClick('HIDE',lectureItemId)">내리기</el-button>
      <p>현재: {{ data.name }}</p>
    </div>
    <lecture-live-item
      :data="data"
      :lectureItemId="lectureItemId"
      :onClick="onClick"/>

    <!-- 실시간 제출 현황 -->
    <br>
    <div>
    <p>학생 답변 : 총 {{ questionResult.numberOfStudent }} 건</p>
    <el-button style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
    <p>정답 : {{ questionResult.answer }} 번 </p>
    </div>
      <!-- <el-col :span="8">평균점수 {{ questionResult.avgScore }} / {{ questionResult.score }}</el-col> -->
    <div v-if="data.type === 0">
      <el-table v-if="questionResult.type === '객관'"
                :data="questionResult.obAnswers"
                size="small"
                stripe
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

      <el-table v-if="['객관', '단답', 'SQL'].includes(questionResult.type)"
                :data="questionResult.answers"
                border
                :default-sort="{prop: 'score', order: 'ascending'}">
        <el-table-column
          label="학생 아이디"
          align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.user.email_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변"
          align="center">
        </el-table-column>
        <el-table-column
          prop="score"
          label="점수"
          align="center">
          <!-- <template slot-scope="scope">
            <p>{{ scope.row.score }}</p>
          </template> -->
        </el-table-column>
      </el-table>
      <el-table v-if="['서술'].includes(questionResult.type)"
                :data="questionResult.answers"
                border>
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
            <el-input placeholder="Please input"
                      v-model="scope.row.score"
                      type="number"
                      min="0"
                      :max="questionResult.score"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="확인">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" circle @click="scoreSubmit(scope.row.score, scope.row.student_answer_log_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="['SW'].includes(questionResult.type)"
                :data="questionResult.answers"
                border>
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

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import lectureItemService from '../../services/lectureItemService';
import LectureLiveItem from './LectureLiveItem';

export default {
  async created() {
    const vm = this;
    const res = await lectureItemService.getLectureItem({
      lectureItemId: vm.lectureItemId,
    });
    if (!vm.theResult) {
      await vm.getClassTotalResult({
        classId: vm.lectureId,
      });
    }
    vm.data = res.data;
    if (vm.data.type === 0) {
      vm.getQuestionResult({
        itemId: vm.lectureItemId,
      });
    }
  },
  props: ['onClick', 'lectureItemId', 'lectureId'],
  data() {
    return {
      data: {},
    };
  },
  computed: {
    ...mapState('grading', [
      'theResult',
      'questionResult',
    ]),
  },
  methods: {
    ...mapActions('grading', [
      'getClassTotalResult',
      'getQuestionResult',
    ]),
    async refresh() {
      const vm = this;
      await vm.getClassTotalResult({
        classId: vm.lectureId,
        isStudent: false,
      });
      vm.getQuestionResult({
        itemId: vm.lectureItemId,
      });
      console.log(vm.questionResult);
    },
  },
  components: {
    LectureLiveItem,
  },
};
</script>

<style>

</style>
