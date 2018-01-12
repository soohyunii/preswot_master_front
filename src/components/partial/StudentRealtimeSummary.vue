<template>
  <div>
    <el-container>
      <h1 class="headline">실시간 강의 이해도</h1>
      <el-row>
        <el-col :span="6"><div>나의 이해도</div></el-col>
        <el-col :span="6"><div><el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div>수강생 평균 이해도</div></el-col>
        <el-col :span="6"><div><el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></el-progress></div></el-col>          
      </el-row>
      <el-row>
        <el-col :span="24"><div>나의 강의 이해 키워드</div></el-col>
        <el-tag>Tag One</el-tag>
        <el-tag type="success">Tag Two</el-tag>
        <el-tag type="info">Tag Three</el-tag>
        <el-tag type="warning">Tag Four</el-tag>
        <el-tag type="danger">Tag Five</el-tag>
      </el-row>
    </el-container>
  </div>
</template>

<script>
export default {
  // TODO: 전달되는 데이터 명 확인
  name: 'StudentRealtimeSummary',
  props: ['SummaryData'],
};
</script>

