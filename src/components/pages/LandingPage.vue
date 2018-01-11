<template>
  <div>
    <el-container class="container" id="container">
      <el-main>
        <el-row type="flex" justify="center">
          <el-col align="center">
            <div class="thumbnail-content bg-film" align="center">
              영상 썸네일
            </div>
          </el-col>
        </el-row>

        <div class="">인기 강의 목록<hr></div>
        <el-row :gutter="20">
          <template v-for="(item, key) in popClasses">
            <el-col :span="4" :key="key">
              <div class="film-content bg-film">{{item.className}}</div>
            </el-col>
          </template>
        </el-row>

        <div class="">내 수강 통계<hr></div>
        <el-row type="flex" justify="center">
          <el-col>
            <div class="grid-content bg-white">통계</div>
          </el-col>
        </el-row>

        <div class="">내 과목 통계<hr></div>
        <el-row type="flex" justify="center">
          <el-col>
            <div class="grid-content bg-white">통계</div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import classService from '../../services/classService';

export default {
  name: 'Home',
  data() {
    return {
      popClasses: '',
    };
  },
  computed: {
    width() {
      window.console.log('width', document.body.scrollWidth);
      return document.body.scrollWidth;
    },
  },
  async mounted() {
    const vm = this;
    vm.popClasses = await classService.popClass();
    window.console.log(vm.popClasses);
    window.console.log(vm.width);
  },
};
</script>


<style scoped>
  .container {
    width: 90%;
    max-width: 1400px;
    min-width: 700px;
    margin: auto;
  }

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

  .bg-film {
    background-color: #C0C4CC;
  }

  .film-content {
    min-height: 150px;
    padding: 25px;
    margin-bottom: 30px;
  }

  .thumbnail-content {
    min-height: 200px;
    width: 600px;
    padding: 30px;
    margin-bottom: 30px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 200px;
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