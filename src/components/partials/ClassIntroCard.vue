<template functional>

    <div style="display: inline-block; width: 180px; background-color: #ffffff;">
    <div id="class_card" @click="props.onClick('DETAIL', props.classId)" style="display: inline-block; height: 380px;">
      <div style="text-align: center; margin: 0px 0px 15px 0px;">
        <img :src="require('@/assets/profi.png')" width="180" height="180" style="background-color: #eeeeee;">
      </div>
      <div style="padding:10px">
        <b>{{ props.title }}</b>
        <h5 v-for="teacher in props.teacherList" :key="teacher">{{ teacher }}</h5>
        <p style="font-size: 9px;" v-if="props.startDateStr != undefined">{{ props.startDateStr }} ~ {{ props.endDateStr }}</p>
        <p>{{ props.description }}</p>      
    </div>
  </div>

    <el-button v-if="props.status === 0" type="primary" style="width: 100%" @click="props.onClick('APPLY', props.classId)">수강 하기</el-button>
    <el-button v-if="props.status === 1" type="info" style="width: 100%" @click="props.onClick('CALCEL', props.classId)">수강중</el-button>
    <el-button v-if="props.status === 2" type="info" style="width: 100%">마감</el-button>
    <el-button v-if="props.status === 3" type="primary" style="width: 100%" @click="props.onClick('GOTOLECTURE', props.classId)">강의 보기</el-button>
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
    status: {
      type: Number, // 0: 수강신청 대기중, 1: 이미 수강중, 2: 마감, 3: (내 과목 목록에서의) 강의 보기
      default: 0,
    },
  },
};
</script>

<style lang="scss">
/* sh:전역으로 설정-모든 class_card에 적용 */
#class_card{
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
  margin: 5px 15px 15px 0px;
}

#class_card:hover{
  background-color:#f5f7fa;
}



</style>