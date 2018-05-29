<template functional>
  <div>
    <h3>인기 과목 보기</h3>
    <el-row>
      <el-col
        v-for="item in props.popularClassList"
        :key="item.title"
        :span="props.span">
        <class-intro-card
            :title="item.title"
            :description="item.description"
            :classId="item.classId"
            :teacher-list="item.teacherlist"
            :startDateStr="item.startDateStr"
            :endDateStr="item.endDateStr"
            :onClick="props.onClick"
          />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ClassIntroCard from './ClassIntroCard';

export default {
  components: {
    ClassIntroCard,
  },
  props: {
    span: {
      type: Number,
      required: true,
    },
    popularClassList: {
      type: Array,
      required: true,
    },
    onClick: {
      type: Function,
    },
  },
};
</script>