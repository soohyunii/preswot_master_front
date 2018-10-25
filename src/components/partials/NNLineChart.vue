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
    watch: {
      chartData() {
        // console.log('chartData 감시중');
        this.onRefresh();
      },
    },
    mounted() {
      this.onRefresh();
    },
    methods: {
      onRefresh() {
        const vm = this;
        let formedData = [];
        // eslint-disable-next-line
        if(vm.isStudent) {
          // eslint-disable-next-line
          // formedData = [['이해도'], ['집중도'], ['참여도']];
          formedData = [['참여도'], ['이해도']];
          // eslint-disable-next-line
        }
        else {
          // eslint-disable-next-line
          // formedData = [['평균 이해도'], ['평균 집중도'], ['평균 참여도']];
          formedData = [['평균 참여도'], ['평균 이해도']];
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
          if (vm.chartData[0] !== undefined) {
            for (i = 0; i < vm.chartData[0].length; i += 1) {
              formedData[0].push(vm.chartData[0][i].participation * 100);
            }
          }
          if (vm.chartData[1] !== undefined) {
            for (i = 0; i < vm.chartData[1].length; i += 1) {
              formedData[1].push(vm.chartData[1][i].understanding * 100);
            }
          }
          /*
          for (i = 0; i < vm.chartData.length; i += 1) {
            formedData[0].push(vm.chartData[i].participation);
            formedData[1].push(vm.chartData[i].participation);
          }
          */
        }
        // eslint-disable-next-line
        const chart = bb.generate({
          data: {
            columns: formedData,
          },
          bindto: '#LineChart',
        });
        chart.axis.range({
          max: {
            y: 100,
          },
          min: {
            y: 10,
          },
        });
      },
    },
  };
</script>
