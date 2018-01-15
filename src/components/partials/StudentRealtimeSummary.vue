<template>
  <div>
      <!-- TODO: translation -->
      <el-col :offset="6" :span="2" style="text-align:center;"><div>나의 이해도</div></el-col>
      <el-col :span="4"><div><el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress></div></el-col>
      <el-col :span="3" style="text-align:center;"><div>수강생 평균 이해도</div></el-col>
      <el-col :span="4"><div><el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></el-progress></div></el-col>          
  </div>
</template>

<script>
export default {
  // TODO: 전달되는 데이터 명 확인
  name: 'StudentRealtimeSummary',
  props: ['SummaryData'],
};
</script>

