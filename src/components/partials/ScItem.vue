<template>
  <div class="sc-item-wrapper">
    <div
      @click.stop="onClick('SELECT_SC_ITEM', index)"
    >
      <el-col align="center" :class="itemClass">
        <!-- TODO: change icons -->
        <div class="image">
          <i :class="getIconsByType(type)" class="main-image"></i>
          <i
            v-if="!isStudent"
            class="el-icon-error"
            style="color: red; vertical-align: top;"
            @click.stop="onClick('deleteIcon', index)"
          ></i>
          <br/>
        </div>
        <div class="label-time">{{ scActiveTime }}</div>
        <div class="label-duration">{{ scOrder }}</div>
      </el-col>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import isNil from 'lodash.isnil';

export default {
  name: 'ScItem',
  props: ['type', 'index'],
  mounted() {
    const vm = this;
    vm.isStudent = vm.$route.path.includes('/student/lecture/');
  },
  data() {
    return {
      isStudent: true,
    };
  },
  methods: {
    ...mapMutations('scItem', [
      'removeScItem',
      'assignCurrentEditingScItem',
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('scItem', ['deleteScItem', 'getScItem', 'getItemKeywords']),
    async onClick(type, filteredIndex) {
      const vm = this;
      let index;
      if (isNil(vm.scOrderFilter)) {
        index = filteredIndex;
      } else {
        const clickedScItem = vm.sc.filter(item => item.order === vm.scOrderFilter)[filteredIndex];
        index = vm.sc.findIndex(item => item.id === clickedScItem.id);
      }
      switch (type) {
        case 'SELECT_SC_ITEM': {
          if (vm.isStudent && !vm.isActiveItem()) {
            vm.$notify({
              title: '비활성화된 아이템',
              message: '아이템이 아직 활성화되지 않음',
              type: 'warning',
              duration: 1000,
            });
            return;
          }
          if (vm.sc.length > index) {
            if (vm.currentEzditingScItem) {
              const params = {
                lecture_item_id: vm.currentEditingScItem.id,
              };
              vm.$socket.emit('LEAVE_DISCUSSION', JSON.stringify(params));
            }
            vm.updateCurrentEditingScItemIndex({
              currentEditingScItemIndex: index,
            });

            const params = {
              lecture_item_id: vm.currentEditingScItem.id,
            };
            vm.$socket.emit('JOIN_DISCUSSION', JSON.stringify(params));

            await vm.getScItem({
              scItemId: vm.currentEditingScItem.id,
            });
            if (['문항', '강의자료'].includes(vm.type)) {
              await vm.getItemKeywords();
            }
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
          icon = 'fas fa-list-ol';
          break;
        }
        default:
        case '강의자료': {
          icon = 'far fa-file-pdf';
          break;
        }
        case '숙제': {
          icon = 'fas fa-tasks';
          break;
        }
        case '설문': {
          icon = 'far fa-clipboard';
          break;
        }
        case '실습': {
          icon = 'far fa-file-code';
          break;
        }
        case '토론': {
          icon = 'far fa-comments';
          break;
        }
      }
      return icon;
    },
    isActiveItem() {
      const vm = this;
      let index;
      if (isNil(vm.scOrderFilter)) {
        index = vm.index;
      } else {
        const clickedScItem = vm.sc.filter(item => item.order === vm.scOrderFilter)[vm.index];
        index = vm.sc.findIndex(item => item.id === clickedScItem.id);
      }

      if (vm.$route.name === 'TeacherLectureNew') {
        return true;
      }
      if (vm.sc[index].opened === 1) {
        return true;
      }
      if (vm.sc[index].opened === -1) {
        return false;
      }
      if (!vm.afterStartDateOffsetSec) {
        return false;
      }
      const startTime = vm.sc[index].activeStartOffsetSec;
      const endTime = vm.sc[index].activeEndOffsetSec;
      if (!startTime) {
        return false;
      }
      const isAfterStartTime = startTime <= vm.afterStartDateOffsetSec;
      const isBeforeEndTime = endTime ? vm.afterStartDateOffsetSec <= endTime : true;
      if (isAfterStartTime && isBeforeEndTime) {
        return true; // 이 부분이 항상 참으로 동작, 활성화 시간 설정여부 때문.
      }
      return false;
    },
  },
  computed: {
    ...mapState('scItem', ['sc', 'currentEditingScItemIndex']),
    ...mapGetters('scItem', ['currentEditingScItem']),
    ...mapState('sc', [
      'afterStartDateOffsetSec',
      'scOrderFilter',
    ]),
    itemClass() {
      const vm = this;
      let index;
      if (isNil(vm.scOrderFilter)) {
        index = vm.index;
      } else {
        const clickedScItem = vm.sc.filter(item => item.order === vm.scOrderFilter)[vm.index];
        index = vm.sc.findIndex(item => item.id === clickedScItem.id);
      }
      const selected = index === vm.currentEditingScItemIndex;
      return {
        selected,
        nonActive: !vm.isActiveItem(),
      };
    },
    scActiveTime: {
      get() {
        const vm = this;
        let index;
        if (isNil(vm.scOrderFilter)) {
          index = vm.index;
        } else {
          const clickedScItem = vm.sc.filter(item => item.order === vm.scOrderFilter)[vm.index];
          index = vm.sc.findIndex(item => item.id === clickedScItem.id);
        }
        const time = vm.sc[index].activeStartOffsetSec;
        if (time) {
          let hours = Math.floor(time / 3600);
          let minutes = Math.floor((time - (hours * 3600)) / 60);
          let seconds = time - (hours * 3600) - (minutes * 60);
          if (hours < 10) { hours = `0${hours}`; }
          if (minutes < 10) { minutes = `0${minutes}`; }
          if (seconds < 10) { seconds = `0${seconds}`; }
          return `${hours}:${minutes}:${seconds}`;
        }
        return '00:00:00';
      },
    },
    scOrder() {
      const vm = this;
      let index;
      if (isNil(vm.scOrderFilter)) {
        index = vm.index;
      } else {
        const clickedScItem = vm.sc.filter(item => item.order === vm.scOrderFilter)[vm.index];
        index = vm.sc.findIndex(item => item.id === clickedScItem.id);
      }
      const order = vm.sc[index].order;
      let scOrder = '';
      switch (order) {
        case 0: {
          scOrder = '예습';
          break;
        }
        case 1: {
          scOrder = '본강의';
          break;
        }
        case 2: {
          scOrder = '복습';
          break;
        }
        default: {
          throw new Error(`not defined order ${order}`);
        }
      }
      return scOrder;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/variables.scss";

.sc-item-wrapper {
  margin: 8px 0px;
  padding: 5px 0px 5px 0px;

  .selected {
    background-color: #dcdfe6;
  }

  .nonActive {
    opacity: 0.3;
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
