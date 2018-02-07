<template>
  <div id='BarChart' />
</template>

<script>
import { bb } from 'billboard.js';

export default {
  name: 'BarChart',
  props: ['xAxisName', 'data'],
  mounted() {
    const vm = this;
    bb.generate({
      data: {
        x: vm.xAxisName[0],
        columns: [vm.xAxisName, vm.data],
        type: 'bar',
        color(color, d) {
          if (d.value <= 25) { // eslint-disable-next-line
            color = '#f56c6c';
          } else if (d.value <= 50) { // eslint-disable-next-line
            color = '#f4cb42';
          } else if (d.value <= 75) { // eslint-disable-next-line
            color = '#409eff';
          } else if (d.value <= 100) { // eslint-disable-next-line
            color = '#67c23a';
          }
          return color;
        },
      },
      axis: {
        x: {
          type: 'category',
        },
        y: {
          max: 100,
          padding: 0,
          tick: {
            count: 5,
          },
        },
      },
      bar: {
        width: {
          ratio: 0.5,
        },
      },
      bindto: '#BarChart',
    });
  },
};
</script>
