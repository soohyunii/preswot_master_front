<template>
  <div>
    <div>
      <p>강의도구 화면</p>
      <el-button style="float:right" type="primary" size="small" @click="onClick('HIDE',lectureItemId)">내리기</el-button>
      <p>현재: {{ data.name }}</p>
    </div>
    <lecture-live-item
      :data="data"
      :lectureItemId="lectureItemId"
      :onClick="onClick"/>
  </div>
</template>

<script>
import lectureItemService from '../../services/lectureItemService';
import LectureLiveItem from './LectureLiveItem';

export default {
  async created() {
    const vm = this;
    const res = await lectureItemService.getLectureItem({
      lectureItemId: vm.lectureItemId,
    });
    vm.data = res.data;
  },
  props: ['onClick', 'lectureItemId'],
  data() {
    return {
      data: {},
    };
  },
  components: {
    LectureLiveItem,
  },
};
</script>

<style>

</style>
