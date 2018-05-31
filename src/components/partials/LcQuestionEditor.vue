<template>
  <div id="lc_question_editor_wrapper">
    <el-form-item label="문항 유형" id="question_type">
      <el-radio-group @change="onChangeBody" v-model="inputBody.questionType">
        <el-radio-button label="shortAnswer">단답</el-radio-button>
        <el-radio-button label="multipleChoice">객관</el-radio-button>
        <el-radio-button label="description">서술</el-radio-button>
        <el-radio-button label="sw">SW</el-radio-button>
        <el-radio-button label="sql">SQL</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="문제" id="question">
        <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </el-form-item>
    <template v-if="inputBody.questionType === 'multipleChoice'">
      <el-form-item v-if="inputTail.questionList !== undefined" label="보기">
        <p>정답</p>
        <el-radio-group v-model="inputTail.answer" style="width: 100%;">
          <el-radio :label="1">1.</el-radio>
          <div style="display: inline-block; width: 90%;">
            <el-input v-model="inputTail.questionList[0]" placeholder="내용을 입력해주세요."></el-input>
          </div>
          <br>
          <el-radio :label="2">2.</el-radio>
          <div style="display: inline-block; width: 90%;">
            <el-input v-model="inputTail.questionList[1]" placeholder="내용을 입력해주세요."></el-input>
          </div>
          <br>
          <el-radio :label="3">3.</el-radio>
          <div style="display: inline-block; width: 90%;">
            <el-input v-model="inputTail.questionList[2]" placeholder="내용을 입력해주세요."></el-input>
          </div>
          <br>
          <el-radio :label="4">4.</el-radio>
          <div style="display: inline-block; width: 90%;">
            <el-input v-model="inputTail.questionList[3]" placeholder="내용을 입력해주세요."></el-input>
          </div>
          <br>
          <el-radio :label="5">5.</el-radio>
          <div style="display: inline-block; width: 90%;">
            <el-input v-model="inputTail.questionList[4]" placeholder="내용을 입력해주세요."></el-input>
          </div>
          <br>
        </el-radio-group>
      </el-form-item>
    </template>
    <template v-if="inputBody.questionType === 'shortAnswer'">
      <el-form-item label="답">
        <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea"></el-input>
      </el-form-item>
    </template>
    <template v-if="inputBody.questionType === 'description'">
    </template>
    <template v-if="inputBody.questionType === 'sw'">
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
        <el-input v-model="inputTail.inputDesc" placeholder="내용을 입력해주세요." type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="출력 설명">
        <el-input v-model="inputTail.outputDesc" placeholder="내용을 입력해주세요." type="textarea"></el-input>
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
          <el-button @click="onClick('DELETE_TEST_CASE', index)">테스트 케이스 {{ index }} 삭제</el-button>
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
    <template v-if="inputBody.questionType === 'sql'">
      <el-form-item label="SQLite">
        <el-button @click="onClick('ADD_FILE')">파일추가</el-button>
      </el-form-item>
      <el-form-item label="답">
        <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea"></el-input>
      </el-form-item>
    </template>
    <el-form-item label="키워드" id="keyword">
      <el-autocomplete
        class="input-new-tag"
        v-model="inputTail.keywordName"
        :fetch-suggestions="querySearch"
        ref="saveTagInput"
        placeholder="키워드"
      />
      <!-- <el-select v-model="inputTail.keywordName">
        <el-option
          v-for="keyword in keywordList"
          :key="keyword.value"
          :label="keyword.label"
          :value="keyword.value">
        </el-option>
      </el-select> -->
      <div style="display: inline-block; width: 100px;">
        <el-input v-model="inputTail.keywordPoint" placeholder="배점"></el-input>
      </div>
      <el-button @click="onClick('ADD_KEYWORD')">추가</el-button><br>
      <div v-for="item in inputTail.assignedKeywordList" :key="item.keywordName" style="display: inline-block; width: 200px;">
        <el-button>{{ item.keywordName }} / {{ item.keywordPoint }}</el-button>
        <el-button @click="onClick('DELETE_KEYWORD',item.keywordName)" type="danger" style="margin: 0px">X</el-button>
      </div>
    </el-form-item>
    <el-form-item label="난이도">
      <el-select v-model="inputTail.difficulty">
        <el-option
          v-for="level in difficultyList"
          :key="level"
          :label="level"
          :value="level">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'LcQuestionEditor',
  data() {
    const initialInputBody = {
      questionType: null,
    };
    const initialInputTail = {
      assignedKeywordList: [],
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
      keywordList: [ // TODO: extract it to somewhere else
        {
          value: '키워드1',
          label: '키워드1',
        }, {
          value: '키워드2',
          label: '키워드2',
        }, {
          value: '키워드3',
          label: '키워드3',
        },
      ],
      difficultyList: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
      languageList: [
        {
          value: 'C',
          label: 'C',
        }, {
          value: 'Java',
          label: 'Java',
        }, {
          value: 'Python',
          label: 'Python',
        }, {
          value: '현재 언어 목록은 MOCK입니다.',
          label: '현재 언어 목록은 MOCK입니다.',
        },
      ],
    };
  },
  methods: {
    onChangeBody() {
      const vm = this;
      vm.inputTail = Object.assign({}, vm.initialInputTail);
      // vm.$set(vm.inputTail, 'selectedKeywordList', []);
    },
    querySearch(queryString, cb) {
      const vm = this;
      const results = queryString ?
        vm.keywordList.filter(vm.createFilter(queryString)) : vm.keywordList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) { // eslint-disable-next-line
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_KEYWORD': {
          vm.inputTail.assignedKeywordList.push({
            keywordName: vm.inputTail.keywordName,
            keywordPoint: vm.inputTail.keywordPoint,
          });
          vm.inputTail.keywordName = null;
          vm.inputTail.keywordPoint = null;
          break;
        }
        case 'DELETE_KEYWORD': {
          const index = vm.inputTail.assignedKeywordList.findIndex(x => x.keywordName === arg);
          vm.inputTail.assignedKeywordList.splice(index, 1);
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
        case 'ADD_FILE': {
          console.log('//TODO add File'); // eslint-disable-line no-console
          break;
        }
        case 'addQuestion': { // TODO: move to lc survey editor
          // TODO: rename add choice
          vm.inputTail.questionList.push({
            question: '',
          });
          break;
        }
        default : {
          break;
        }
      }
    },
  },
};
</script>

