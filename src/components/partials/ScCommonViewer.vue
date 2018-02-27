<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px">
        <el-form label-width="120px">
          <el-form-item label="아이템 제목">
            <span class="item-text">{{ scItemTitle }}</span>
          </el-form-item>

          <el-form-item label="아이템 설명">
            <span class="item-text">{{ scItemDescription }}</span>
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
  name: 'ScCommonViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    scItemTitle() {
      const vm = this;
      const item = vm.currentEditingScItem;
      if (!item) {
        return '';
      }
      return item.title;
    },
    scItemDescription() {
      const vm = this;
      const item = vm.currentEditingScItem;
      if (!item) {
        return '';
      }
      return item.description;
    },
  },
};
</script>
