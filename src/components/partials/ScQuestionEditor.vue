<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="파일 업로드">
            <upload from="ScQuestionEditor"/>
          </el-form-item>

          <el-form-item label="키워드">
            <keyword-editor></keyword-editor>
          </el-form-item>

          <br />

          <el-form-item label="문항 유형">
            <el-radio-group
              v-model="pType"
              @change="onChange('TYPE')"
            >
              <el-radio-button :label="0">객관</el-radio-button>
              <el-radio-button :label="1">단답</el-radio-button>
              <el-radio-button :label="2">서술</el-radio-button>
              <el-radio-button :label="3">코딩</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TYPE" />

          <template v-if="[0, 1, 2, 3].includes(pType)">
            <el-form-item label="문제" prop="pQuestion">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pQuestion"
                @change="onChange('QUESTION')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.QUESTION" />
          </template>

          <template v-if="[0].includes(pType)">
            <el-form-item label="보기" prop="pChoice">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pChoice"
                @change="onChange('CHOICE')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.CHOICE" />
          </template>

          <template v-if="[0, 1, 2].includes(pType)">
            <el-form-item label="답" prop="pAnswer">
              <el-input
                :type="pType === 1 ? 'input' : 'textarea'"
                :rows="3"
                v-model.lazy="pAnswer"
                @change="onChange('ANSWER')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.ANSWER" />
          </template>

          <template v-if="[0].includes(pType)">
            <el-form-item label="답 순서 중요">
              <el-radio-group
                v-model="pIsOrderingAnswer"
                @change="onChange('ISORDERINGANSWER')"
              >
                <el-radio-button :label="0">아니요</el-radio-button>
                <el-radio-button :label="1">예</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.ISORDERINGANSWER" />
          </template>

          <!-- 코딩 -->
          <template v-if="[3].includes(pType)">
            <el-form-item label="언어" prop="languageList">
              <el-select
                type="textarea"
                :rows="3"
                v-model.lazy="pLanguageList"
                multiple
                size="large"
                @change="onChange('LANGUAGE_LIST')"
              >
                <el-option
                  v-for="item in supportedLanguageList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.LANGUAGE_LIST" />
          </template>

          <template v-if="[3].includes(pType)">
            <br />
            <br />
            <el-form-item label="입력 설명" prop="pInputDescription">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pInputDescription"
                @change="onChange('INPUT_DESCRIPTION')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.INPUT_DESCRIPTION" />
          </template>

          <template v-if="[3].includes(pType)">
            <el-form-item label="출력 설명" prop="pOutputDescription">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pOutputDescription"
                @change="onChange('OUTPUT_DESCRIPTION')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.OUTPUT_DESCRIPTION" />
          </template>

          <template v-if="[3].includes(pType)">
            <el-form-item label="샘플 입력" prop="pSampleInput">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pSampleInput"
                @change="onChange('SAMPLE_INPUT')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.SAMPLE_INPUT" />
          </template>

          <template v-if="[3].includes(pType)">
            <el-form-item label="샘플 출력" prop="pSampleOutput">
              <el-input
                type="textarea"
                :rows="3"
                v-model.lazy="pSampleOutput"
                @change="onChange('SAMPLE_OUTPUT')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.SAMPLE_OUTPUT" />
          </template>


          <template v-if="[3].includes(pType)">
            <h3>테스트케이스</h3>
            <template v-for="(item, index) in pTestCaseList">
              <el-form-item :label="`테스트 케이스${index + 1} 입력`" :key="`${item.num}i`">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model.lazy="pTestCaseList[index].input"
                />
              </el-form-item>
              <el-form-item :label="`테스트 케이스${index + 1} 출력`" :key="`${item.num}o`">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model.lazy="pTestCaseList[index].output"
                />
              </el-form-item>
              <el-button type="danger" :key="`${item.num}b`">테스트 케이스{{ index + 1 }} 삭제</el-button>
              <br :key="`${item.num}b1`" />
              <br :key="`${item.num}b2`" />

            </template>
            <el-button type="primary" @click="onClick('ADD_TEST_CASE')">테스트 케이스 추가</el-button>

            <br />
            <br />
          </template>

          <template v-if="[3].includes(pType)">
            <el-form-item label="메모리 제한 (MB)" prop="pMemoryLimit">
              <el-input
                v-model.lazy="pMemoryLimit"
                @change="onChange('MEMORY_LIMIT')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.MEMORY_LIMIT" />
          </template>

          <template v-if="[3].includes(pType)">
            <el-form-item label="시간 제한 (초)" prop="pTimeLimit">
              <el-input
                v-model.lazy="pTimeLimit"
                @change="onChange('TIME_LIMIT')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.TIME_LIMIT" />
          </template>

          <template v-if="[0, 1, 2, 3].includes(pType)">
            <el-form-item label="배점" prop="pScore">
              <el-input
                type='number'
                v-model.lazy="pScore"
                @change="onChange('SCORE')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.SCORE" />

            <el-form-item label="난이도" prop="pDifficulty">
              <el-rate
                v-model.lazy="pDifficulty"
                :max="maxRate"
                @change="onChange('DIFFICULTY')"
              />
            </el-form-item>
            <i class="el-icon-loading" v-if="loading.DIFFICULTY" />
          </template>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Upload from './Upload';
