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

      <!-- <template v-if="inputHead.lcItemType === 'survey'">
        <el-form-item label="문항 유형">
          <el-radiov-model="inputBody.questionType">
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
// import utils from '../../utils';

export default {
  name: 'LectureItemEditor',
  components: {
    LcQuestionEditor,
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
      vm.postLcItem({
        inputHead: vm.inputHead,
        inputBody: vm.inputBody,
        inputTail: vm.inputTail,
      });
    },
  },
};
</script>
