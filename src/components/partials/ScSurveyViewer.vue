<template>
  <el-row>
    <el-col style="max-width: 600px;">
      <el-form label-width="120px">
        <el-form-item label="파일 목록">
          <span class="item-text">
            TODO: 파일 목록gggg
          </span>
        </el-form-item>

        <el-form-item label="설문 내용">
          <span class="item-text">
            ({{ sType }}) {{ sComment }}
          </span>
        </el-form-item>

         <el-form-item label="설문 입력">
          <span class="item-text">
            TODO: 설문 입력폼 (객관) {{ sChoice }}<br />
            TODO: 설문 입력폼 (주관)<br />

          </span>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ScSurveyViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    sType() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      const numType = s ? s.type : 0;
      return utils.convertScItemType(numType);
    },
    sComment() {
      const vm = this;
      const s = vm.currentEditingScItem.comment;
      return s ? s.comment : '';
    },
    sChoice() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      if (!s.choice) {
        return null;
      }
      return s.choice.join(', ');
    },
  },
};
</script>

