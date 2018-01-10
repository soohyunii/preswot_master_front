<template>
  <div>
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <div class="grid-content bg-white">영상 썸네일</div>
          </el-col>
        </el-row>

        <div class="">강의 시나리오 목록<hr></div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-white">class<hr></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-white">class<hr></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-white">class<hr></div>
          </el-col>
        </el-row>

        <div class="">내 수강 통계<hr></div>
        <el-row type="flex" justify="center">
          <el-col>
            <div class="grid-content bg-white">통계</div>
          </el-col>
        </el-row>

        <div class="">대시보드<hr></div>
        <el-row type="flex" justify="center">
          <el-col>
            <div class="grid-content bg-white">ㅎㅎ</div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    };
  },
};
</script>


<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: rgb(255, 255, 255);
    color: #333;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 300px;
    padding: 25px;
    margin-bottom: 30px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>