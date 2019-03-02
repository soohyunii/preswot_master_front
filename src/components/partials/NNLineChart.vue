<template>
  <div id="LineChart" />
</template>

<script>
  import { bb } from 'billboard.js';

  export default {
    name: 'LineChart',
    props: ['chartData', 'chartCategories'],
    data() {
      return {
        count: 0,
      };
    },
    watch: {
      chartData() {
        this.onRefresh();
      },
    },
    mounted() {
      this.onRefresh();
    },
    methods: {
      onRefresh() {
        const vm = this;
        if (vm.chartData.length === 0) return;
        const formedData = vm.chartData;
        // eslint-disable-next-line
        const chart = bb.generate({
          data: {
            columns: formedData,
          },
          axis: {
            x: {
              type: 'category',
              categories: vm.chartCategories,
            },
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
