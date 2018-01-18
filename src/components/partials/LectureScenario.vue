<template>
  <div class="grid-content bg-white">
    <h1>Lecture Element Sequence Template</h1>
    <el-row :gutter="10">
      <!-- TODO: transform animation? -->
      <!-- TODO: middle bar between two Items -->
      <draggable v-model="lectureScenario" :options="dragOptions" @start="drag=true" @end="drag=false">
        <transition-group>
          <lecture-scenario-item
            v-for="(item, index) in lectureScenario"
            class="list-group-item"
            :key="index"
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
  }

  .ghost {
    opacity: .5;
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