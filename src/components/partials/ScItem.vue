<template>
  <div class="wrapper" :class="index === currentEditingScItemIndex ? selectedClass : ''" @click="onClick('SELECT_SC_ITEM',index)">
    <el-col align="center">
      <!-- TODO: change icons -->
      <div class="image">
        <i :class="getIconsByType(type)" class="main-image" ></i>
        <i class="el-icon-error" style="color:red; vertical-align:top" @click.stop="onClick('deleteIcon',index)"></i><br/>
      </div>
      <div class="label-time">{{ scActiveTime }}</div>
      <div class="label-duration">{{ scActiveDurationTime }}</div>
    </el-col>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ScItem',
  props: ['type', 'index'],
  data() {
    return {
      selectedClass: 'selected',
    };
  },
  methods: {
    ...mapMutations('teacher', [
      'removeScItem',
      'assignCurrentEditingScItem',
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('teacher', ['deleteScItem', 'getScItem']),
    async onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'SELECT_SC_ITEM': {
          if (vm.sc.length > index) {
            vm.updateCurrentEditingScItemIndex({
              currentEditingScItemIndex: index,
            });
            vm.getScItem({
              scItemId: vm.currentEditingScItem.id,
            });
          } else {
            vm.updateCurrentEditingScItemIndex({
              currentEditingScItemIndex: -1,
            });
          }
          break;
        }
        case 'deleteIcon': {
          vm.$confirm('정말로 이 시나리오 아이템을 삭제하시겠습니까?', `${vm.currentEditingScItem || ''} 삭제`, {
            confirmButtonText: '예, 삭제합니다.',
            cancelButtonText: '아니요, 삭제하지 않습니다.',
            type: 'warning',
          })
            .then(async () => {
              try {
                await vm.deleteScItem({
                  scItemIndex: index,
                });
                vm.removeScItem({
                  lectureElementIndex: index,
                });
                vm.$notify({
                  title: '삭제됨',
                  message: '시나리오 아이템이 삭제됨',
                  type: 'success',
                  duration: 3000,
                });
              } catch (error) {
                vm.$notify({
                  title: '시나리오 아이템 삭제 실패',
                  message: error.toString(),
                  type: 'error',
                  duration: 3000,
                });
              }
            })
            .catch(() => {
              vm.$notify({
                title: '취소됨',
                message: '시나리오 아이템 삭제 취소됨',
                type: 'info',
                duration: 3000,
              });
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
        case '문항': {
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
        case '설문': {
          icon = 'el-icon-edit-outline';
          break;
        }
      }
      return icon;
    },
  },
  computed: {
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex']),
    ...mapGetters('teacher', ['currentEditingScItem']),
    scActiveTime: {
      get() {
        const vm = this;
        const time = vm.sc[vm.index].activeTime;
        if (time) {
          return `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}:${time.getSeconds() < 10 ? '0' : ''}${time.getSeconds()}`;
        }
        return '00:00:00';
      },
    },
    scActiveDurationTime: {
      get() {
        const vm = this;
        const time = vm.sc[vm.index].activeDurationTime;
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