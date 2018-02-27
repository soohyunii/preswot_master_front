<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="파일 목록">
            TODO: 파일 목록hhhh
          </el-form-item>

          <el-form-item label="문항">
            ({{ qType }}) {{ qQuestion }}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ScQuestionViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    qType() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.type : 0;
    },
    qQuestion() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.question : '';
    },
  },
};

</script>
