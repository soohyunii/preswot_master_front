<template>
  <div>
    <div v-if="!quizForm">
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
        <p><el-button type="primary" @click="onSubmit">출제하기</el-button></p>
      </div>
    </div>
    <div v-if="quizForm">
      <div v-if="makeEdit">
        <template>
          <h2>문항 수정</h2>
          <div id="quiz_edit" style="width: 600px;">
            <el-form :model="quizEdit" label-width="100px">
              <el-form-item id="quiz_type" label="문항 유형">
                <el-radio-group v-model="questionType" disabled>
                  <el-radio-button label="1">단답</el-radio-button>
                  <el-radio-button label="0">객관</el-radio-button>
                  <el-radio-button label="2">서술</el-radio-button>
                  <el-radio-button label="4">SQL</el-radio-button>
                </el-radio-group>
                <span> &nbsp; * 문항 유형 수정 불가 </span>
              </el-form-item>
              <el-form-item label="제목">
                <el-input v-model="questionName" placeholder="제목을 입력하세요"
                type="textarea" :autosize="{minRows: 2, maxRows: 3 }"></el-input>
              </el-form-item>
              <el-form-item label="문제">
                <el-input v-model="question" placeholder="내용을 입력하세요." 
                type="textarea" :autosize="{ minRows: 8, maxRows: 12 }"></el-input>
              </el-form-item>
              <el-form-item>
                <el-upload
                  :auto-upload="false"
                  :on-change="handleChange"
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="initFileList">
                  <el-button slot="trigger" type="primary">파일 추가</el-button>
                  <span slot="tip" class="el-upload__tip">
                    사진(jpg, png, gif) 및 동영상(mp4) 파일만 가능합니다.</span>
                </el-upload>
              </el-form-item>
              <template v-if="questionType === 1">
                <el-form-item label="답">
                  <el-input v-for="(item, index) in answer" :key="index" 
                  v-model="answer[index]" placeholder="내용을 입력하세요." type="textarea"></el-input>
                  <p>
                  <el-button type="primary" @click="onClick('ADD_ANSWER')">추가</el-button>
                  <el-button v-if="answer.length > 1" type="danger" @click="onClick('DELETE_ANSWER')">제거</el-button>
                  </p>
                </el-form-item>
              </template>
              <template v-if="questionType === 0">
                <el-form-item label="보기">
                  <el-checkbox-group v-model="answer">
                    <el-checkbox label="1">1.</el-checkbox>
                    <div style="display: inline-block; width: 90%; margin-left: 10px;">
                      <el-input v-model="questionList[0]" placeholder="내용을 입력하세요."></el-input>
                    </div>
                    <el-checkbox label="2">2.</el-checkbox>
                    <div style="display: inline-block; width: 90%; margin-left: 10px;">
                      <el-input v-model="questionList[1]" placeholder="내용을 입력하세요."></el-input>
                    </div>
                    <el-checkbox label="3">3.</el-checkbox>
                    <div style="display: inline-block; width: 90%; margin-left: 10px;">
                      <el-input v-model="questionList[2]" placeholder="내용을 입력하세요."></el-input>
                    </div>
                    <el-checkbox label="4">4.</el-checkbox>
                    <div style="display: inline-block; width: 90%; margin-left: 10px;">
                      <el-input v-model="questionList[3]" placeholder="내용을 입력하세요."></el-input>
                    </div>
                    <el-checkbox label="5">5.</el-checkbox>
                    <div style="display: inline-block; width: 90%; margin-left: 10px;">
                      <el-input v-model="questionList[4]" placeholder="내용을 입력하세요."></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </template>
              <template v-if="questionType === 2">
                <el-form-item label="모범답안">
                  <el-input v-model="answer[0]" placeholder="내용을 입력하세요." type="textarea"
                  :autosize="{ minRows: 8, maxRows: 12}"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-upload
                    :auto-upload="false"
                    :file-list="initFileList"
                    :limit="3"
                    :on-exceed="handleExceed">
                    <el-button slot="trigger" type="primary">파일 추가</el-button>
                  </el-upload>
                </el-form-item>
              </template>
              <template v-if="questionType === 4">
                <el-form-item label="SQLite">
                  <el-upload
                    :auto-upload="false"
                    :file-list="initFileList"
                    :limit="1"
                    :on-exceed="handleExceed">
                    <el-button slot="trigger">파일 추가</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="답">
                  <el-input v-model="answer[0]" placeholder="내용을 입력하세요." type="textarea"></el-input>
                </el-form-item>
              </template>
              <el-form-item label="난이도">
                <el-select v-model="level">
                  <el-option v-for="diff in diffList" :key="diff" :value="diff">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="키워드">
                <div style="width: 50%; margin-bottom: 5px;">
                  <el-select v-model="keywordName" placeholder="키워드">
                    <el-option v-for="key in keyList" :key="key.keyword" :value="key.keyword">
                    </el-option>
                  </el-select>
                </div>
                <el-select v-model="keywordPoint" placeholder="배점">
                  <el-option v-for="pt in pts" :key="pt" :value="pt">
                  </el-option>
                </el-select>
                <el-button @click="onClick('ADD_KEYWORD')">추가</el-button>
                <div v-for="(item, index) in keywordList" :key="item.keyword">
                  <el-button>{{ item.keyword }} :: {{item.score_portion }}점</el-button>
                  <el-button @click="onClick('DELETE_KEYWORD', index)" type="danger"
                  style="margin-bottom: 5px;">X</el-button>
                </div>
              </el-form-item>
              <div class="ps-align-right">
                <el-button type="primary" @click="onCreate">수정</el-button>
                <el-button @click="onBack">취소</el-button>
              </div>
            </el-form>
          </div>
        </template>
      </div>
      <div v-if="!makeEdit">
        <el-button @click="onBack" icon="el-icon-back"></el-button>
        <quiz-new />
      </div>
    </div>
  </div>