import keywordEditor from './keywordEditor';


export default {
  components: {
    keywordEditor,
    Upload,
  },
  name: 'ScQuestionEditor',
  data() {
    return {
      supportedLanguageList: [{
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
        value: 'python3',
        label: 'Python3',
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
      languageTest: [],
      maxRate: 10,
      loading: {
        TYPE: false,
        QUESTION: false,
        CHOICE: false,
        ANSWER: false,
        ISORDERINGANSWER: false,
        SCORE: false,
        DIFFICULTY: false,
        LANGUAGE_LIST: false,
        INPUT_DESCRIPTION: false,
        OUTPUT_DESCRIPTION: false,
        SAMPLE_INPUT: false,
        SAMPLE_OUTPUT: false,
        MEMORY_LIMIT: false,
        TIME_LIMIT: false,
      },
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    input() {
      const res = {};
      return res;
    },
    pType: { // * Problem Type
      get() {
        const vm = this;
        // console.log('ptype get', vm.currentEditingScItem, vm.currentEditingScItem.question);
        const q = vm.currentEditingScItem.question;
        return q ? q.type : 0;
      },
      set(pType) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              type: pType,
            },
          },
        });
      },
    },
    pQuestion: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.question : '';
      },
      set(pQuestion) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              question: pQuestion,
            },
          },
        });
      },
    },
    pChoice: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        if (!q.choice) {
          return null;
        }
        return q.choice.join(', ');
      },
      set(pChoice) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              choice: pChoice.split(',')
                .map(value => value.trim())
                .filter(value => value.length !== 0),
            },
          },
        });
      },
    },
    pAnswer: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        if (!q.answer) {
          return null;
        }
        return q.answer.join(', ');
      },
      set(pAnswer) {
        const vm = this;
        let answer;
        if (vm.pType === 0) {
          answer = pAnswer.split(',')
                .map(value => value.trim())
                .filter(value => value.length !== 0);
        } else if ([1, 2].includes(vm.pType)) {
          answer = [];
          answer.push(pAnswer.trim());
        }
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              answer,
            },
          },
        });
      },
    },
    pIsOrderingAnswer: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.isOrderingAnswer : 0;
      },
      set(pIsOrderingAnswer) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              isOrderingAnswer: pIsOrderingAnswer,
            },
          },
        });
      },
    },
    pLanguageList: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.languageList : null;
      },
      set(pLanguageList) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              languageList: pLanguageList,
            },
          },
        });
      },
    },
    pInputDescription: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.inputDescription : null;
      },
      set(pInputDescription) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              inputDescription: pInputDescription,
            },
          },
        });
      },
    },
    pOutputDescription: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.outputDescription : null;
      },
      set(pOutputDescription) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              outputDescription: pOutputDescription,
            },
          },
        });
      },
    },
    pTestCaseList: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.testCaseList : [];
      },
      set(pTestCaseList) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              testCaseList: pTestCaseList,
            },
          },
        });
      },
    },
    pSampleInput: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.sampleInput : null;
      },
      set(pSampleInput) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              sampleInput: pSampleInput,
            },
          },
        });
      },
    },
    pSampleOutput: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.sampleOutput : null;
      },
      set(pSampleOutput) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              sampleOutput: pSampleOutput,
            },
          },
        });
      },
    },
    pMemoryLimit: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.memoryLimit : null;
      },
      set(pMemoryLimit) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              memoryLimit: pMemoryLimit,
            },
          },
        });
      },
    },
    pTimeLimit: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.timeLimit : null;
      },
      set(pTimeLimit) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              timeLimit: pTimeLimit,
            },
          },
        });
      },
    },
    pScore: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.score : 0;
      },
      set(pScore) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              score: pScore,
            },
          },
        });
      },
    },
    pDifficulty: {
      get() {
        const vm = this;
        const q = vm.currentEditingScItem.question;
        return q ? q.difficulty : 0;
      },
      set(pDifficulty) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            question: {
              ...vm.currentEditingScItem.question,
              difficulty: pDifficulty,
            },
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem']),
    ...mapActions('scItem', [
      'putQuestion',
      'putQuestionType',
      'postQuestionTestCase',
    ]),
    async onChange(type) {
      const vm = this;
      // // eslint-disable-next-line
      // console.log('type', type, vm.currentEditingScItem.question.type);
      try {
        vm.loading[type] = true;
        if (type === 'TYPE') {
          await vm.putQuestionType();
        } else {
          await vm.putQuestion();
        }
      } catch (error) {
        vm.$notify({
          title: '저장 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      } finally {
        vm.loading[type] = false;
      }
    },
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'ADD_TEST_CASE': {
          await vm.postQuestionTestCase();
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>
