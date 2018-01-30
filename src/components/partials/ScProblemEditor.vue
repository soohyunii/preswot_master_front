<template>
  <div>
    <h1>Problem</h1>

    <el-row>
      <el-col :span="18">
        <el-form ref="elForm" label-width="120px">
          <el-form-item label="문항 내용">
          <el-input
          type="textarea"
          :rows="3"
          v-model="descriptionOfProblem"
          >
          <!-- v-model="description" -->
          </el-input>
          </el-form-item>
          <!-- <el-form-item label="파일 업로드">
              <upload :type="{ from: 'ScMaterialEditor', currentEditingScItemIndex }"/>
          </el-form-item> -->
          <el-form-item label="정답 공개 여부">
            <el-radio-group v-model="answerVisibility">
              <el-radio-button label=true>공개</el-radio-button>
              <el-radio-button label=false>비공개</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="정답 유형">
            <el-radio-group v-model="problemType">
              <el-radio-button label="multipleChoice">객관식</el-radio-button>
              <el-radio-button label="shortAnswer">주관식</el-radio-button>
              <el-radio-button label="writeOutAnswer">서술형</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="problemType === 'multipleChoice'">
            <el-form-item label="선지">
              <el-input
                placeholder="Please input"
                v-model="localAnswer"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="boolean">
                <el-radio-button label=true>정답</el-radio-button>
                <el-radio-button label=false>오답</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onClick('ADD_ANSWER')">추가하기</el-button>              
            </el-form-item>
          </template>
          <template v-else-if="problemType === 'shortAnswer'">
            <el-form-item label="정답">
              <el-input
                placeholder="Please input"
                v-model="answer"
                clearable>
              </el-input>
            </el-form-item>
          </template>
          <template v-else-if="problemType === 'writeOutAnswer'">
            <el-form-item label="정답">
              <el-input
                placeholder="Please input"
                type="textarea"
                :rows="8"
                v-model="answer"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-form>
      </el-col>
    </el-row>
    <!-- TODO: delete debug -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import Upload from './Upload';

/**
 * @description 강의자료 에디터
 */
export default {
  name: 'ScProblemEditor',
  data() {
    // TODO: translate
    return {
      boolean: '',
      localAnswer: '',
    };
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'ADD_ANSWER': {
          // TODO: 만약 아직 정답 / 오답 체크를 하지 않았다면 경고창을 띄워야 할까?
          if (vm.boolean !== '') {
            const answer = vm.currentEditingScItem.answer;
            const temp = [vm.localAnswer, vm.boolean];
            answer.push(temp);
            window.console.log(answer);
            vm.updateCurrentEditingScItem({
              currentEditingScItem: {
                ...vm.currentEditingScItem,
                answer,
              },
              lectureElementIndex: vm.currentEditingScItemIndex,
            });
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex']), // TODO: delete 'sc' from list
    descriptionOfProblem: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.descriptionOfProblem || '';
        }
        return '';
      },
      set(descriptionOfProblem) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            descriptionOfProblem,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    answerVisibility: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.answerVisibility || '';
        }
        return '';
      },
      set(answerVisibility) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            answerVisibility,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    problemType: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.problemType || '';
        }
        return '';
      },
      set(problemType) {
        const vm = this;
        let answer = null;
        if (problemType === 'multipleChoice') {
          answer = [];
        }
        vm.localAnswer = '';
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            problemType,
            answer,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    answer: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.answer || '';
        }
        return '';
      },
      set(answer) {
        const vm = this;
        if (vm.currentEditingScItem.problemType !== 'multipleChoice') {
          vm.updateCurrentEditingScItem({
            currentEditingScItem: {
              ...vm.currentEditingScItem,
              answer,
            },
            lectureElementIndex: vm.currentEditingScItemIndex,
          });
        }
      },
    },
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            description,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
  components: {
    Upload,
  },
};
</script>
