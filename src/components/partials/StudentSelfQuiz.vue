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
        <el-table-column label="수정" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('MODIFY', scope.$index)">수정</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="미리보기" align="center" width="130">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('PREVIEW', scope.$index)">미리보기</el-button>
            <el-dialog
              title="미리보기"
              :visible.sync="dialogVisible"
              :before-close="handleClose"
              center
              width="30%">
              <quiz-preview/>
              <quiz-preview
                :data="modifyQuestion"
                :answer="previewAnswer"/>
              <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">닫기</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column> -->
        <el-table-column label="삭제" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="onClick('DELETE', scope.$index)">삭제</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ps-align-right">
        <p><el-button type="primary" @click="onCreate">출제하기</el-button></p>
      </div>
    </div>
    <div v-else-if="mode === 1">
      <el-button @click="onBack(0)" icon="el-icon-back">뒤로가기1</el-button>
      <br><br>
      <quiz-new/>
    </div>
    <div v-else-if="mode === 2">
      <el-button @click="onBack(1)" icon="el-icon-back">뒤로가기2</el-button>
      <br><br>
      <quiz-edit/>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import QuizNew from '../partials/QuizNew';
import QuizEdit from '../partials/QuizEdit';
import QuizPreview from '../partials/QuizPreview';
import studentService from '../../services/studentService';

export default {
  name: 'StudentSelfQuiz',
  components: {
    QuizNew,
    QuizEdit,
    QuizPreview,
  },
  data() {
    return {
      quizForm: false,
      makeEdit: false,
      makeNew: false,
      // mode: 0,  // 0-리스트, 1-등록, 2-수정
      // quizData: [],
      quizData: null,
      previewAnswer: null,
    };
  },
  computed: {
    ...mapState({
      index: state => state.studentQuestion.index,
      studentQuestionList: state => state.studentQuestion.studentQuestionList,
      mode: state => state.studentQuestion.mode,
      lectureId: state => state.studentQuestion.lectureId,
    }),
    // ...mapState('NNclass', ['curLectureId']),
    ...mapGetters('studentQuestion', ['getIndex']),

  },
  async created() {

  },
  async mounted() {
    const vm = this;
    const lid = vm.lectureId;
    // const lid = vm.$route.params.lectureId;
    await vm.getQuestionList({ lectureId: lid })
    vm.updateStudentQuestionMode1({ mode: 0})

  },
  methods: {
    ...mapActions('studentQuestion', [
      'getQuestionList',
      'deleteQuestion',
      'transferStudentQuestion',
      'updateStudentQuestionMode1',
    ]),
    ...mapMutations('studentQuestion',[
      'updateStudentQuestionIndex',
      'updateStudentQuestionIndex',
      'updateStudentQuestionMode',
      'updateLectureId',
    ]),
    // setIndex() {
    //   this.$store.state.studentQuestion.index = this.q_index;
    // },
    async onClick(type, index) {
      const vm = this;
      const lid = vm.lectureId;

      const tar = vm.studentQuestionList[index];
      switch (type) {
        case 'MODIFY' : {
          
          vm.updateStudentQuestionMode1({ mode: 2 });
          vm.transferStudentQuestion({ index });
          // vm.index = vm.quizData[index].student_question_id;
          // vm.studentQuestion = tar;
          // this.updateStudentQuestionIndex({
          //   index: tar.student_question_idm
          // });
          break;
        }
        case 'PREVIEW' : {
                    vm.transferStudentQuestion({ index });

          // vm.quizData = tar;
          // vm.previewAnswer = tar.answer;
          // alert(`preview - ${JSON.stringify(vm.quizData)}`);
          break;
        }
        case 'DELETE' : {
          vm.$confirm('정말로 삭제하시겠습니까?', 'Delete Quiz', {
            confirmButtonText: '예, 삭제합니다.',
            cancelButtonText: '아니오, 삭제하지 않습니다.',
            type: 'warning',
          })
            .then(async () => {
              try {
                await vm.deleteQuestion({ lectureId: lid, index });
                vm.$notify({
                title: '삭제 성공',
                message: '문항이 삭제됨',
                type: 'success',
                duration: 3000,
              });
              } catch (error) {
                vm.$notify({
                  title: '삭제 실패',
                  message: error.toString(),
                  type: 'error',
                  duration: 3000,
                });
              }
            })
            .catch(() => {
              vm.$notify({
                title: 'Cancel',
                message: '삭제 취소됨',
                type: 'warning',
                duration: 3000,
              });
            });
          break;
        }
        default : {
          break;
        }
      }
    },
    onCreate() {
      const vm = this;
      // alert(vm.mode);
      // vm.mode = 1;
      this.updateStudentQuestionMode1({ mode: 1 });
      // vm.quizForm = true;
      // vm.makeEdit = false;
    },
    onBack(type) {
      const vm = this;
      // vm.quizForm = false;
      let text = null;
      if (type === 0) {
        text = '생성'
      } else {
        text = '수정'
      }
      vm.$confirm('정말로 뒤로가시겠습니까?', `${text} 취소`, {
        confirmButtonText: '예.',
        cancelButtonText: '아니오.',
        type: 'warning',
      })
        .then(async () => {
          this.updateStudentQuestionMode1({ mode: 0 });
        })
        .catch(() => {
        });

    },
  },
};
</script>