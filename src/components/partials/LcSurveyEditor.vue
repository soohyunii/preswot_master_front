<template>
  <div id="lc_survey_editor_wrapper">
    <el-form-item label="문항 유형">
      <el-radio-group v-model="inputBody.surveyType">
        <el-radio-button label="MULTIPLE_CHOICE">객관</el-radio-button>
        <el-radio-button label="DESCRIPTION">서술</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="설문 질문">
      <el-input v-model="inputTail.comment" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </el-form-item>
    <template v-if="inputBody.surveyType === 'MULTIPLE_CHOICE'">
      <el-form-item label="항목">
        <div v-for="(survey, index) in inputTail.surveyItemList" :key="index">
          <span>{{ index+1 }}</span>
            <div style="display: inline-block; width: 85%;">
              <el-input v-model="survey.value" placeholder="내용을 입력해주세요."></el-input>
            </div>
          <el-button type="danger" @click="onClick('DELETE_SURVEY_ITEM',index)">X</el-button>
        </div>
        <el-button @click="onClick('ADD_SURVEY_ITEM')" style="width: 100%;">항목 추가</el-button>
      </el-form-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'LcSurveyEditor',
  data() {
    const initialInputBody = {
      surveyType: null,
    };
    const initialInputTail = {
      surveyItemList: [],
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
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
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_SURVEY_ITEM': {
          vm.inputTail.surveyItemList.push({
            value: '',
          });
          break;
        }
        case 'DELETE_SURVEY_ITEM': {
          vm.inputTail.surveyItemList.splice(arg, 1);
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