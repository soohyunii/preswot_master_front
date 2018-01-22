<template>
  <div>
    <el-col align="center">
      <!-- TODO: change icons -->
      <!-- TODO: Translate tooltip -->
      <i :class="getIconsByType(props.type)" style="font-size: 50px;"></i>
      <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick(props.index)"></i><br/>
      <!-- TODO: change bg color, time variable -->
      <el-tag color="#DCDFE6">time</el-tag><br/>

      <!-- TODO: change bg color, duration variable -->
      <el-tag color="#F2F6FC">duration</el-tag><br/>
    </el-col>
  </div>
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
        case '문제지': {
          icon = 'el-icon-question';
          break;
        }
        default:
        case '강의자료': {
          icon = 'el-icon-info';
          break;
        }
        case '숙제': {
          icon = 'el-icon-document';
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