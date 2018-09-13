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
    <!--
    <p> inputHead : {{ inputHead }} </p>
    <p> inputBody : {{ inputBody }} </p>
    <p> inputTail : {{ inputTail }} </p>
    -->
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

      <el-form-item v-show="['question', 'survey'].includes(inputHead.lcItemType)" label="결과 공개 여부" prop="lcItemResult">
        <el-switch v-model="resultVisible" @change="onChange"/>
        <el-popover
          style="position: relative; left: 30px; top: 3px;"
          placement="top-start"
          width="500"
          trigger="hover"
          content="학생이 답안을 제출했을 때, 그 결과를 바로 볼 수 있게 할지의 여부를 정합니다.">
          <i class="el-icon-question fa-lg" slot="reference"></i>
        </el-popover>
      </el-form-item>

      <el-form-item label="활성화 시각" v-if="lecture.type !== 0">
        <el-time-picker
          v-model="inputHead.lcItemOffset"
          placeholder="활성화 시각">
        </el-time-picker>
        <el-popover
          style="position: relative; left: 30px; top: 3px;"
          placement="top-start"
          width="500"
          trigger="hover"
          content="강의 시작 시간을 기준으로 강의 아이템이 활성화되는 시각을 정합니다.">
          <i class="el-icon-question fa-lg" slot="reference"></i>
        </el-popover>
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
      <!-- TODO : '토론' 에도 키워드를 붙일때 조건 변경 -->
      <template v-if="inputHead.lcItemType !== null && inputHead.lcItemType !== 'discussion'">
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
          <div v-for="(item,index) in inputTail.assignedKeywordList" :key="item.keyword" style="display: inline-block;">
            <el-button>{{ item.keyword }} :: {{ item.score }}점</el-button>
            <el-button @click="onClick('DELETE_KEYWORD',index)" type="danger" style="margin: 0px 10px 0px 0px">X</el-button>
          </div>
        </el-form-item>
      </template>
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
  props: ['numOfLectureItem'],
  async mounted() {
    const vm = this;

    if (!vm.isNewItem) {
      await vm.getLcItem();
      const item = vm.lectureItem;

      vm.inputHead.lcItemOrder = item.order;
      vm.inputHead.lcItemType = utils.convertLcItemType(item.type);
      vm.inputHead.lcItemName = item.name;
      vm.inputHead.lcItemResult = item.result;
      vm.resultVisible = !!item.result;

      const offset = new Date(2018, 8, 15, 0, 0, 0);
      offset.setSeconds(item.offset);
      vm.inputHead.lcItemOffset = offset;

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
    const vm = this;
    const initialInputHead = {
      lcItemOrder: 1,
      lcItemName: null,
      lcItemType: null,
      lcItemSequence: vm.numOfLectureItem + 1,
      lcItemResult: false,
      lcItemOffset: new Date(2018, 8, 15, 0, 0, 0),
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
      resultVisible: false,
    };
  },
  computed: {
    ...mapState('lc', [
      'lecture',
    ]),
    ...mapState('lcItem', [
      'lectureItem',
    ]),
    ...mapGetters('lcItem', [
      'isNewItem',
    ]),
    ...mapState('keyword', [
      'keywordList',
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
    modifiedKeywordList() {
      const vm = this;
      return vm.keywordList.map(x => ({ value: x.keyword }));
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
    onClick(type, arg) {
      const vm = this;

      switch (type) {
        case 'ADD_KEYWORD': {
          let isEnroll = false;
          vm.keywordList.forEach((element) => {
            if (element.keyword === vm.inputTail.keywordName) {
              isEnroll = true;
            }
          });
          if (isEnroll === false) {
            vm.$notify({
              title: '알림',
              message: '키워드 등록 탭에 등록되지 않은 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            vm.inputTail.keywordName = null;
            vm.inputTail.keywordPoint = null;
            break;
          }
          if (vm.inputTail.assignedKeywordList.map(x => x.keyword).indexOf(vm.inputTail.keywordName) !== -1) { // eslint-disable-line
            vm.$notify({
              title: '알림',
              message: '이미 등록한 키워드는 등록할 수 없습니다.',
              type: 'warning',
            });
            vm.inputTail.keywordName = null;
            vm.inputTail.keywordPoint = null;
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
    async onSubmit() {
      const vm = this;
      // 자료,문항,실습은 키워드가 없다면 알람을 띄우고 막음
      if (vm.inputHead.lcItemType === 'question' ||
          vm.inputHead.lcItemType === 'note' ||
          vm.inputHead.lcItemType === 'practice') {
        if (vm.inputTail.assignedKeywordList === undefined ||
          vm.inputTail.assignedKeywordList.length === 0) {
          vm.$notify({
            title: '생성 실패',
            message: '자료, 문항, 실습 아이템은 최소한 1쌍의 키워드를 반드시 필요로 합니다.',
            type: 'error',
            duration: 5000,
          });
          return;
        }
      }
      if (vm.lecture.type === 0) {
        vm.inputHead.lcItemOffset = null;
      }

      if (vm.isNewItem) {
        try {
          await vm.postLcItem({
            inputHead: vm.inputHead,
            inputBody: vm.inputBody,
            inputTail: vm.inputTail,
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
      } else {
        try {
          await vm.putLcItem({
            inputHead: vm.inputHead,
            inputBody: vm.inputBody,
            inputTail: vm.inputTail,
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
    onChange() {
      const vm = this;
      if (!vm.resultVisible) {
        vm.inputHead.lcItemResult = 0;
      } else {
        vm.inputHead.lcItemResult = 1;
      }
    },
  },
};
</script>
