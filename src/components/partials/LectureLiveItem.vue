<template>
  <div style="background: #e5e9f2">
    <!--
    {{ data }}
    <br/><br/>
    {{ data.questions[0] }}
    <br/><br/>
    {{ data.questions[0].type }}
    <br/><br/>
    {{ data.type }}
    -->
    <div v-if="data === undefined">
      표시할 값이 없습니다.
    </div>
    <div v-else>
      <div v-if="data.type === 0">
        <div v-if="data.questions[0].type === 0">
          <p>문항 - 객관</p>
          <p>{{ data.questions[0].question }}</p>
          <el-radio-group v-model="answer" style="width: 100%;">
            <div v-for="(choice,index) in data.questions[0].choice" :key="index">
              <el-radio :label="index">{{ index + 1 }} . {{ choice }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div v-if="data.questions[0].type === 1">
          <p>문항 - 단답</p>
          <p>{{ data.questions[0].question }}</p>
          <span>답 : </span>
          <el-input placeholder="내용을 입력해주세요." v-model="answer"></el-input>
        </div>
        <div v-if="data.questions[0].type === 2">
          <p>문항 - 서술</p>
          <p>{{ data.questions[0].question }}</p>
          <span>답 : </span>
          <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </div>
        <div v-if="data.questions[0].type === 3">
          <p>문항 - SW</p>
          <p>{{ data.questions[0].question }}</p>
          <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </div>
        <div v-if="data.questions[0].type === 4">
          <p>문항 - SQL</p>
          <p>{{ data.questions[0].question }}</p>
          <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
        </div>
        <el-button style="float:right" type="primary" @click="preOnClick('SUBMIT', [data.type, data.questions[0].question_id, [answer]])">제출</el-button>
      </div>
      <div v-if="data.type === 1">
        <div v-if="data.surveys[0].type === 0">
          <p>설문 - 객관</p>
          <p>{{ data.surveys[0].comment }}</p>
          <el-radio-group v-model="answer" style="width: 100%;">
            <div v-for="(choice,index) in data.surveys[0].choice" :key="index">
              <el-radio :label="index">{{ index }} . {{ choice }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div v-if="data.surveys[0].type === 1">
          <p>설문 - 주관</p>
          <p>{{ data.surveys[0].comment }}</p>
          <el-input placeholder="내용을 입력해주세요." v-model="answer"></el-input>
        </div>
        <el-button style="float:right" type="primary" @click="preOnClick('SUBMIT', [data.type, data.surveys[0].survey_id, data.surveys[0].type, answer])">제출</el-button>
      </div>
      <div v-if="data.type === 2">
        <p>실습</p>
        <h3>강사의 지시에 따라주세요.</h3>
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
