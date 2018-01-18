<template>
  <div id="landing_page_wrapper">
    <resize-observer @notify="handleResize" />
    <el-container class="container" id="landing_page_container">
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            영상 썸네일
            <div class="image-wrapper">
              <img src="../../assets/dev/ratio_4_3.png">
            </div>
          </el-col>
        </el-row>

        <!-- TODO: translation -->
        <div class="">인기 강의 목록<hr></div>
        <el-row :gutter="20" >
          <template v-for="(item, index, key) in popularClassList">
            <el-col :key="key" :span="Math.ceil(24 / elementNumber)" v-if="index < elementNumber">
              {{ item.className }}
              <div class="image-wrapper">
                <img src="../../assets/dev/ratio_16_10.png">
              </div>
            </el-col>
          </template>
        </el-row>

        <!-- TODO: translation -->
        <div class="">내 수강 통계<hr></div>
        <el-row type="flex" justify="center">
          <el-col>
            <div class="grid-content bg-white">통계</div>
          </el-col>
        </el-row>

        <!-- TODO: translation -->
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
import deepEqual from 'deep-equal';
import studentService from '../../services/studentService';

export default {
  name: 'Home',
  data() {
    const vm = this;
    // * Restore previous popularClassList
    vm.$vlf.getItem('popularClassList')
      .then((res) => {
        if (!res) {
          return;
        }
        vm.popularClassList = res;
        vm.handleResize();
      });
    return {
      popularClassList: [],
      elementNumber: 3,
      elmenetwidthPixel: 300,
    };
  },
  methods: {
    handleResize() {
      const vm = this;
      const width = document.getElementById('landing_page_wrapper').offsetWidth;
      const el = vm.getElementNum(width);
      if (vm.elementNumber !== el) {
        vm.elementNumber = el;
        document.getElementById('landing_page_container').style.width = el * vm.elmenetwidthPixel + 'px'; // eslint-disable-line
      }
      // window.console.log('width', width, 'el', el, 'vm_el', vm.elementNumber);
      return width;
    },
    getElementNum(width) {
      const vm = this;
      const px = vm.elmenetwidthPixel;
      if (width <= px * 3) {
        return 2;
      } else if (width <= px * 4) {
        return 3;
      }
      return 4;
    },
  },
  async mounted() {
    const vm = this;
    const res = await studentService.fetchPopularClassList();
    // * If fetched popularClassList is different from stored one, replace it
    if (deepEqual(res, vm.popularClassList)) {
      return;
    }
    vm.popularClassList = res;
    vm.$vlf.setItem('popularClassList', res);
    vm.handleResize();
  },
};
</script>


<style scoped>
  .container {
    min-width: 500px;
    margin: auto;
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
    border: rgb(20, 41, 87) solid 2px;
    padding: 10px;
    min-height: 200px;
    width: 500px;
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

  .image-wrapper {
    position: relative;
    padding-bottom: 56.25%;
  }

  .image-wrapper img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>