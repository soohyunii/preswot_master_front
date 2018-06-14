<template>
  <div>
    <div>
      <p>강의도구 화면</p>
      <el-button style="float:right" type="primary" size="small" @click="onClick('HIDE',lectureItemId)">내리기</el-button>
      <p>현재: {{ data.name }}</p>
    </div>
    <lecture-item
      :data="data"
      :onClick="onClick"/>
  </div>
</template>

<script>
import lectureItemService from '../../services/lectureItemService';
import lectureItem from './LectureItem';

export default {
  async created() {
    const vm = this;
    const res = await lectureItemService.getLectureItem({
      lectureItemId: vm.lectureItemId,
    });
    console.log('@TeacherLectureItemLive: res.data = ');
    console.log(res.data);
    vm.data = res.data;
  },
  props: ['onClick', 'lectureItemId'],
  data() {
    return {
      data: {},
    };
  },
  components: {
    lectureItem,
  },
};
</script>

<style>

</style>
