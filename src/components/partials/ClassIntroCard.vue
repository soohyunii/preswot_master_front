<template functional>
  <div style="display: inline-block; width: 200px; margin: 20px 0px 20px 0px">
    <div style="text-align: center; margin: 0px 0px 15px 0px;">
      <img :src="require('@/assets/profi.png')" width="200" height="200">
    </div>
    <b>{{ props.title }}</b>
    <h5 v-for="teacher in props.teacherList" :key="teacher">{{ teacher }}</h5>
    <p v-if="props.startDateStr != undefined">{{ props.startDateStr }} ~ {{ props.endDateStr }}</p>
    <p>{{ props.description }}</p>
    <el-button style="width: 100%" @click="props.onClick()" disabled>수강 하기</el-button>
    <el-button style="width: 100%; margin-left:0px; margin-top:6px;" @click="props.onClick('details', props.classId)">상세 보기</el-button>
  </div>
</template>

<script>
export default {
  name: 'ClassIntroCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacherList: {
      type: Array[String],
      required: true,
    },
    classId: {
      type: Number,
    },
    onClick: {
      type: Function,
    },
    startDateStr: String,
    endDateStr: String,
  },
};
</script>
