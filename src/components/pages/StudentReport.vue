<template>
  <div class="grid-content bg-white" oncontextmenu="return false">
    <h1>학생 보고서</h1>
    <hr />
    <h2>등급추이</h2>
    <hr />
    <time-series :resultData="resultData"></time-series>
    <t :resultData="resultData"></t>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import timeSeries from '../partials/ReportTimeSeries';
import table from '../partials/StudentReportTable';

export default {
  name: 'test',
  components: {
    timeSeries,
    t: table,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('report', [
      'userId', 'reports', 'currentClassId', 'currentClassStat', 'resultData',
    ]),
    ...mapGetters('report', [
      'sizeOfReports',
    ]),
  },
  methods: {
    ...mapMutations('report', [
      'updateUserId',
      'updateCurrentClassId',
    ]),
    ...mapActions('report', [
      'setStudentClassReport',
      'setClassStat',
      'setResultData',
    ]),
  },
  async mounted() {
    const vm = this;
    vm.updateUserId({ userId: Number.parseInt(vm.$route.params.userId, 10) });
    vm.updateCurrentClassId({ currentClassId: Number.parseInt(vm.$route.params.classId, 10) });
    await vm.setStudentClassReport();
    await vm.setClassStat();
    await vm.setResultData();
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