<template>
  <div>
    <div v-if="mode === 0">
      <el-table :data="quizData" height="400">
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
        <el-table-column label="미리보기" align="center" width="130">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('PREVIEW', scope.$index)">미리보기</el-button>
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
    <div v-if="mode ===0"></div>
      <!-- <div v-if="!makeEdit"> -->
        <el-button @click="onBack" icon="el-icon-back"></el-button>
        <quiz-new/>
      <!-- </div> -->
    </div>
    <div v-else-if="mode === 2">
      <el-button @click="onBack" icon="el-icon-back"></el-button>
      <quiz-edit/>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
      mode: 0,  // 0-리스트, 1-등록, 2-수정
      quizData: [],
    };
  },
  computed: {
    ...mapState('studentQuestion', [
      'studentQuestionList',
      'studentQuestion',
      'mode',
      'index',
    ]),
  },
  async created() {
    const vm = this;
    const lid = vm.$route.params.lectureId;
    // let res = await vm.getQuestionList(lid);
    // const res11 = await studentService.getQuestionList(lid);

    // const res = await studentService.getQuestionList({ id: lid });
    // for (let i = 0; i < res.data.length; i += 1) {
    //   vm.quizData.push(res.data[i]);
    // }

  },
  async mounted() {
    const vm = this;
    const lid = vm.$route.params.lectureId;
    // alert(lid);
    const res = await studentService.getQuestionList({ id: lid });
    for (let i = 0; i < res.data.length; i += 1) {
      vm.quizData.push(res.data[i]);
      const date = new Date(res.data[i].createdAt);
      vm.quizData[i].submitTime = date.toString().split(' GMT')[0];
      if (res.data[i].type === 0) {
        vm.quizData[i].type = '객관';
      } else if (res.data[i].type === 1) {
        vm.quizData[i].type = '단답';
      } else if (res.data[i].type === 2) {
        vm.quizData[i].type = '서술';
      } else if (res.data[i].type === 4) {
        vm.quizData[i].type = 'SQL';
      }
    }

    // let res = await vm.getQuestionList({ id: lid });

    // console.log(`question len - ${vm.studentQuestionList.length}`);
    // alert(vm.studentQuestionList);
    // for (let i = 0; i < vm.studentQuestionList.length; i += 1) {
    //   vm.quiz.push(vm.studentQuestionList[i]);
    // }

    // console.log(`lectureId - ${lid}`);
    // const res = await studentService.getQuestion({ id: lid });
    // const key = await studentService.getKeyword({ id: lid });
    // for (let i = 0; i < key.data.length; i += 1) {
    //   vm.keyList.push(key.data[i]);
    // }
  },
  methods: {
    ...mapActions('studentQuestion', [
      'getQuestionList',
    ]),
    async onClick(type, index) {
      const vm = this;
      // const lid = vm.$route.params.lectureId;
      // const res = await studentService.getQuestion({ id: lid });
      // const tar = res.data[index];
      const tar = vm.quizData[index];
      switch (type) {
        case 'MODIFY' : {
          vm.mode = 2;
          // vm.quizForm = true;
          // vm.makeEdit = false;
          // vm.makeNew = false;
          // alert(index);=
          // alert(JSON.stringify(vm.quizData[index]));
          
          vm.index = vm.quizData[index].student_question_id;
          vm.studentQuestion = tar;

          // vm.keywordName = '';
          // vm.keywordPoint = '';
          // vm.keywordList = [];
          // vm.questionType = tar.type;
          // vm.questionName = tar.name;
          // vm.question = tar.question;
          // vm.level = tar.difficulty;
          // vm.answer = tar.answer;
          // vm.questionList = tar.choice;
          // vm.qId = tar.student_question_id;
          // const qkeywordList = tar.student_question_keywords;
          // for (let i = 0; i < qkeywordList.length; i += 1) {
          //   vm.keywordList.push({
          //     keyword: qkeywordList[i].keyword,
          //     score_portion: qkeywordList[i].score_portion,
          //   });
          // }
          break;
        }
        case 'PREVIEW' : {
          vm.dialogVisible = true;
          vm.quizItem = tar;
          vm.previewAnswer = [];
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
                await studentService.deleteQuestion({ id: lid, qId: tar.student_question_id });
                vm.$message.success('삭제 완료');
                setTimeout(() => {
                  location.reload();
                }, 1000);
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
      vm.mode = 1;
      alert('onCreate');
      // vm.quizForm = true;
      // vm.makeEdit = false;
    },
    onBack() {
      const vm = this;
      // vm.quizForm = false;
      vm.mode = 0;
    },
    handleClose() {
      const vm = this;
      vm.dialogVisible = false;
    },
    // handleExceed() {
    //   const vm = this;
    //   vm.$message.warning('업로드 가능한 파일 개수를 초과하였습니다.');
    // },
    handleChange(file, filelist) {
      const vm = this;
      if (!(['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].includes(file.raw.type))) {
        vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
        vm.initFileList = filelist.slice(0, -1);
      }
    },
  },
};
</script>