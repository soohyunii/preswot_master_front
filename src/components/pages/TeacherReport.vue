<template>
  <div class="grid-content bg-white">
    <h1>강사 보고서</h1>
    <hr />
    <h2>평균점수추이</h2>
    <hr />
    <time-series :resultData="resultData" :role="role"></time-series>
    <el-col align="right">
        <el-button type="primary" @click="onClick('SHOWLIST')">
            수강생목록보기
        </el-button>
    </el-col>
    <t :resultData="resultData" :attendeeList="currentClassAttendee"></t>
    <!-- <rsl></rsl> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import timeSeries from '../partials/ReportTimeSeries';
import table from '../partials/TeacherReportTable';
import reportStudentList from '../partials/ReportStudentList';

export default {
  name: 'test',
  components: {
    timeSeries,
    t: table,
    rsl: reportStudentList,
  },
  data() {
    return {
      role: 'teacher',
    };
  },
  computed: {
    ...mapState('report', [
      'userId', 'reports', 'currentClassId', 'currentClassStat', 'resultData', 'currentClassAttendee',
    ]),
    ...mapGetters('report', [
      'sizeOfReports',
    ]),
  },
  methods: {
    ...mapMutations('report', [
      'updateUserId',
      'updateCurrentClassId',
      'updateCurrentClassAttendee',
    ]),
    ...mapActions('report', [
      'setStudentClassReport',
      'setClassStat',
      'setResultData',
      'setCurrentClassAttendee',
    ]),
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'SHOWLIST': {
          console.log(vm.attendeeList);
          break;
        }
        default : {
          break;
        }
      }
    },
  },
  async mounted() {
    const vm = this;
    vm.updateUserId({ userId: Number.parseInt(vm.$route.params.userId, 10) });
    vm.updateCurrentClassId({ currentClassId: Number.parseInt(vm.$route.params.classId, 10) });
    await vm.setStudentClassReport();
    await vm.setClassStat();
    await vm.setResultData();
    await vm.setCurrentClassAttendee();
  },
};
</script>

<style scoped>
  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
    margin-left: 50px;
    margin-right: 50px;
  }
</style>