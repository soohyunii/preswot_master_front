<template>
  <div class="grid-content bg-white">
    <h1>Lecture Element Sequence Template</h1>
    <el-row :gutter="10" class="group">
      <!-- TODO: transform animation? -->
      <!-- TODO: middle bar between two Items -->
      <draggable v-model="lectureScenario" :options="dragOptions" @start="drag=true" @end="drag=false">
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
</template>

<script>
import draggable from 'vuedraggable';
import LectureScenarioItem from './LectureScenarioItem';

export default {
  name: 'LectureScenario',
  data() {
    return {
      drag: false,
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
  components: {
    draggable,
    LectureScenarioItem,
  },
};
</script>

<style>
  .list-group-item {
    cursor: move;
    transition: all 1s;
    display: inline-block;
  }

  .list-group-enter, .list-group-leave-to {
    opacity: 0;
    transform: translateY(30px);
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