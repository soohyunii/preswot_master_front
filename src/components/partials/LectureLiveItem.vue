<template>
  <div class="lecture-live-item-wrapper" style="background: #e5e9f2">
    <div v-if="data === undefined"> <!-- 입력값 없음 -->
      강사님의 신호를 기다리는 중입니다.
    </div>
    <div v-else class="lecture-item">
      <div v-if="data.type === 0" class="question-box"> <!-- 질문 -->
        <div v-if="data.questions[0].type === 0">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>문항 - 객관</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-radio-group v-model="answer2" @change="onChange" style="width: 100%;">
              <div v-for="(choice,index) in data.questions[0].choice" :key="index" class="radio-one">
                <el-radio :label="index">{{ index + 1 }} . {{ choice }}</el-radio>
              </div>
            </el-radio-group>
          </template>
        </div>
        <div v-if="data.questions[0].type === 1">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>문항 - 단답</p>
            <pre>{{ data.questions[0].question }}</pre>
            <!-- <span>답 : </span> -->
            <el-input placeholder="내용을 입력해주세요." v-model="answer"></el-input>
          </template>
        </div>
        <div v-if="data.questions[0].type === 2">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다. 모범 답안은 다음과 같습니다.</p>
            <pre>{{ data.questions[0].answer[0] }}</pre>
          </template>
          <template v-else>
            <p>문항 - 서술</p>
            <pre>{{ data.questions[0].question }}</pre>
            <!-- <span>답 : </span> -->
            <el-input class="margin-text" placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
          </template>
        </div>
        <div v-if="data.questions[0].type === 3">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>문항 - SW</p>
            <pre>{{ data.questions[0].question }}</pre>
            <pre>언어 : {{ data.questions[0].accept_language[0] }}</pre>
            <pre>입력 설명 : {{ data.questions[0].input_description }}</pre>
            <pre>출력 설명 : {{ data.questions[0].output_description }}</pre>
            <pre>샘플 입력 : {{ data.questions[0].sample_input }}</pre>
            <pre>샘플 출력 : {{ data.questions[0].sample_output }}</pre>
            <div v-for="testcase in data.questions[0].problem_testcases" :key="testcase.num">
              <pre>테스트 케이스 {{ testcase.num }} 입력 :  {{ testcase.input }} </pre>
              <pre>테스트 케이스 {{ testcase.num }} 출력 :  {{ testcase.output }} </pre>
            </div>
            <pre>메모리 제한(MB) : {{ data.questions[0].memory_limit }}</pre>
            <pre>시간 제한(초) : {{ data.questions[0].time_limit }}</pre>
            <el-input class="margin-text" placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
          </template>
        </div>
        <div v-if="data.questions[0].type === 4">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>문항 - SQL</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
          </template>
        </div>
        <el-button v-if="data.questions[0].student_answer_logs.length === 0" style="float:right" type="primary" @click="preOnClick('SUBMIT', [data.type, data.questions[0].question_id, [answer], data.questions[0].accept_language[0]])">제출</el-button>
      </div>
      <div v-if="data.type === 1">
        <div v-if="data.surveys[0].type === 0">
          <template v-if="data.surveys[0].student_surveys.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>설문 - 객관</p>
            <pre>{{ data.surveys[0].comment }}</pre>
            <el-radio-group v-model="answer" style="width: 100%;">
              <div v-for="(choice,index) in data.surveys[0].choice" :key="index">
                <el-radio :label="index">{{ index }} . {{ choice }}</el-radio>
              </div>
            </el-radio-group>
          </template>
        </div>
        <div v-if="data.surveys[0].type === 1">
          <template v-if="data.surveys[0].student_surveys.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>설문 - 주관</p>
            <pre>{{ data.surveys[0].comment }}</pre>
            <el-input placeholder="내용을 입력해주세요." v-model="answer"></el-input>
          </template>
        </div>
        <el-button v-if="data.surveys[0].student_surveys.length === 0"  style="float:right" type="primary" @click="preOnClick('SUBMIT', [data.type, data.surveys[0].survey_id, data.surveys[0].type, answer])">제출</el-button>
      </div>
      <div v-if="data.type === 2" class="practice">
        <p>실습</p>
        <h3 style="margin:20px;">강사의 지시에 따라주세요.</h3>
        <pre>{{ data.lecture_code_practices[0].code }}</pre>
      </div>
      <div v-if="data.type === 3" class="discuss">
        <p>토론</p>
        <discussion :lectureItemId="data.lecture_item_id"/>
      </div>
    </div>
  </div>
</template>

<script>
import Discussion from './NNDiscussion';

export default {
  props: ['data', 'onClick'],
  data() {
    return {
      answer: '',
      answer2: '', // 이 값은 사용하지 않습니다. 값하나 물려야 el-radio button이 활성화돼서 사용합니다. 없어도 돌아가게 할 방법을 찾는다면 제거해주세요.
    };
  },
  methods: {
    preOnClick(...args) {
      const vm = this;
      vm.onClick(...args);
      vm.answer = '';
    },
    onChange(data) { // 문항 - 객관값 보정 (0 1 2 3 4를 1 2 3 4 5로) 을 위한 함수
      const vm = this;
      vm.answer = data + 1;
    },
  },
  components: {
    Discussion,
  },
};
</script>

<style lang="scss">
.lecture-live-item-wrapper {
  pre {
    overflow-x: auto; /* Use horizontal scroller if needed; for Firefox 2, not needed in Firefox 3 */
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    /* width: 99%; */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }

  .radio-one {
    /*border:1px solid red;*/
    margin:15px;
  }

  .lecture-item {
    /*border:1px solid green;*/
    margin:30px 0;
  }

  .lecture-item .question-box{
    padding:5px 0 0 0;
  }

  .lecture-item p{  /*sh : 이 경우 <p>제출이 완료되었습니다.</p>도 스타일이 적용되기 때문에 후에 분리시키는 조치가 필요함*/
    margin: 10px 0 0 10px;
    font-size: 1.1em;
  }


  .lecture-item pre{
    /*border:1px solid red;*/
    margin: 20px 0 0 15px;
  }


  /*.lecture-item span{
    <span>답 : </span> 을 아예 없애는건?
  }
  */

  .lecture-item .el-button{
    margin:10px 0;
  }

  .lecture-item .el-input{
    margin:20px 0 0 0;
  }

  .lecture-item .margin-text{ /*문항 - 서술,SW*/
    margin:20px 0 0 0;
  }

  .lecture-item .practice{
    padding:5px 0 20px 0;
  }

  .lecture-item .discuss{
    padding:5px 0 0 0;
    height:530px;
  }
}
</style>
