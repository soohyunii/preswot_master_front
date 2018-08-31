<template>
  <div id="lc_question_editor_wrapper">
    <el-form-item label="문항 유형" id="question_type">
      <el-radio-group @change="onChangeBody" v-model="inputBody.questionType">
        <el-radio-button label="SHORT_ANSWER">단답</el-radio-button>
        <el-radio-button label="MULTIPLE_CHOICE">객관</el-radio-button>
        <el-radio-button label="DESCRIPTION">서술</el-radio-button>
        <el-radio-button label="SW">SW</el-radio-button>
        <el-radio-button label="SQL">SQL</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <div v-if="inputBody.questionType !== null">
      <el-form-item label="문제" id="question">
        <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          action="#"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="initFileList"
          ref=questionUpload>
          <el-button slot="trigger" type="primary">파일 추가</el-button>
          <span slot="tip" class="el-upload__tip"> 사진(jpg, png, gif) 및 동영상(mp4) 파일만 가능합니다.</span>
        </el-upload>
      </el-form-item>

      <template v-if="inputBody.questionType === 'SHORT_ANSWER'">
        <el-form-item label="답" id="textarea_short_answer">
          <el-input v-model="inputTail.answer[0]" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
      </template>

      <template v-if="inputBody.questionType === 'MULTIPLE_CHOICE'">
        <el-form-item v-if="inputTail.questionList !== undefined" label="보기">
          <p>정답</p>
          <el-checkbox-group v-model="inputTail.answer" style="width: 100%;">
            <el-checkbox label="1">1.</el-checkbox>
            <div style="display: inline-block; width: 90%;">
              <el-input v-model="inputTail.questionList[0]" placeholder="내용을 입력해주세요."></el-input>
            </div>
            <br>
            <el-checkbox label="2">2.</el-checkbox>
            <div style="display: inline-block; width: 90%;">
              <el-input v-model="inputTail.questionList[1]" placeholder="내용을 입력해주세요."></el-input>
            </div>
            <br>
            <el-checkbox label="3">3.</el-checkbox>
            <div style="display: inline-block; width: 90%;">
              <el-input v-model="inputTail.questionList[2]" placeholder="내용을 입력해주세요."></el-input>
            </div>
            <br>
            <el-checkbox label="4">4.</el-checkbox>
            <div style="display: inline-block; width: 90%;">
              <el-input v-model="inputTail.questionList[3]" placeholder="내용을 입력해주세요."></el-input>
            </div>
            <br>
            <el-checkbox label="5">5.</el-checkbox>
            <div style="display: inline-block; width: 90%;">
              <el-input v-model="inputTail.questionList[4]" placeholder="내용을 입력해주세요."></el-input>
            </div>
            <br>
          </el-checkbox-group>
        </el-form-item>
      </template>

      <template v-if="inputBody.questionType === 'DESCRIPTION'">
        <el-form-item label="모범답안" id="textarea_short_answer">
          <el-input v-model="inputTail.answer[0]" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="initFileList"
            ref=answerUpload>
            <el-button slot="trigger" type="primary">파일 추가</el-button>
          </el-upload>
        </el-form-item>
      </template>

      <template v-if="inputBody.questionType === 'SW'">
        <el-form-item label="언어">
          <el-select v-model="inputTail.language">
            <el-option
              v-for="language in languageList"
              :key="language.value"
              :label="language.label"
              :value="language.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="입력 설명">
          <el-input v-model="inputTail.inputDescription" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="출력 설명">
          <el-input v-model="inputTail.outputDescription" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="샘플 입력">
          <el-input v-model="inputTail.sampleInput" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="샘플 출력">
          <el-input v-model="inputTail.sampleOutput" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="테스트 케이스 추가">
          <el-button @click="onClick('ADD_TEST_CASE')">추가</el-button>
        </el-form-item>
        <template v-if="inputTail.testCaseList !== undefined">
          <div v-for="(testCase, index) in inputTail.testCaseList" :key="index">
            <el-form-item label='테스트 케이스 입력'>
              <el-input v-model="testCase.input" placeholder="내용을 입력해주세요." type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="출력">
              <el-input v-model="testCase.output" placeholder="내용을 입력해주세요." type="textarea"></el-input>
            </el-form-item>
            <div style="text-align: right;">
            <el-button type="danger" @click="onClick('DELETE_TEST_CASE', index)">테스트 케이스 {{ index }} 삭제</el-button>
            <br /><br /><br />
            </div>
          </div>
        </template>
        <el-form-item label="메모리 제한(MB)">
          <el-input v-model="inputTail.memoryLimit" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="시간 제한(초)">
          <el-input v-model="inputTail.timeLimit" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
      </template>

      <div v-show="inputBody.questionType === 'SQL'">
        <el-form-item label="SQLite">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="initFileList"
            :limit=1
            :on-exceed="handleExceed"
            ref="sqlUpload">
            <el-button>파일 추가</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="답">
          <el-input v-model="inputTail.answer[0]" placeholder="내용을 입력해주세요." type="textarea"></el-input>
        </el-form-item>
      </div>
      

      <el-form-item label="키워드" id="keyword">
        <el-autocomplete
          class="input-new-tag"
          v-model="inputTail.keywordName"
          :fetch-suggestions="querySearch"
          ref="saveTagInput"
          placeholder="키워드"
        />
        <div style="display: inline-block; width: 100px;">
          <el-input id="input_keyword_point" v-model="inputTail.keywordPoint" placeholder="배점"></el-input>
        </div>
        <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
        <div v-for="(item,index) in inputTail.assignedKeywordList" :key="item.keyword" style="display: inline-block; width: 200px;">
          <el-button>{{ item.keyword }} / {{ item.score }}</el-button>
          <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px">X</el-button>
        </div>
      </el-form-item>
      <el-form-item label="난이도" id="difficulty">
        <el-select v-model.number="inputTail.difficulty">
          <el-option
            v-for="level in difficultyList"
            :key="level"
            :label="level"
            :value="level">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