</template>

<script>
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
      quizData: [],
      initFileList: [],
      diffList: [5, 4, 3, 2, 1],
      answer: [''],
      level: '',
      keyList: [],
      questionList: [],
      keywordName: '',
      keywordPoint: '',
      pts: [5, 4, 3, 2, 1],
      keywordList: [],
      qId: '',
      dialogVisible: false,
      previewAnswer: [],
    };
  },
  async mounted() {
    const vm = this;
    const lid = vm.$route.params.lectureId;
    const res = await studentService.getQuestion({ id: lid });
    const key = await studentService.getKeyword({ id: lid });
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
    for (let i = 0; i < key.data.length; i += 1) {
      vm.keyList.push(key.data[i]);
    }
  },
  methods: {
    async onClick(type, index, arg) {
      const vm = this;
      const lid = vm.$route.params.lectureId;
      const res = await studentService.getQuestion({ id: lid });
      const tar = res.data[index];
      switch (type) {
        case 'MODIFY' : {
          vm.quizForm = true;
          vm.makeEdit = true;
          vm.keywordName = '';
          vm.keywordPoint = '';
          vm.keywordList = [];
          vm.questionType = tar.type;
          vm.questionName = tar.name;
          vm.question = tar.question;
          vm.level = tar.difficulty;
          vm.answer = tar.answer;
          vm.questionList = tar.choice;
          vm.qId = tar.student_question_id;
          const qkeywordList = tar.student_question_keywords;
          for (let i = 0; i < qkeywordList.length; i += 1) {
            vm.keywordList.push({
              keyword: qkeywordList[i].keyword,
              score_portion: qkeywordList[i].score_portion,
            });
          }
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
        case 'ADD_ANSWER': {
          vm.answer.push('');
          break;
        }
        case 'DELETE_ANSWER': {
          vm.answer.pop();
          break;
        }
        case 'ADD_KEYWORD': {
          if (vm.keywordName !== '' && vm.keywordPoint !== '') {
            for (let i = 0; i < vm.keywordList.length; i += 1) {
              if (vm.keywordList[i].keyword === vm.keywordName) {
                vm.$notify({
                  title: '알림',
                  message: '이미 등록한 키워드는 등록할 수 없습니다.',
                  type: 'warning',
                });
                vm.keywordName = '';
                vm.keywordPoint = '';
              }
            }
            if (vm.keywordName !== '') {
              vm.keywordList.push({
                keyword: vm.keywordName,
                score_portion: vm.keywordPoint,
              });
              vm.keywordName = '';
              vm.keywordPoint = '';
            }
            break;
          } else {
            vm.$message.warning('키워드와 배점을 모두 입력하십시오.');
            break;
          }
        }
        case 'DELETE_KEYWORD': {
          vm.keywordList.splice(arg, 1);
          break;
        }
        default : {
          break;
        }
      }
    },
    onSubmit() {
      const vm = this;
      vm.quizForm = true;
      vm.makeEdit = false;
    },
    onBack() {
      const vm = this;
      vm.quizForm = false;
    },
    handleClose() {
      const vm = this;
      vm.dialogVisible = false;
    },
    handleExceed() {
      const vm = this;
      vm.$message.warning('업로드 가능한 파일 개수를 초과하였습니다.');
    },
    handleChange(file, filelist) {
      const vm = this;
      if (!(['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].includes(file.raw.type))) {
        vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
        vm.initFileList = filelist.slice(0, -1);
      }
    },
    async onCreate() {
      const vm = this;
      const lid = vm.$route.params.lectureId;
      if (!vm.keywordList.length) {
        vm.$message.warning('키워드는 필수 입력입니다.');
      } else {
        try {
          await studentService.deleteKeyword({ id: lid, qId: vm.qId });
          try {
            await studentService.postKeyword({
              id: lid,
              qId: vm.qId,
              data: vm.keywordList,
            });
            await studentService.putQuestion({
              id: lid,
              qId: vm.qId,
              name: vm.questionName,
              question: vm.question,
              difficulty: vm.level,
              choice: vm.questionList,
              answer: vm.answer,
            });
            vm.$message.success('수정 완료');
            setTimeout(() => {
              location.reload();
            }, 2000);
          } catch (error) {
            vm.$notify({
              title: '키워드 추가/수정 실패',
              message: error.toString(),
              type: 'error',
            });
          }
        } catch (error) {
          vm.$notify({
            title: '키워드 초기화 실패',
            message: error.toString(),
            type: 'error',
          });
        }
      }
    },
  },
};
</script>