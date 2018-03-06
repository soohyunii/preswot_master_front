<template>
  <div id='TimeChart' />
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
      var i = 0;
      var timeData = ['x'];
      var concentrationData = ['집중도'];
      var understandingData = ['이해도'];
      var participationData = ['참여도'];
      var temp = null;
      for (i = 0; i < vm.chartData.length; i += 1) {
        temp = vm.chartData[i];
        timeData.push(temp.log_time);
        concentrationData.push(temp.avg_concentration_score);
        understandingData.push(temp.avg_understanding_score);
        participationData.push(temp.avg_participation_score);
      }
      var chart = bb.generate({
        data: {
          x: 'x',
          xFormat: '%H:%M:%S',
          columns: [
            timeData, concentrationData, understandingData, participationData
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
