<template>
  <div>
    <div class="classTitle">과목명: {{ analysisData[0].class_name }}</div>
    <div class="num_student">수강 인원: {{ analysisData[0].class_num_student }}</div>
    <line-chart :chartData = "analysisData" />
  <el-row :gutter="20">
    <el-col :span="3">
      <div class="emptyDiv"></div>
    </el-col>
    <el-col :span="6">
      <div class="journalingTitle">이해도</div>
    </el-col>
    <el-col :span="6">
      <div class="journalingTitle">집중도</div>
    </el-col>
    <el-col :span="6">
      <div class="journalingTitle">참여도</div>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    v-for="item in analysisData"
    @click="onClick('DETAIL_ANALYSIS')"
    :key="item"
  >
    <el-col :span="3">
    <div class="lectureTitle">{{item.name}}</div>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="item.understanding_score" :step="25" :show-tooltip="false" disabled show-stops></el-slider>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="item.concentration_score" :step="25" :show-tooltip="false" disabled show-stops></el-slider>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="item.participation_score" :step="25" :show-tooltip="false" disabled show-stops></el-slider>
    </el-col>
  </el-row>
  </div>
</template>

<style lang="scss" scoped>
.el-slider__runway, .el-slider__runway.disabled .el-slider__bar{
  background-color: #57477f !important;
}
  .emptyDiv{
    width:100%;
    height:1px;
  }
</style>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import utils from '../../utils';
  import LineChart from '../partials/LineChart';

  export default {
    name: 'StudentClassJournal',
    components: {
      LineChart,
    },
    data() {
      return {
        defaultValue: 0,
      };
    },
    async beforeMount() {
      const vm = this;
      vm.updateClassId({
        classId: 1,
      });
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      vm.updateIsStudent({
        isStudent: 1,
      });
      await vm.getAnalysisData();
      // console.log(vm.analysisData);
    },
    methods: {
      ...mapMutations('analysis', ['updateClassId', 'updateUserId', 'updateIsStudent']),
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      onClick(type) {
        const vm = this;
        switch (type) {
          case 'DETAIL_ANALYSIS': {
            vm.isCloseMovie = true;
            break;
          }
          default: {
            throw new Error('not defined type', type);
          }
        }
      },
    },
    computed: {
      ...mapState('analysis', ['analysisData']),
    },
  };
</script>
