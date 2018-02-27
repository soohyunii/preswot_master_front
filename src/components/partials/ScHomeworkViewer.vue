<template>
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
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>


<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ScHomeworkViewer',
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      return item.fileList;
    },
  },
  methods: {
    onClick(index) {
      const vm = this;
      const file = vm.fileList[index];
      window.location.assign(file.url);
    },
  },
};
</script>

