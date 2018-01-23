<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="39px">
        <span class="label" :style="labelStyle">SCENARIO</span>
        <!-- <span class="label">SCENARIO</span> -->
      </el-aside>
      <el-main>
        <div ref="main">
          <div v-show="isLectureScenarioEmpty">
            <!-- TODO: translation -->
            <el-row>
              <el-col :span="12" :offset="6">
                <div class="empty-scenario-wrapper">
                  시나리오 저작 도구를 클릭하여 시나리오 요소를 추가하세요
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-show="!isLectureScenarioEmpty">
            <el-row :gutter="10">
              <!-- TODO: middle bar between two Items -->
              <draggable v-model="lectureScenario"
                :options="dragOptions"
                @start="drag = true;"
                @end="drag = false;">
                <transition-group name="list-group">
                  <lecture-scenario-item
                    v-for="(item, index) in lectureScenario"
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

import LectureScenarioItem from './LectureScenarioItem';

export default {
  name: 'LectureScenario',
  data() {
    return {
      drag: false,
      labelStyle: {
        height: '154px',
      },
    };
  },
  computed: {
    ...mapGetters('teacher', ['isLectureScenarioEmpty']),
    lectureScenario: {
      get() {
        return this.$store.state.teacher.lectureScenario;
      },
      set(lectureScenario) {
        const vm = this;
        vm.updateLectureScenario({ lectureScenario });
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
    ...mapMutations('teacher', ['updateLectureScenario']),
    updateLabelStyle() {
      const vm = this;
      const main = this.$refs.main;
      if (vm.isLectureScenarioEmpty) {
        vm.labelStyle.height = '154px';
      } else if (vm.labelStyle.height > 114) {
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
    LectureScenarioItem,
  },
};
</script>
