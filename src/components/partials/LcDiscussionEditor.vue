<template>
  <div id="lc_discussion_editor_wrapper">
    <el-form-item label="토론 주제">
      <el-input v-model="inputTail.content" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'LcDiscussionEditor',
  data() {
    const initialInputBody = {
    };
    const initialInputTail = {
    };
    return {
      initialInputBody,
      initialInputTail,
      inputBody: Object.assign({}, initialInputBody),
      inputTail: Object.assign({}, initialInputTail),
    };
  },
  methods: {
    reset() {
      const vm = this;
      vm.inputBody = Object.assign({}, vm.initialInputBody);
      vm.inputTail = Object.assign({}, vm.initialInputTail);
    },
  },
};
</script>