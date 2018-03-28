<template>
  <div class="sc-wrapper">
    <el-container>
      <el-aside width="39px">
        <span class="label" :style="labelStyle">SCENARIO</span>
      </el-aside>
      <el-main>
        <div ref="main">
          <div v-show="isScEmpty">
            <!-- TODO: translation -->
            <el-row>
              <el-col :span="12" :offset="6">
                <div class="empty-scenario-wrapper">
                  시나리오 저작 도구를 클릭하여 시나리오 요소를 추가하세요
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-show="!isScEmpty">
            <el-row :gutter="10">
              <sc-item
                v-for="(item, index) in sc"
                class="list-group-item"
                :key="item.id"
                :type="item.type"
                :index="index" />
              <!-- <transition-group name="list-group">
                <draggable v-model="sc"
                  :options="dragOptions"
                  @start="drag = true;"
                  @end="drag = false;">
                </draggable>
              </transition-group> -->
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

.sc-wrapper {
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

  /* draggable 관련 css */
  // .list-group-enter, .list-group-leave-to /* .list-leave-active below version 2.1.8 */ {
  //   opacity: 0;
  //   transform: translateY(20px);
  // }
  // .list-group-leave-active {
  //   position: absolute;
  // }
  // .ghost {
  //   opacity: .5;
  //   background-color: rgb(204, 204, 204);
  // }
  /* draggable 관련 css 끝 */


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
import isNil from 'lodash.isnil';

import ScItem from './ScItem';

export default {
  name: 'Sc',
  props: ['afterStartDateOffsetSec'],
  data() {
    return {
      drag: false,
      labelStyle: {
        height: '154px',
      },
    };
  },
  computed: {
    ...mapGetters('scItem', [
      'currentEditingScItem',
      'isScEmpty',
    ]),
    sc: {
      get() {
        const vm = this;
        const filter = vm.$store.state.sc.scOrderFilter;
        const sc = vm.$store.state.scItem.sc;
        return isNil(filter) ? sc : sc.filter(item => item.order === filter);
      },
      set(sc) {
        const vm = this;
        const beforeUpdateCurrentEditingScItem = vm.currentEditingScItem;
        if (sc) {
          vm.updateSc({ sc });
        }
        const index = sc.map(x => x.id).indexOf(beforeUpdateCurrentEditingScItem.id);
        if (index !== -1) {
          vm.updateCurrentEditingScItemIndex({
            currentEditingScItemIndex: index,
          });
        }
      },
    },
    // dragOptions() {
    //   return {
    //     animation: 0,
    //     ghostClass: 'ghost',
    //   };
    // },
  },
  methods: {
    ...mapMutations('scItem', ['updateSc']),
    ...mapMutations('scItem', [
      'assignCurrentEditingScItem',
      'updateCurrentEditingScItemIndex',
    ]),
    updateLabelStyle() {
      const vm = this;
      const main = this.$refs.main;
      if (vm.isScEmpty) {
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
    ScItem,
  },
};
</script>
