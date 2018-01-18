<template>
  <div>
    <h1>Lecture Element Sequence Template</h1>
    <el-row :gutter="10">
      <draggable v-model="lectureElementSequence" @start="drag=true" @end="drag=false">
        <lecture-scenario-item :lectureElementSequence="lectureElementSequence"></lecture-scenario-item>
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
    lectureElementSequence: {
      get() {
        return this.$store.state.teacher.lectureElementSequence;
      },
      set(value) {
        window.console.log('dasdada');
        this.$store.commit('teacher/editLectureElement', { evt: value });
      },
    },
  },
  components: {
    draggable,
    LectureScenarioItem,
  },
};
</script>
