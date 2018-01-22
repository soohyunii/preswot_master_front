<template>
  <div class="wrapper">
    <el-col align="center">
      <!-- TODO: change icons -->
      <!-- TODO: Translate tooltip -->
      <div class="image">
        <i :class="getIconsByType(type)" class="main-image" ></i>
        <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick(index)"></i><br/>
      </div>
      <!-- TODO: change bg color, time variable -->
      <div class="label-time">05:00</div>
      <!-- TODO: change bg color, duration variable -->
      <div class="label-duration">3m</div>
    </el-col>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LectureScenarioItem',
  props: ['type', 'index'],
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureScenarioItem']),
    onClick(index) {
      const vm = this;
      vm.deleteLectureScenarioItem({
        lectureElementIndex: index,
      });
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

<style lang="scss" scoped>
@import "~@/variables.scss";

.wrapper {
  background-color: rgba(255, 255, 255, 0);

  .image {
    padding-bottom: 10px;
  }

  .main-image {
    padding-left: 16px;
    padding-top: 10px;
    font-size: 40px;
  }

  .el-icon-error {
    cursor: pointer;
    float: right;
  }

  .label-time {
    width: 70px;
    height: 20px;
    color: white;
    background-color: $app-ultra-violet;
    text-align: center;
    font-size: 16px;
    font-weight: 450;
    margin-bottom: 5px;
  }

  .label-duration {
    border: solid 1px $app-ultra-violet;
    width: 68px;
    height: 20px;
    color: $app-ultra-violet;
    background-color: white;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
  }


}
</style>