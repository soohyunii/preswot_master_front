<template>
  <div id="quiz_edit" style="width: 600px;">
    <el-form :model="quizForm" label-width="100px">
      <el-form-item id="quiz_type" label="문항 유형">
        <el-radio-group v-model="modifyQuestion.type" disabled>
          <el-radio-button label="1">단답</el-radio-button>
          <el-radio-button label="0">객관</el-radio-button>
          <el-radio-button label="2">서술</el-radio-button>
        </el-radio-group>
        <span> &nbsp; * 문항 유형 수정 불가 </span>
      </el-form-item>

      <div v-if="questionType !== null">
        <el-form-item label="제목">
          <el-input v-model="modifyQuestion.name" placeholder="제목을 입력하세요"
          type="textarea" :autosize="{minRows: 2, maxRows: 3 }"></el-input>
        </el-form-item>
        <el-form-item label="문제">
          <el-input v-model="modifyQuestion.question" placeholder="내용을 입력하세요." 
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

        <template v-if="modifyQuestion.type === '단답'">
          <el-form-item label="답">
            <el-input v-for="(item, index) in modifyQuestion.answer" :key="index" 
            v-model="modifyQuestion.answer[index]" placeholder="내용을 입력하세요." type="textarea"></el-input>
            <p><el-button type="primary" @click="onClick('ADD_ANSWER')">추가</el-button>
            <el-button v-if="modifyQuestion.answer.length > 1" type="danger" @click="onClick('DELETE_ANSWER')">제거</el-button></p>
          </el-form-item>
        </template>
        <template v-if="modifyQuestion.type === '객관'">
          <el-form-item label="보기">
              <el-checkbox-group v-model="modifyQuestion.answer" @change="handleAnswerListChange">
      
                <div v-for="(item, index) in modifyQuestion.choice" :key="index">
                  <el-checkbox :label="index">{{ item }}.</el-checkbox>
                  <el-input v-model="modifyQuestion.choice[n-1]" placeholder="내용을 입력하세요."  class="answer-list"></el-input>
                </div>
      
            </el-checkbox-group>

          </el-form-item>
        </template>
        <template v-if="modifyQuestion.type === '서술'">
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
        <el-form-item label="난이도">
          <el-select v-model="modifyQuestion.difficulty">
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
          
          <div v-for="(item, index) in myKeywordList" :key="item.keyword">
            <el-button>{{ item.keyword }} :: {{item.score_portion }}점</el-button>
            <el-button @click="onClick('DELETE_KEYWORD', index)" type="danger"
            style="margin-bottom: 5px;">X</el-button>
          </div>
        </el-form-item>

        <div class="ps-align-right">
          <el-button type="primary" @click="onModify">수정</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import studentService from '../../services/studentService';
import lectureService from '../../services/lectureService'; 
import { EventBus } from '../../event-bus';

export default {
  name: 'QuizEdit',
  data() {
    return {
      keyList: [{'keyword': 'a'}, {'keyword': 'b'}],
      diffList: [5,4,3,2,1],
      pts: [5,4,3,2,1],
      myKeywordList: [],
      keywordName: null,
      keywordPoint: null,
      questionType: 1,
      quizForm: null,
    };
  },
  async created() {
    const vm = this;
    let test = vm.index;
    
    // 해당 문항의 키워드를 임시로 배열로 옮김
    while(vm.myKeywordList.length) { vm.myKeywordList.pop(); }
    for (let i = 0; i < vm.modifyQuestion.student_question_keywords.length ; i += 1) {
      vm.myKeywordList.push(vm.modifyQuestion.student_question_keywords[i]);
    }
    // 해당 강의의 키워드를 불러옴
    const keywords = await lectureService.getLectureKeywords({ lectureId: vm.lectureId });
    vm.keyList = keywords.data;
  },
  computed: {
    ...mapState('studentQuestion', ['modifyQuestion','lectureId']),

  },
  methods: {
    ...mapActions('studentQuestion', ['putQuestion','deleteKeyword','postKeyword','updateStudentQuestionMode1']),
    async questionEdit(data) {
      const vm = this;
      const lid = vm.lectureId;
      // const lid = vm.$route.params.lectureId;
      const list = await studentService.getQuestion({ id: lid });
      for (let i = 0; i < list.data.length; i += 1) {
        if (data === list.data[i].student_question_id) {
        }
      }
    },
    handleChange(file, filelist) {
      const vm = this;
      if (!(['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].includes(file.raw.type))) {
        vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
        vm.initFileList = filelist.slice(0, -1);
      }
    },
    handleExceed() {
      const vm = this;
      vm.$message.warning('업로드 가능한 파일 개수를 초과하였습니다.');
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_ANSWER': {
          vm.answer.push('');
          break;
        }
        case 'DELETE_ANSWER': {
          vm.answer.pop();
          break;
        }
        case 'ADD_KEYWORD': {
          if (vm.keywordName === null || vm.keywordPoint === null) {
            vm.$message.warning('키워드와 배점을 모두 입력하십시오.');
            break;
          } else {
            for (let i = 0; i < vm.myKeywordList.length ; i += 1) {
              if (vm.myKeywordList[i].keyword === vm.keywordName) {
                 vm.$notify({
                  title: '알림',
                  message: '이미 등록한 키워드는 등록할 수 없습니다.',
                  type: 'warning',
                });
                vm.keywordName = null;
                vm.keywordPoint = null;
                return;
              }
            }
            vm.myKeywordList.push({ keyword: vm.keywordName, score_portion: vm.keywordPoint });
            vm.keywordName = null;
            vm.keywordPoint = null;
            break;
          }
        }
        case 'DELETE_KEYWORD': {
          vm.myKeywordList.splice(arg, 1);
          break;
        }
        default: {
          break;
        }
      }
    },
    async onModify() {

      const vm = this;
      // const lid = vm.$route.params.lectureId;
      const lid = vm.lectureId;

      if (!vm.myKeywordList.length) {
        vm.$message.warning('키워드는 필수 입력입니다. QuizEdit');
      } else if ( vm.modifyQuestion.name === "" || vm.modifyQuestion.question === "") {
        vm.$message.warning('모든 정보를 입력해주세요. QuizEdit');
      } else if (vm.modifyQuestion.answer.length === 0) {
        vm.$message.warning('정답을 선택해주세요. QuizEdit');
      } else {
        
        let res = await vm.putQuestion({ data: vm.modifyQuestion });
        if (res.data) {
          await vm.deleteKeyword({ id: lid, qId: vm.modifyQuestion.student_question_id });
          let res2 = await vm.postKeyword({ id: lid, qId: vm.modifyQuestion.student_question_id, data: vm.myKeywordList });
        } else {
          vm.$message.warning('수정을 실패하였습니다. 다시한번 시도해주세요. QuizEdit');
        }
        vm.$notify({
          title: '수정 완료',
          message: '성공적으로 수정 완료됨',
          type: 'success',
        });
        vm.updateStudentQuestionMode1({ mode: 0 });
      }
      
    },
  },
};
</script>

<style>
.answer-list { 
  display: inline-block;
  width: 90%;
  margin-left: 10px;
}
</style>