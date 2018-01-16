<template>
  <div>
    <h1>Lecture Element Sequence Template</h1>
    <el-row :gutter="10">
      <lecture-scenario-item></lecture-scenario-item>
    </el-row>
  </div>
</template>

<script>
import LectureScenarioItem from './LectureScenarioItem';

export default {
  components: {
    LectureScenarioItem,
  },
};
</script>
