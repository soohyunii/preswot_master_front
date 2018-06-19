<template>
  <div id='Graph' />
</template>

<script>
import { bb } from 'billboard.js';

export default {
  name: 'ReportGraph',
  props: ['resultData', 'role'],
  methods: {
    renderTimeSeriesForStudent() {
      const vm = this;
      // setTimeout(function() {
      //   if (vm.resultData.length != 0) {
      //     console.log("데이터 들어옴");
      //     console.log(vm.resultData);
      //   } else {
      //     console.log("데이터 안들어옴"); // 딜레이를 주면 됨..
      //   }
      // }, 3000);
      const x = ['x'];
      const preUnder = ['예습이해도'];
      const preConcen = ['예습집중도'];
      const prePartici = ['예습참여도'];
      const reaUnder = ['본강이해도'];
      const reaConcen = ['본강집중도'];
      const reaPartici = ['본강참여도'];
      const revUnder = ['복습이해도'];
      const revConcen = ['복습집중도'];
      const revPartici = ['복습참여도'];
      for (let i = 0; i < vm.resultData.length; i += 1) {
        x.push(`${i + 1}강`);
        preUnder.push(vm.resultData[i].unders_pre_gra);
        preConcen.push(vm.resultData[i].concen_pre_gra);
        prePartici.push(vm.resultData[i].parti_pre_gra);
        reaUnder.push(vm.resultData[i].unders_rea_gra);
        reaConcen.push(vm.resultData[i].concen_rea_gra);
        reaPartici.push(vm.resultData[i].parti_rea_gra);
        revUnder.push(vm.resultData[i].unders_rev_gra);
        revConcen.push(vm.resultData[i].concen_rev_gra);
        revPartici.push(vm.resultData[i].parti_rev_gra);
      }
      const chart = bb.generate({  // eslint-disable-line
        bindto: '#Graph',
        data: {
          x: 'x',
          columns: [
            x,
            preUnder,
            preConcen,
            prePartici,
            reaUnder,
            reaConcen,
            reaPartici,
            revUnder,
            revConcen,
            revPartici,
          ],
          types: {
            preUnder: 'line',
            preConcen: 'line',
            prePartici: 'line',
            reaUnder: 'line',
            reaConcen: 'line',
            reaPartici: 'line',
            revUnder: 'line',
            revConcen: 'line',
            revPartici: 'line',
          },
        },
        axis: {
          x: {
            type: 'category',
          },
          y: {
            max: 10,
            min: 0,
            padding: 0,
          },
        },
      });
    },
    renderTimeSeriesForTeacher() {
      const vm = this;
      // setTimeout(function() {
      //   if (vm.resultData.length != 0) {
      //     console.log("데이터 들어옴");
      //     console.log(vm.resultData);
      //   } else {
      //     console.log("데이터 안들어옴"); // 딜레이를 주면 됨..
      //   }
      // }, 3000);
      const x = ['x'];
      const preUnder = ['예습이해도'];
      const preConcen = ['예습집중도'];
      const prePartici = ['예습참여도'];
      const reaUnder = ['본강이해도'];
      const reaConcen = ['본강집중도'];
      const reaPartici = ['본강참여도'];
      const revUnder = ['복습이해도'];
      const revConcen = ['복습집중도'];
      const revPartici = ['복습참여도'];
      for (let i = 0; i < vm.resultData.length; i += 1) {
        x.push(`${i + 1}강`);
        preUnder.push(vm.resultData[i].unders_pre_avg.toFixed(1));
        preConcen.push(vm.resultData[i].concen_pre_avg.toFixed(1));
        prePartici.push(vm.resultData[i].parti_pre_avg.toFixed(1));
        reaUnder.push(vm.resultData[i].unders_rea_avg.toFixed(1));
        reaConcen.push(vm.resultData[i].concen_rea_avg.toFixed(1));
        reaPartici.push(vm.resultData[i].parti_rea_avg.toFixed(1));
        revUnder.push(vm.resultData[i].unders_rev_avg.toFixed(1));
        revConcen.push(vm.resultData[i].concen_rev_avg.toFixed(1));
        revPartici.push(vm.resultData[i].parti_rev_avg.toFixed(1));
      }
      const chart = bb.generate({  // eslint-disable-line
        bindto: '#Graph',
        data: {
          x: 'x',
          columns: [
            x,
            preUnder,
            preConcen,
            prePartici,
            reaUnder,
            reaConcen,
            reaPartici,
            revUnder,
            revConcen,
            revPartici,
          ],
          types: {
            preUnder: 'line',
            preConcen: 'line',
            prePartici: 'line',
            reaUnder: 'line',
            reaConcen: 'line',
            reaPartici: 'line',
            revUnder: 'line',
            revConcen: 'line',
            revPartici: 'line',
          },
        },
        axis: {
          x: {
            type: 'category',
          },
          y: {
            max: 100,
            min: 0,
            padding: 0,
          },
        },
      });
    },
  },
  watch: {
    resultData() {
      const vm = this;
      if (vm.role === 'teacher') {
        vm.renderTimeSeriesForTeacher();
      } else {
        vm.renderTimeSeriesForStudent();
      }
    },
  },
};
</script>
