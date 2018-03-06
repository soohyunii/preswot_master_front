<template>
  <div id="LineChart" />
</template>

<script>
  import { bb } from 'billboard.js';

  export default {
    name: 'LineChart',
    props: ['chartData', 'isStudent'],
    data() {
      return {
        count: 0,
      };
    },
    mounted() {
      const vm = this;
      let formedData = [];
      // eslint-disable-next-line
      if(vm.isStudent) {
        // eslint-disable-next-line
        formedData = [['이해도'], ['집중도'], ['참여도']];
        // eslint-disable-next-line
      }
      else {
        // eslint-disable-next-line
        formedData = [['평균 이해도'], ['평균 집중도'], ['평균 참여도']];
      }
      let i = 0;
      // eslint-disable-next-line
      if (vm.isStudent) {
        for (i = 0; i < vm.chartData.length; i += 1) {
          formedData[0].push(vm.chartData[i].understanding_score);
          formedData[1].push(vm.chartData[i].concentration_score);
          formedData[2].push(vm.chartData[i].participation_score);
        }// eslint-disable-next-line
      }
      else {
        for (i = 0; i < vm.chartData.length; i += 1) {
          formedData[0].push(vm.chartData[i].avg_understanding_score);
          formedData[1].push(vm.chartData[i].avg_concentration_score);
          formedData[2].push(vm.chartData[i].avg_participation_score);
        }
      }
      // eslint-disable-next-line
      const chart = bb.generate({
        data: {
          columns: formedData,
        },
        bindto: '#LineChart',
      });
    },
  };
</script>
