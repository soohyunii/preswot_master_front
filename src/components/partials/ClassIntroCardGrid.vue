<template functional>
  <div>
    <el-row>
      <el-col
        v-for="item in props.classList"
        :key="item.title"
        :span="props.span">
        <class-intro-card
            :title="item.title"
            :description="item.description"
            :classId="item.class_id"
            :teacher-list="item.teacherlist"
            :startDateStr="item.startDateStr"
            :endDateStr="item.endDateStr"
            :status="item.status"
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
    classList: {
      type: Array,
      required: true,
    },
    onClick: {
      type: Function,
    },
  },
};
</script>
