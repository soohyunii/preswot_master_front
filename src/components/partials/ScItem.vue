<template>
  <div class="wrapper" :class="index === currentEditingLsItemIndex ? selectedClass : ''" @click="onClick('selectLsItem',index)">
    <el-col align="center">
      <!-- TODO: change icons -->
      <div class="image">
        <i :class="getIconsByType(type)" class="main-image" ></i>
        <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick('deleteIcon',index)"></i><br/>
      </div>
      <!-- TODO: change bg color, time variable -->
      <div class="label-time">{{lsActiveTime}}</div>
      <!-- TODO: change bg color, duration variable -->
      <div class="label-duration">{{lsActiveDurationTime}}</div>
    </el-col>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ScItem',
  props: ['type', 'index'],
  data() {
    return {
      selectedClass: 'selected',
    };
  },
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLsItem', 'updateCurrentEditingLsItem']),
    onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'selectLsItem': {
          if (vm.ls.length > index) {
            vm.updateCurrentEditingLsItem({
              currentEditingLsItem: vm.ls[index],
              lectureElementIndex: index,
            });
          } else {
            vm.updateCurrentEditingLsItem({
              currentEditingLsItem: { type: '', key: '' },
              lectureElementIndex: -1,
            });
          }
          break;
        }
        case 'deleteIcon': {
          vm.deleteLsItem({
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
    ...mapState('teacher', ['ls', 'currentEditingLsItemIndex', 'currentEditingLsItem']),
    lsActiveTime: {
      get() {
        const vm = this;
        const time = vm.ls[vm.index].activeTime;
        if (time) {
          return `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}:${time.getSeconds() < 10 ? '0' : ''}${time.getSeconds()}`;
        }
        return '00:00:00';
      },
    },
    lsActiveDurationTime: {
      get() {
        const vm = this;
        const time = vm.ls[vm.index].activeDurationTime;
        if (time && (time.getMinutes() !== 0 || time.getSeconds() !== 0)) {
          return `${time.getMinutes() !== 0 ? `${time.getMinutes()}m` : ''} ${time.getSeconds() !== 0 ? `${time.getSeconds()}s` : ''}`;
        }
        return '0s';
      },
    },
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