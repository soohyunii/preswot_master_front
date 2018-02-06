<template>
  <div>
    <bar-chart :data="data" :xAxisName="xName"></bar-chart>
  </div>
</template>

<script>
import barChart from '../partials/BarChart';

export default {
  name: 'test',
  data() {
    return {
      xName: ['x', '노이해', '조금이해', '보통이해', '완전이해'],
      data: ['이해도', 30, 90, 72, 25],
    };
  },
  components: {
    barChart,
  },
};
</script>
