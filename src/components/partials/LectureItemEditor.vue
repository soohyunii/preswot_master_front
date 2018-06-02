<template>
  <div id="lecture_item_editor_wrapper">
    <h2>
      강의 아이템 추가 TODO: isEditing이면 강의 아이템 수정으로
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
import { mapActions } from 'vuex';
import LcQuestionEditor from './LcQuestionEditor';
import LcSurveyEditor from './LcSurveyEditor';
// import utils from '../../utils';

export default {
  name: 'LectureItemEditor',
  components: {
    LcQuestionEditor,
    LcSurveyEditor,
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
  },
  methods: {
    ...mapActions('lcItem', [
      'postLcItem',
    ]),
    onSubmit() {
      const vm = this;
      console.log('inputHead', vm.inputHead);
      console.log('inputBody', vm.inputBody);
      console.log('inputTail', vm.inputTail);
      vm.postLcItem({
        inputHead: vm.inputHead,
        inputBody: vm.inputBody,
        inputTail: vm.inputTail,
        // lcItemType: utils.convertLcItemType(vm.inputHead.lcItemType),
      });
    },
  },
};
</script>
