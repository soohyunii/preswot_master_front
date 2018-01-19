<template>
    <el-col :span="3" align="center">
      <!-- TODO: change icons -->
      <!-- TODO: Translate tooltip -->
      <i :class="getIconsByType(props.item.type)" style="font-size: 50px;"></i>
      <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick(props.index)"></i><br/>
      <!-- TODO: change bg color, time variable -->
      <el-tag color="#DCDFE6">time</el-tag><br/>

      <!-- TODO: change bg color, duration variable -->
      <el-tag color="#F2F6FC">duration</el-tag><br/>
    </el-col>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LectureScenarioItem',
  props: ['props'],
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureElement']),
    onClick(index) {
      const vm = this;
      vm.deleteLectureElement({
        lectureElementIndex: index,
      });
      // window.console.log(index);
    },
    getIconsByType(type) {
      let icon;
      switch (type) {
        case 'A': {
          icon = 'el-icon-question';
          break;
        }
        case 'B': {
          icon = 'el-icon-info';
          break;
        }
        case 'C': {
          icon = 'el-icon-document';
          break;
        }
        case 'D':
        default: {
          icon = 'el-icon-setting';
          break;
        }
      }
      return icon;
    },
  },
};
</script>

<style>
  .el-icon-error {
    cursor: pointer;
  }
</style>