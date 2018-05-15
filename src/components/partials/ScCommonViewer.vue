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

          <el-form-item label="남은 시간">
            <span class="item-text">{{ remainingSec }}</span>
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
import { mapGetters, mapState } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ScCommonViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    ...mapState('sc', ['afterStartDateOffsetSec']),
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
    remainingSec() {
      const vm = this;
      if (!vm.currentEditingScItem.activeEndOffsetSec) {
        return '-';
      }
      const remain = vm.currentEditingScItem.activeEndOffsetSec - vm.afterStartDateOffsetSec;
      return utils.formatSec2Time(remain, 'hh시간 mm분 ss초');
    },
  },
};
</script>
