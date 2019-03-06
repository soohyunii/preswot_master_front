<template>
  <div>
    <div v-if="mode === 0">
      <el-table :data="studentQuestionList" height="400">
        <el-table-column type="index" label="번호" align="center" width="100">
        </el-table-column>
        <el-table-column prop="type" label="문항 유형" align="center" width="150">
        </el-table-column>
        <el-table-column prop="name" label="문항 이름" align="center" width="200">
        </el-table-column>
        <el-table-column prop="submitTime" label="최초 제출 시간" align="center" width="350">
        </el-table-column>
       
        <el-table-column label="평가하기" align="center" width="130">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('PREVIEW', scope.$index)">평가하기</el-button>
            <el-dialog
              title="미리보기"
              :visible.sync="dialogVisible"
              :before-close="handleClose"
              center
              width="30%">
              <quiz-preview
                :data="quizItem"
                :answer="previewAnswer"/>
              <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">닫기</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        
      </el-table>
      <div class="ps-align-right">
        <p><el-button type="primary" @click="onCreate">출제하기</el-button></p>
      </div>
    </div>
    <div v-else-if="mode === 1">
      <el-button @click="onBack(0)" icon="el-icon-back">뒤로가기</el-button>
      <br><br>
      <quiz-new/>
    </div>
    <div v-else-if="mode === 2">
      <el-button @click="onBack(1)" icon="el-icon-back">뒤로가기</el-button>
      <br><br>
      <quiz-edit/>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import QuizPreview from '../partials/QuizPreview';
import studentService from '../../services/studentService';

export default {
  name: 'StudentSelfQuizEstimate',
  components: {
    QuizPreview,
  },
  data() {
    return {
      quizForm: false,
      makeEdit: false,
      makeNew: false,
      // mode: 0,  // 0-리스트, 1-등록, 2-수정
      // quizData: [],
      q_index: -1,
    };
  },
  computed: {
    ...mapState({
      index: state => state.studentQuestion.index,
      studentQuestionList: state => state.studentQuestion.studentQuestionList,
      mode: state => state.studentQuestion.mode,
    }),
    ...mapState('NNclass', ['curLectureId']),
    ...mapGetters('studentQuestion', ['getIndex']),
  },
  async created() {
    const vm = this;

  },
  async mounted() {
    const vm = this;
    const lid = vm.curLectureId;

    await vm.getQuestionList({ lectureId: lid })
  },
  methods: {
    ...mapActions('studentQuestion', [
      'getQuestionList',
      'deleteQuestion',
      'transferStudentQuestion',
    ]),
    ...mapMutations('studentQuestion',[
      'updateStudentQuestionIndex',
      'updateStudentQuestionIndex',
      'updateStudentQuestionMode',
    ]),
    async onClick(type, index) {
      const vm = this;
      const lid = vm.curLectureId;
      const tar = vm.studentQuestionList[index];
      
    },
    onCreate() {

    },
  
  },
};
</script>