<template>
  <div>
    <el-table :data="studentEstimateQuestionList" height="400">
        <el-table-column type="index" label="번호" align="center" width="100">
        </el-table-column>
        <el-table-column prop="type" label="문항 유형" align="center" width="150">
        </el-table-column>
        <el-table-column prop="name" label="문항 이름" align="center" width="200">
        </el-table-column>
        <el-table-column prop="estimated" label="체점 상태" align="center" width="350">
        </el-table-column>
       
        <el-table-column label="평가하기" align="center" width="130">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('ESTIMATE', scope.$index)">평가하기</el-button>
          </template>
        </el-table-column>
        
      </el-table>

      <el-dialog :visible.sync="dialogVisible" title="문항 평가하기" :before-close="handleClose" center width="30%">
        <quiz-estimate :question="currentQuestion"></quiz-estimate>
          <el-button @click="handleClose">닫기</el-button>
      </el-dialog>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import QuizPreview from '../partials/QuizPreview';
import QuizEstimate from '../partials/QuizEstimate';
import studentService from '../../services/studentService';

export default {
  name: 'StudentSelfQuizEstimate',
  components: {
    QuizPreview,
    QuizEstimate,
  },
  data() {
    return {
      currentQuestion: null,
    };
  },
  computed: {
    ...mapState({
      index: state => state.studentQuestion.index,
      studentEstimateQuestionList: state => state.studentQuestion.studentEstimateQuestionList,
      mode: state => state.studentQuestion.mode,
      lectureId: state => state.studentQuestion.lectureId,
      lectureHomework: state => state.studentQuestion.lectureHomework,
      studentQuestionKeywords: state => state.studentQuestion.studentQuestionKeywords,
      dialogVisible: state => state.studentQuestion.dialogVisible,
    }),
  },
  async created() {
    const vm = this;
    const lectureId = vm.lectureId;
    await vm.getSudentEstimateQuestionList({ id: lectureId });
  },
  async mounted() {
    const vm = this;

  },
  methods: {
    ...mapActions('studentQuestion', [
      'getQuestionList',
      'deleteQuestion',
      'transferStudentQuestion',
      'getSudentEstimateQuestionList',
      'getSudentEstimateQuestionList',
      'getStudentQuestionKeywords',
    ]),
    ...mapMutations('studentQuestion',[
      'updateStudentQuestionIndex',
      'updateStudentQuestionIndex',
      'updateStudentQuestionMode',
      'updateDialogVisible',
    ]),
    async onClick(type, index) {
      const vm = this;
      const q = vm.studentEstimateQuestionList[index];
      if (q.estimated === '완료') {
          vm.$notify({
            title: '평가 완료',
            message: '이미 평가가 완료된 문항입니다.',
            type: 'error',
          });
        return;
      }

      await vm.getStudentQuestionKeywords({ id: vm.lectureId, qId: q.student_question_id });

      switch (type) {
        case 'ESTIMATE': {
          vm.updateDialogVisible({ value: true });
          vm.currentQuestion = q;
          break;
        }
        default : {
          break;
        }
      }
    },
    handleClose() {
      const vm = this;
      vm.updateDialogVisible({ value: false });
    },
    onCreate() {

    },
  
  },
};
</script>