<template functional>
  <el-card>
    <div slot="header" class="clear-fix">
      <b>{{ props.title }}</b>
      <el-button
        @click="props.onClick('APPLY', props.classId)"
        type="primary"
        size="mini"
        style="float: right;"
      >
        수강 신청
      </el-button>
    </div>
    <el-row>
      <el-col :span="props.labelSpan">과목 소개</el-col>
      <el-col :span="24 - props.labelSpan">{{ props.description }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="props.labelSpan">강사 목록</el-col>
      <el-col :span="24 - props.labelSpan">{{ props.teacherList }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="props.labelSpan">기간</el-col>
      <el-col :span="24 - props.labelSpan">{{ props.startDateStr }}, {{ props.endDateStr }}</el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>


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
    labelSpan: {
      type: Number,
      required: true,
    },
    classId: {
      type: Number,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    startDateStr: String,
    endDateStr: String,
  },
  // data() {
  //   return {
  //     labelSpan: 5,
  //   };
  // },
};
</script>

