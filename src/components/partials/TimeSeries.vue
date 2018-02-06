<template>
  <div id="Flow" />
</template>

<script>
import { bb } from 'billboard.js';
import moment from 'moment';

export default {
  name: 'TimeSeries',
  props: ['date', 'data'],
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    const vm = this;
    const chart = bb.generate({
      data: {
        x: 'x',
        columns: [],
        type: 'area-spline',
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format(x) {
              return moment(x).format('YYYY-MM-DD HH:mm:ss');
            },
          },
        },
        y: {
          max: 100,
          min: 0,
          padding: 0,
        },
      },
      bindto: '#Flow',
    });
    vm.$watch('date', () => {
      if (vm.count < 10) {
        vm.count += 1;
      }
      chart.flow({
        columns: [vm.date, vm.data],
        length: vm.count < 10 ? 0 : 1,
      });
    });
  },
};
</script>
