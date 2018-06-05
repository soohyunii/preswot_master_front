<template>
  <div id="lecture_item_editor_wrapper">
    isNewItem: {{ isNewItem }} <br />
    <h2>
      <template v-show="isNewItem">
        강의 아이템 추가
      </template><template v-show="!isNewItem">
        강의 아이템 수정
      </template>
    </h2>

    inputHead: {{ inputHead }}<br /><br />
    inputBody: {{ inputBody }}<br /><br />
    inputTail: {{ inputTail }}<br /><br />

    <el-form :model="inputHead" label-width="125px" style="max-width: 800px;">
      <el-form-item label="타입" prop="type" id="radio_type">
        <el-radio-group v-model.number="inputHead.type">
          <el-radio-button :label="0">예습</el-radio-button>
          <el-radio-button :label="1">본강</el-radio-button>
          <el-radio-button :label="2">복습</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="아이템 유형" prop="lcItemType" id="lc_item_type">
        <el-radio-group v-model="inputHead.lcItemType">
          <el-radio-button label="question">문항</el-radio-button>
          <el-radio-button label="survey">설문</el-radio-button>
          <el-radio-button label="practice">실습</el-radio-button>
          <el-radio-button label="discussion">토론</el-radio-button>
        </el-radio-group>
        <!-- <el-select v-model="inputHead.lcItemType">
          <el-option
            v-for="option in selectOptionList"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="아이템 이름" prop="lcItemName" id="lc_item_name">
        <el-input v-model="inputHead.lcItemName" placeholder="내용을 입력해주세요."></el-input>
      </el-form-item>

      <div v-show="!inputHead.lcItemType">
        <el-alert
          title="아이템 유형을 선택해주세요"
          :closable="false"
          type="warning"
          show-icon center>
        </el-alert>
      </div>

      <!-- v-if를 쓰면 ref가 안 먹음 -->
      <lc-question-editor
        ref="questionEditor"
        v-show="inputHead.lcItemType === 'question'"
      />

      <!-- v-if를 쓰면 ref가 안 먹음 -->
      <lc-survey-editor
        ref="surveyEditor"
        v-show="inputHead.lcItemType === 'survey'"
      />

      <!--

      <template v-if="inputHead.lcItemType === 'practice'">
        <el-form-item label="코드">
          <el-input v-model="inputTail.code" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
      </template>

      <template v-if="inputHead.lcItemType === 'discussion'">
        <el-form-item label="토론 주제">
          <el-input v-model="inputTail.code" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </el-form-item>
      </template> -->
    </el-form>
    <div class="ps-align-right" id="lecture_item_editor_submit_button_wrapper">
      <el-button type="primary" @click="onSubmit">추가 / 수정</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';
import LcQuestionEditor from './LcQuestionEditor';
import LcSurveyEditor from './LcSurveyEditor';
import utils from '../../utils';

export default {
  name: 'LectureItemEditor',
  components: {
    LcQuestionEditor,
    LcSurveyEditor,
  },
  async mounted() {
    const vm = this;
    if (!vm.isNewItem) {
      await vm.getLcItem();
      const item = vm.lectureItem;
      console.log('getLcItem res', item); // eslint-disable-line no-console

      vm.inputHead.type = item.order;
      vm.inputHead.lcItemType = utils.convertLcItemType(item.type);
      vm.inputHead.lcItemName = item.name;

      // * Init inputBody, tail
      switch (vm.inputHead.lcItemType) {
        case 'question': {
          const q = item.questions[0];
          vm.inputTail.question = q.question;
          vm.inputTail.difficulty = q.difficulty;
          // TODO: keyword init
          switch (q.type) {
            case 1: { // 단답
              vm.inputBody.questionType = 'SHORT_ANSWER';
              vm.inputTail.answer = q.answer[0];
              break;
            }
            default: {
              throw new Error(`not defined question type ${q.type}`);
            }
          }
          break;
        }
        default: {
          throw new Error(`not defined lcItemType ${vm.inputHead.lcItemType}`);
        }
      }
    }
  },
  data() {
    const initialInputHead = {
      type: null,
      lcItemName: null,
      lcItemType: null,
    };
    return {
      initialInputHead,
      inputHead: Object.assign({}, initialInputHead),
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
      flag: false,
    };
  },
  computed: {
    ...mapState('lcItem', [
      'lectureItem',
    ]),
    ...mapGetters('lcItem', [
      'isNewItem',
    ]),
    inputBody() {
      const vm = this;
      const lcItemType = vm.inputHead.lcItemType;
      if (!lcItemType) {
        return null;
      }
      return vm.$refs[`${lcItemType}Editor`].inputBody;
    },
    inputTail() {
      const vm = this;
      const lcItemType = vm.inputHead.lcItemType;
      if (!lcItemType) {
        return null;
      }
      return vm.$refs[`${lcItemType}Editor`].inputTail;
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
  },
  methods: {
    ...mapActions('lc', [
      'getLecture',
    ]),
    ...mapMutations('lcItem', [
      'updateCurrentEditingLectureItemId',
      'updateLectureItem',
    ]),
    ...mapActions('lcItem', [
      'getLcItem',
      'postLcItem',
    ]),
    reset() {
      const vm = this;
      vm.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: null,
      });
      vm.updateLectureItem({
        lectureItem: null,
      });
      const lcItemType = vm.inputHead.lcItemType;
      vm.$refs[`${lcItemType}Editor`].reset();
      vm.inputHead = Object.assign({}, vm.initialInputHead);
    },
    async onSubmit() {
      const vm = this;
      try {
        await vm.postLcItem({
          inputHead: vm.inputHead,
          inputBody: vm.inputBody,
          inputTail: vm.inputTail,
        });
        vm.$notify({
          title: '강의 아이템 생성 성공',
          message: `${vm.inputHead.lcItemName} 생성됨`,
          type: 'success',
          duration: 3000,
        });

        vm.reset();

        await vm.getLecture({ lectureId: vm.lectureId }); // lecture item list 업데이트
      } catch (error) {
        vm.$notify({
          title: '생성 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      }
    },
  },
};
</script>
