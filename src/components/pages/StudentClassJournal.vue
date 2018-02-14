<template>
  <div>
   <div class="classTitle">{{analysisData.name}}</div>
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
  <el-row :gutter="20" v-for="item in analysisData.lectures">
    <el-col :span="3">
    <div class="lectureTitle">{{item.name}}</div>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="value5" :step="25" disabled show-stops></el-slider>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="value5" :step="25" disabled show-stops></el-slider>
    </el-col>
    <el-col :span="6">
      <el-slider v-model="value5" :step="25" disabled show-stops></el-slider>
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

  export default {
    name: 'TeacherLectureLive',
    components: {
    },
    data() {
      return {
        value5: 42,
      };
    },
    methods: {
      ...mapActions('analysis', [
        'getAnalysisData',
      ]),
      ...mapMutations('analysis', ['updateClassId', 'updateUserId']),
    },
    computed: {
      ...mapState('analysis', ['analysisData']),
    },
    async beforeMount() {
      const vm = this;
      vm.updateClassId({
        classId: 1,
      });
      vm.updateUserId({
        userId: utils.getUserIdFromJwt(),
      });
      await vm.getAnalysisData();
    },
  };
</script>
