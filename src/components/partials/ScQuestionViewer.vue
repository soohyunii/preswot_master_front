<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="파일 목록">
            <el-button
              type="primary"
              v-for="(item, index) in fileList"
              :key="item.guid"
              @click="onClick(index)"
            >
              {{ item.name }} <i class="el-icon-download el-icon-right"></i>
            </el-button>
          </el-form-item>

          <el-form-item label="문항">
            ({{ qType }}) {{ qQuestion }}
          </el-form-item>

          <template v-if="[0].includes(qType)">
            <el-form-item label="보기">
              TODO: 보기 v-for<br />
              {{ qChoice }}
            </el-form-item>
          </template>
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
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      return item.fileList;
    },
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
    qChoice() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.choice : [];
    },
  },
};

</script>