// TODO : 메모리, 시간 정수형으로 validate!!!
import { mapState } from 'vuex';

export default {
  name: 'LcQuestionEditor',
  data() {
    const initialInputBody = {
      questionType: null,
    };
    const initialInputTail = {
      assignedKeywordList: [],
      testCaseList: [],
      answer: [],
      difficulty: 3,
      questionFile: [],
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
      difficultyList: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
      languageList: [{
        value: 'python3',
        label: 'Python3',
      }, {
        value: 'c',
        label: 'C',
      }, {
        value: 'cpp',
        label: 'C++',
      }, {
        value: 'cshop',
        label: 'C#',
      }, {
        value: 'java',
        label: 'Java',
      }, {
        value: 'shell_script',
        label: 'Shell Script',
      }, {
        value: 'free_basic',
        label: 'Free Basic',
      }, {
        value: 'go',
        label: 'Go',
      }, {
        value: 'php',
        label: 'PHP',
      }],
      initFileList: [], // 초기 파일 목록이며, 양방향 바인딩에 사용되지 않음.
    };
  },
  computed: {
    ...mapState('keyword', [
      'keywordList',
    ]),
    modifiedKeywordList() {
      const vm = this;
      return vm.keywordList.map(x => ({ value: x.keyword }));
    },
  },
  methods: {
    onChangeBody() {
      const vm = this;
      vm.inputTail = Object.assign({}, vm.initialInputTail);
      vm.$set(vm.inputTail, 'questionFile', vm.$refs.questionUpload.uploadFiles);

      if (vm.inputBody.questionType === 'MULTIPLE_CHOICE') {
        vm.$set(vm.inputTail, 'questionList', []);
      }
      if (vm.inputBody.questionType === 'DESCRIPTION') {
        vm.$set(vm.inputTail, 'answerFile', vm.$refs.answerUpload.uploadFiles);
      }
      if (vm.inputBody.questionType === 'SQL') {
        vm.$set(vm.inputTail, 'sqlFile', vm.$refs.sqlUpload.uploadFiles);
      }
    },
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.modifiedKeywordList.filter(vm.createFilter(queryString)) : vm.modifiedKeywordList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
      // TODO: reset keyword list
    },
    onClick(type, arg) {
      const vm = this;
      let i1;
      switch (type) {
        case 'ADD_KEYWORD': {
          let isEnroll = false;
          for (i1 = 0; i1 < vm.keywordList.length; i1 += 1) {
            if (vm.keywordList[i1].keyword === vm.inputTail.keywordName) {
              isEnroll = true;
            }
          }
          if (isEnroll === false) {
            vm.$notify({
              title: '알림',
              message: '키워드 등록 탭에 등록되지 않은 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          if (vm.inputTail.assignedKeywordList.map(x => x.keyword).indexOf(vm.inputTail.keywordName) !== -1) { // eslint-disable-line
            vm.$notify({
              title: '알림',
              message: '이미 등록한 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.inputTail.assignedKeywordList.push({
            keyword: vm.inputTail.keywordName,
            score: vm.inputTail.keywordPoint,
          });
          vm.inputTail.keywordName = null;
          vm.inputTail.keywordPoint = null;
          break;
        }
        case 'DELETE_KEYWORD': {
          vm.inputTail.assignedKeywordList.splice(arg, 1);
          break;
        }
        case 'ADD_TEST_CASE': {
          vm.inputTail.testCaseList.push({
            input: '',
            output: '',
          });
          break;
        }
        case 'DELETE_TEST_CASE': {
          vm.inputTail.testCaseList.splice(arg, 1);
          break;
        }
        default : {
          break;
        }
      }
    },
    handleExceed() {
      this.$message.warning(
        'SQLite Database 파일은 1개만 업로드 할 수 있습니다.',
      );
    },
    handleChange(file, filelist) {
      if (!(['image/gif', 'image/png', 'image/jpeg', 'video/mp4'].includes(file.raw.type))) {
        this.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
        this.initFileList = filelist.slice(0, -1);
        this.inputTail.questionFile = filelist.slice(0, -1);
      }
    },
  },
};
</script>
