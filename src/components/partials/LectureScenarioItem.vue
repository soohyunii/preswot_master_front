<template>
  <div class="wrapper" :class="index === currentEditingLectureScenarioItemIndex ? selectedClass : ''" @click="onClick('selectLsItem',index)">
    <el-col align="center">
      <!-- TODO: change icons -->
      <div class="image">
        <i :class="getIconsByType(type)" class="main-image" ></i>
        <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick('deleteIcon',index)"></i><br/>
      </div>
      <!-- TODO: change bg color, time variable -->
      <div class="label-time">05:00</div>
      <!-- TODO: change bg color, duration variable -->
      <div class="label-duration">3m</div>
    </el-col>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LectureScenarioItem',
  props: ['type', 'index'],
  data() {
    return {
      selectedClass: 'selected',
    };
  },
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureScenarioItem', 'updateCurrentEditingLectureScenarioItem']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'selectLsItem': {
          vm.updateCurrentEditingLectureScenarioItem({
            currentEditingLectureScenarioItem: vm.lectureScenario[index],
            lectureElementIndex: index,
          });
          break;
        }
        case 'deleteIcon': {
          vm.deleteLectureScenarioItem({
            lectureElementIndex: index,
          });
          break;
        }
        default : {
          throw new Error('not defined type', type);
        }
      }
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
  computed: {
    ...mapState('teacher', ['lectureScenario', 'currentEditingLectureScenarioItemIndex']),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/variables.scss";

.wrapper {
  margin: 8px 0px;
  padding: 5px 0px 5px 0px;

  .selected {
    background-color: #dcdfe6;
  }

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