<template>
  <div id="LineChart" />
</template>

<script>
  import { bb } from 'billboard.js';

  export default {
    name: 'LineChart',
    props: ['chartData'],
    data() {
      return {
        count: 0,
      };
    },
    mounted() {
      const vm = this;
      // console.log(vm.chartData);
      const formedData = [['이해도'], ['집중도'], ['참여도']];
      for (let i = 0; i < vm.chartData.length; i += 1) {
        formedData[0].push(vm.chartData[i].understanding_score);
        formedData[1].push(vm.chartData[i].concentration_score);
        formedData[2].push(vm.chartData[i].participation_score);
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
