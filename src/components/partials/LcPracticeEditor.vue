<template>
  <div id="lc_practice_editor_wrapper">
    <el-form-item label="코드">
      <el-input v-model="inputTail.code" placeholder="내용을 입력해주세요." type="textarea" :rows="10"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'LcPracticeEditor',
  data() {
    const initialInputBody = {};
    const initialInputTail = {
      code: null,
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
