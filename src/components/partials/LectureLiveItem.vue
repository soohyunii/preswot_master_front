<template>
  <div style="background: #e5e9f2">
    <div v-if="data === undefined"> <!-- 입력값 없음 -->
      강사님의 신호를 기다리는 중입니다.
    </div>
    <div v-else>
      <div v-if="data.type === 0"> <!-- 질문 -->
        <div v-if="data.questions[0].type === 0">
          <template v-if="data.questions[0].student_answer_logs.length > 0"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>문항 - 객관</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-radio-group v-model="answer" style="width: 100%;">
              <div v-for="(choice,index) in data.questions[0].choice" :key="index">
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
            <span>답 : </span>
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
            <span>답 : </span>
            <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
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
            <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
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
      <div v-if="data.type === 2">
        <p>실습</p>
        <h3>강사의 지시에 따라주세요.</h3>
        <pre>{{ data.lecture_code_practices[0].code }}</pre>
      </div>
      <div v-if="data.type === 3">
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
    };
  },
  methods: {
    preOnClick(...args) {
      const vm = this;
      vm.onClick(...args);
      vm.answer = '';
    },
  },
  components: {
    Discussion,
  },
};
</script>

<style>

</style>
