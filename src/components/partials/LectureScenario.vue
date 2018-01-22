<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="39px">
        <span class="label" :style="labelStyle">SCENARIO</span>
        <!-- <span class="label">SCENARIO</span> -->
      </el-aside>
      <el-main>
        <div ref="main">
          <el-row :gutter="10">
            <!-- TODO: middle bar between two Items -->
            <draggable v-model="lectureScenario"
              :options="dragOptions"
              @start="drag=true"
              @end="drag=false">
              <transition-group name="list-group">
                <lecture-scenario-item
                  v-for="(item, index) in lectureScenario"
                  class="list-group-item"
                  :key="item.key"
                  :props="{ item, index }" />
              </transition-group>
            </draggable>
          </el-row>
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
}
</style>


<script>
import draggable from 'vuedraggable';
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
    lectureScenario: {
      get() {
        return this.$store.state.teacher.lectureScenario;
      },
      set(lectureScenarioItems) {
        // window.console.log(lectureScenarioItems);
        this.$store.commit('teacher/editLectureElement', { lectureScenarioItems });
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
    getLabelStyle() {
      const main = this.$refs.main;
      const res = {};
      if (!main) {
        res.height = '200px';
      } else {
        res.height = `${main.clientHeight + 40}px`;
      }
      // this.$nextTick(() => {
      //   this.$forceUpdate();
      // });
      return res;
    },
    updateLabelStyle() {
      const vm = this;
      const main = this.$refs.main;
      if (!main) {
        vm.labelStyle.height = '200px';
      } else if (main.clientHeight !== 0) {
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

<style>
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
</style>