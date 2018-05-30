<template>
  <div id="teacher_lecture_new_wrapper">
    <h2>
      강의 아이템 추가 TODO: isEditing이면 강의 아이템 수정으로
    </h2>

    {{ inputHead }}<br /><br />
    {{ inputBody }}<br /><br />
    {{ inputTail }}<br /><br />

    <el-form label-width="125px" style="max-width: 800px;">
      <el-form-item label="타입">
        <el-radio-group v-model.number="inputHead.type">
          <el-radio-button :label="0">예습</el-radio-button>
          <el-radio-button :label="1">본강</el-radio-button>
          <el-radio-button :label="2">복습</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="아이템 유형">
        <el-select @change="onChange('Head')" v-model="inputHead.lcItemType">
          <el-option
            v-for="option in selectOptionList"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="아이템 이름">
        <el-input v-model="inputHead.lcItemName" placeholder="내용을 입력해주세요."></el-input>
      </el-form-item>

      <template v-if="inputHead.lcItemType === 'question'">
        <el-form-item label="문항 유형">
          <el-radio-group @change="onChange('Body')" v-model="inputBody.questionType">
            <el-radio-button label="multipleChoice">객관</el-radio-button>
            <el-radio-button label="shortAnswer">단답</el-radio-button>
            <el-radio-button label="description">서술</el-radio-button>
            <el-radio-button label="sw">SW</el-radio-button>
            <el-radio-button label="sql">SQL</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="문제">
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
            <el-button @click="onClick('addTestCase')">추가</el-button>
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
              <el-button @click="onClick('deleteTestCase', index)">테스트 케이스 {{ index }} 삭제</el-button>
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
            <el-button @click="onClick('addFile')">파일추가</el-button>
          </el-form-item>
          <el-form-item label="답">
            <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="키워드">
          <el-select v-model="inputTail.keywordName">
            <el-option
              v-for="keyword in keywordList"
              :key="keyword.value"
              :label="keyword.label"
              :value="keyword.value">
            </el-option>
          </el-select>
          <div style="display: inline-block; width: 100px;">
            <el-input v-model="inputTail.keywordPoint" placeholder="배점"></el-input>
          </div>
          <el-button @click="onClick('addKeyword')">추가</el-button><br>
          <div v-for="item in inputTail.keywordPointList" :key="item.keywordName" style="display: inline-block; width: 200px;">
            <el-button>{{ item.keywordName }} / {{ item.keywordPoint }}</el-button>
            <el-button @click="onClick('deleteKeyword',item.keywordName)" type="danger" style="margin: 0px">X</el-button>
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
      </template>

      <template v-if="inputHead.lcItemType === 'survey'">
        <el-form-item label="문항 유형">
          <el-radio-group @change="onChange('Body')" v-model="inputBody.questionType">
            <el-radio-button label="multipleChoice">객관</el-radio-button>
            <el-radio-button label="description">서술</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="설문 질문">
          <el-input v-model="inputTail.question" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
        <template v-if="inputBody.questionType === 'multipleChoice'">
          <el-form-item v-if="inputTail.questionList !== undefined" label="항목">
            <div v-for="(question, index) in inputTail.questionList" :key="index">
              <span>{{ index+1 }}</span>
                <div style="display: inline-block; width: 90%;">
                  <el-input v-model="question.question" placeholder="내용을 입력해주세요."></el-input>
                </div>
              <br>
            </div>
            <el-button @click="onClick('addQuestion')" style="width: 80%;">항목 추가</el-button>
          </el-form-item>
        </template>
      </template>

      <template v-if="inputHead.lcItemType === 'practice'">
        <el-form-item label="코드">
          <el-input v-model="inputTail.code" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
      </template>

      <template v-if="inputHead.lcItemType === 'discussion'">
        <el-form-item label="토론 주제">
          <el-input v-model="inputTail.code" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="ps-align-right">
      <el-button type="primary">추가 / 수정</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputHead: {},
      inputBody: {},
      inputTail: {},
      selectOptionList: [{
        value: 'question',
        label: '문항',
      }, {
        value: 'survey',
        label: '설문',
      }, {
        value: 'practice',
        label: '실습',
      }, {
        value: 'discussion',
        label: '토론',
      },
      ],
      keywordList: [{
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
      flag: false,
      difficultyList: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
      languageList: [{
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
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'addKeyword': {
          vm.inputTail.keywordPointList.push({
            keywordName: vm.inputTail.keywordName,
            keywordPoint: vm.inputTail.keywordPoint,
          });
          vm.inputTail.keywordName = null;
          vm.inputTail.keywordPoint = null;
          break;
        }
        case 'deleteKeyword': {
          const index = vm.inputTail.keywordPointList.findIndex(x => x.keywordName === arg);
          vm.inputTail.keywordPointList.splice(index, 1);
          break;
        }
        case 'addTestCase': {
          vm.inputTail.testCaseList.push({
            input: '',
            output: '',
          });
          break;
        }
        case 'deleteTestCase': {
          vm.inputTail.testCaseList.splice(arg, 1);
          break;
        }
        case 'addFile': {
          console.log('//TODO add File'); // eslint-disable-line no-console
          break;
        }
        case 'addQuestion': {
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
    onChange(type) {
      const vm = this;
      switch (type) {
        case 'Head': {
          vm.inputBody = {};
          vm.inputTail = {};
          break;
        }
        case 'Body': {
          vm.inputTail = {};
          if (vm.inputHead.lcItemType === 'question') {
            // 이 인스턴스 메소드는 vue에서 추적 가능한 속성을 생성하는 기능을 함.
            vm.$set(vm.inputTail, 'keywordPointList', []);
          }
          if (vm.inputBody.questionType === 'multipleChoice') {
            vm.$set(vm.inputTail, 'questionList', []);
          }
          if (vm.inputBody.questionType === 'sw') {
            vm.$set(vm.inputTail, 'testCaseList', []);
          }
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
