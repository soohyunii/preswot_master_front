<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="배점">
            <span class="item-text">{{ mScore }}</span>
          </el-form-item>

          <el-form-item label="파일 목록">
            <span class="item-text">TODO:</span>
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
  name: 'ScMaterialViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    mScore() {
      const vm = this;
      const m = vm.currentEditingScItem.material;
      console.log('m', m);
      return m ? m.score : 0;
    },
  },
};
</script>

