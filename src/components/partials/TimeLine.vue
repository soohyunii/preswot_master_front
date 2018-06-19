<template>
  <div id='TimeChart' v-if="chartData.length>0" />
</template>

<script>
  import { bb } from 'billboard.js';

  export default {
    name: 'TimeLine',
    props: ['chartData'],
    data() {
      return {
      };
    },
    mounted() {
      const vm = this;
      let i = 0;
      const timeData = ['x'];
      const concentrationData = ['집중도'];
      const understandingData = ['이해도'];
      const participationData = ['참여도'];
      let temp = null;
      for (i = 0; i < vm.chartData.length; i += 1) {
        temp = vm.chartData[i];
        timeData.push(temp.log_time);
        concentrationData.push(temp.avg_concentration_score);
        understandingData.push(temp.avg_understanding_score);
        participationData.push(temp.avg_participation_score);
      }
      bb.generate({
        data: {
          x: 'x',
          xFormat: '%H:%M:%S',
          columns: [
            timeData, concentrationData, understandingData, participationData,
          ],
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%H:%M:%S',
            },
          },
        },
        bindto: '#TimeChart',
      });
    },
  };
</script>
