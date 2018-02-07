<template>
  <div>
    <bar-chart :data="data1" :xAxisName="xName"></bar-chart>
    <time-series :data="data2" :date="date" />
  </div>
</template>

<script>
import barChart from '../partials/BarChart';
import timeSeries from '../partials/TimeSeries';

export default {
  name: 'test',
  data() {
    return {
      xName: ['x', '노이해', '조금이해', '보통이해', '완전이해'],
      data1: ['이해도', 30, 90, 72, 25],
      date: ['x', new Date()],
      data2: ['집중도', 0],
    };
  },
  components: {
    barChart,
    timeSeries,
  },
  async mounted() {
    const vm = this;
    await vm.$nextTick();
    // TODO: listen to socket event from server
    await setInterval(() => {
      vm.date = ['x'];
      vm.data2 = ['집중도'];
      vm.date.push(new Date());
      vm.data2.push(Math.floor(Math.random() * 100));
    }, 3000);
  },
};
</script>
