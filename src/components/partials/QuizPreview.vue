<template>
  <div class="quiz-item" style="background: #e5e9f2">
    <template v-if="data.type === 0">
      <p>문항 - 객관</p>
      <pre>{{ data.question }}</pre>
      <el-checkbox-group v-model="answer" style="width: 100%;">
        <div v-for="(choice,index) in data.choice" :key="index" class="radio-one">
          <el-checkbox :label="(index + 1).toString()">{{ index + 1 }} . {{ choice }}</el-checkbox>
        </div>
      </el-checkbox-group>
    </template>
    <template v-if="data.type === 1">
      <p>문항 - 단답</p>
      <pre>{{ data.question }}</pre>
      <el-input placeholder="내용을 입력해주세요." v-model="answer[0]"></el-input>
    </template>
    <template v-if="data.type === 2">
      <p>문항 - 서술</p>
      <pre>{{ data.question }}</pre>
      <el-input class="margin-text" placeholder="내용을 입력해주세요." v-model="answer[0]" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </template>
    <template v-if="data.type === 4">
      <p>문항 - SQL</p>
      <pre>{{ data.question }}</pre>
      <el-input placeholder="내용을 입력해주세요." v-model="answer[0]" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </template>
  </div>
</template>

<script>
export default {
  props: ['data', 'answer'],
};
</script>