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
      <el-button style="float:right" type="primary" @click="onClick('SUBMIT', [data.type, data.questions[0].type, answer])">제출</el-button>
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
      <el-button style="float:right" type="primary" @click="onClick('SUBMIT', [data.type, data.surveys[0].type, answer])">제출</el-button>
    </div>
    <div v-if="data.type === 2">
      <p>실습</p>
      <el-input placeholder="내용을 입력해주세요." v-model="answer" type="textarea" :autosize="{ minRows: 15, maxRows: 20 }"></el-input>
      <el-button style="float:right" type="primary" @click="onClick('SUBMIT', [data.type, answer])">제출</el-button>
    </div>
    <div v-if="data.type === 3">
      <p>토론</p>
      <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 15 }" :disabled="true"></el-input>
      <el-input placeholder="내용을 입력해주세요." v-model="input"></el-input>
      <el-button style="float:right" type="primary" @click="sendMsg([data.type, input])">제출</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'onClick'],
  data() {
    return {
      answer: '',
      input: '',
    };
  },
  methods: {
    sendMsg(args) {
      const vm = this;
      vm.onClick('SUBMIT', args);
      vm.input = '';
    },
  },
};
</script>

<style>

</style>
