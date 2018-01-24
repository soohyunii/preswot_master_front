<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="39px">
        <span class="label" :style="labelStyle">SCENARIO</span>
        <!-- <span class="label">SCENARIO</span> -->
      </el-aside>
      <el-main>
        <div ref="main">
          <div v-show="isLsEmpty">
            <!-- TODO: translation -->
            <el-row>
              <el-col :span="12" :offset="6">
                <div class="empty-scenario-wrapper">
                  시나리오 저작 도구를 클릭하여 시나리오 요소를 추가하세요
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-show="!isLsEmpty">
            <el-row :gutter="10">
              <!-- TODO: middle bar between two Items -->
              <draggable v-model="ls"
                :options="dragOptions"
                @start="drag = true;"
                @end="drag = false;">
                <transition-group name="list-group">
                  <ls-item
                    v-for="(item, index) in ls"
                    class="list-group-item"
                    :key="item.key"
                    :type="item.type"
                    :index="index" />
                </transition-group>
              </draggable>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

.wrapper {
  background-color: white;

  .label {
    font-size: 16px;
    font-weight: 600;
    padding: 2px 3px;
    color: white;
    background-color: $app-ultra-violet;
    writing-mode: vertical-lr;
    // height: 200px;
    text-align: center;
    transform: rotate(180deg);
    // width: 100%;
  }

  .list-group-item {
    cursor: move;
    display: inline-block;
    transition: all 1s;
      margin-right: 10px;
  }

  .list-group-enter, .list-group-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(20px);
  }

  .list-group-leave-active {
    position: absolute;
  }

  .ghost {
    opacity: .5;
    background-color: rgb(204, 204, 204);
  }

  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    padding: 25px;
    margin-bottom: 30px;
  }
  .empty-scenario-wrapper {
    margin-top: 40px;
    border: 4px $app-gray dotted;
    background-color: white;
    padding: 5px 10px;
    text-align: center;
    font-size: 85%;
    padding: 10px 0px 12px;
  }
}
</style>


<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations } from 'vuex';

import LsItem from './LsItem';

export default {
  name: 'Cs',
  data() {
    return {
      drag: false,
      labelStyle: {
        height: '154px',
      },
    };
  },
  computed: {
    ...mapGetters('teacher', ['isLsEmpty']),
    ls: {
      get() {
        return this.$store.state.teacher.ls;
      },
      set(ls) {
        const vm = this;
        if (ls) {
          vm.updateLs({ ls });
        }
        const index = ls.map(x => x.key).indexOf(vm.$store.state.teacher.currentEditingLsItem.key);
        if (index !== -1) {
          vm.updateCurrentEditingLsItem({
            currentEditingLsItem: vm.$store.state.teacher.currentEditingLsItem,
            lectureElementIndex: index,
          });
        }
      },
    },
    dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost',
      };
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateLs', 'updateCurrentEditingLsItem']),
    updateLabelStyle() {
      const vm = this;
      const main = this.$refs.main;
      if (vm.isLsEmpty) {
        vm.labelStyle.height = '154px';
      } else if (main.clientHeight > 114) {
        vm.labelStyle.height = `${main.clientHeight + 40}px`;
      } else {
        vm.labelStyle.height = '154px';
      }
      return vm.labelStyle;
    },
  },
  async updated() {
    const vm = this;
    await vm.$nextTick();
    await vm.updateLabelStyle();
  },
  components: {
    draggable,
    LsItem,
  },
};
</script>
