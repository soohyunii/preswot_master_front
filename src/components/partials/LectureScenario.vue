<template>
  <div>
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
</style>