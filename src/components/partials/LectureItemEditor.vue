<template>
  <div id="lecture_item_editor_wrapper">
    <h2>
      <div v-show="isNewItem">
        강의 아이템 추가
      </div>
      <div v-show="!isNewItem">
        강의 아이템 수정
      </div>
    </h2>

    <el-form :model="inputHead" label-width="125px" style="max-width: 800px;">
      <el-form-item label="타입" prop="order" id="lc_item_order">
        <el-radio-group v-model.number="inputHead.lcItemOrder">
          <el-radio-button :label="0">예습</el-radio-button>
          <el-radio-button :label="1">본강</el-radio-button>
          <el-radio-button :label="2">복습</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="아이템 유형" prop="lcItemType" id="lc_item_type">
        <el-radio-group v-model="inputHead.lcItemType" :disabled="!isNewItem">
          <el-radio-button label="note">자료</el-radio-button>
          <el-radio-button label="question">문항</el-radio-button>
          <el-radio-button label="survey">설문</el-radio-button>
          <el-radio-button label="practice">실습</el-radio-button>
          <el-radio-button label="discussion">토론</el-radio-button>
        </el-radio-group>

        <span v-show="!isNewItem">
          &nbsp; * 아이템 유형은 수정 불가
        </span>
      </el-form-item>

      <el-form-item label="아이템 이름" prop="lcItemName" id="lc_item_name">
        <div style="display: inline-block; width: 400px">
          <el-input v-model="inputHead.lcItemName" placeholder="내용을 입력해주세요."></el-input>
        </div>
      </el-form-item>

      <div v-show="!inputHead.lcItemType">
        <el-alert
          title="아이템 유형을 선택해주세요"
          :closable="false"
          type="warning"
          show-icon center>
        </el-alert>
        <br>
      </div>

      <!-- v-if를 쓰면 ref가 안 먹음 -->
      <lc-question-editor
        ref="questionEditor"
        v-show="inputHead.lcItemType === 'question'"
      />
      <lc-survey-editor
        ref="surveyEditor"
        v-show="inputHead.lcItemType === 'survey'"
      />
      <lc-practice-editor
        ref="practiceEditor"
        v-show="inputHead.lcItemType === 'practice'"
      />
      <lc-discussion-editor
        ref="discussionEditor"
        v-show="inputHead.lcItemType === 'discussion'"
      />
      <lc-note-editor
        ref="noteEditor"
        v-show="inputHead.lcItemType === 'note'"
      />

    </el-form>

    <div class="ps-align-right" id="lecture_item_editor_submit_button_wrapper">
      <el-button type="primary" v-show="isNewItem" @click="onSubmit">추가</el-button>
      <el-button type="primary" v-show="!isNewItem" @click="onSubmit">수정</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';

import LcQuestionEditor from './LcQuestionEditor';
import LcSurveyEditor from './LcSurveyEditor';
import LcDiscussionEditor from './LcDiscussionEditor';
import LcPracticeEditor from './LcPracticeEditor';
import LcNoteEditor from './LcNoteEditor';

import QuestionHandler from '../../handlers/lcItem/question';
import PracticeHandler from '../../handlers/lcItem/practice';
import DiscussionHandler from '../../handlers/lcItem/discussion';
import SurveyHandler from '../../handlers/lcItem/survey';
import NoteHandler from '../../handlers/lcItem/note';
import utils from '../../utils';

export default {
  name: 'LectureItemEditor',
  components: {
    LcQuestionEditor,
    LcSurveyEditor,
    LcDiscussionEditor,
    LcPracticeEditor,
    LcNoteEditor,
  },
  async mounted() {
    const vm = this;
    if (!vm.isNewItem) {
      await vm.getLcItem();
      const item = vm.lectureItem;

      vm.inputHead.lcItemOrder = item.order;
      vm.inputHead.lcItemType = utils.convertLcItemType(item.type);
      vm.inputHead.lcItemName = item.name;

      // * Init inputBody, tail
      switch (vm.inputHead.lcItemType) {
        case 'question': {
          QuestionHandler.initViewModel(vm);
          break;
        }
        case 'practice': {
          PracticeHandler.initViewModel(vm);
          break;
        }
        case 'survey': {
          SurveyHandler.initViewModel(vm);
          break;
        }
        case 'discussion': {
          DiscussionHandler.initViewModel(vm);
          break;
        }
        case 'note': {
          NoteHandler.initViewModel(vm);
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
      lcItemOrder: null,
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
      }, {
        value: 'note',
        label: '자료',
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
      'putLcItem',
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

      if (vm.isNewItem) {
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

          await vm.getLecture({ lectureId: vm.lectureId }); // lecture item list 업데이트item list 업데이트
        } catch (error) {
          vm.$notify({
            title: '생성 실패',
            message: error.toString(),
            type: 'error',
            duration: 0,
          });
        }
      } else {
        try {
          await vm.putLcItem({
            inputHead: vm.inputHead,
            inputBody: vm.inputBody,
            inputTail: vm.inputTail,
          });

          vm.$notify({
            title: '강의 아이템 수정 성공',
            message: `${vm.inputHead.lcItemName} 수정됨`,
            type: 'success',
            duration: 3000,
          });

          vm.reset();

          await vm.getLecture({ lectureId: vm.lectureId }); // lecture item list 업데이트
        } catch (error) {
          vm.$notify({
            title: '수정 실패',
            message: error.toString(),
            type: 'error',
            duration: 0,
          });
          console.error(error); // eslint-disable-line
        }
      }
    },
  },
};
</script>
