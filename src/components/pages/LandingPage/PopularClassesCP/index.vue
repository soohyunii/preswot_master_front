<template>
    <div>
        <div v-for="(item,index) in popularClassList" v-bind:key="item.classId">
            <el-col :key="item.class_id" :span="24/elementNumber" v-if="index < elementNumber">
                 <class-intro-card
                    :title="item.name"
                    :description="item.description"
                    :classId="item.classId"
                    :label-span="8"
                    :teacher-list="item.teacherList"
                    :start-date-str="item.startDate"
                    :end-date-str="item.endDate"
                />
            </el-col>
        </div>
    </div>
          
</template>
<script>
import deepEqual from 'deep-equal';
import studentService from '../../../../services/studentService';
import ClassIntroCard from '../../../partials/ClassIntroCard';


export default {
  components: {
    ClassIntroCard,
  },
  data() {
    const vm = this;
    // * Restore previous popularClassList
    vm.$vlf.getItem('popularClassList')
    .then((res) => {
      if (!res) {
        return;
      }
      vm.popularClassList = res;
      vm.handleResize();
    });
    return {
      popularClassList: [],
      elementNumber: 3,
    };
  },
  methods: {
    async getPopularClassList() {
      const vm = this;
      const res = await studentService.fetchPopularClassList();
      // * If fetched popularClassList is different from stored one, replace it
      if (deepEqual(res, vm.popularClassList)) {
        return;
      }
      vm.popularClassList = res;
      vm.$vlf.setItem('popularClassList', res);
    },
  },
  async mounted() {
    // const vm = this;
    // await vm.getPopularClassList();
  },
};
</script>
<style></style>