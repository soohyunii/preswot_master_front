<template>
  <div id="landing_page_wrapper">
    <resize-observer @notify="handleResize" />
    <el-container class="container" id="landing_page_container">
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            영상 썸네일
            <div class="image-wrapper">
              <img :src="require('@/assets/dev/ratio_4_3.png')">
            </div>
          </el-col>
        </el-row>

        <!-- TODO: translation -->
        <div class="">인기 강의 목록<hr></div>
        <el-row :gutter="10" >
          <template v-for="(item, index) in popularClassList">
            <el-col :key="item.class_id" :span="24/elementNumber" v-if="index < elementNumber">
              <class-intro-card
                :title="item.name"
                :description="item.description"
                :classId="item.classId"
                :onClick="onClick"
                :label-span="8"
                :teacher-list="item.teacherList"
                :start-date-str="item.startDate"
                :end-date-str="item.endDate"
              />
            </el-col>
          </template>
        </el-row>
        <br/>

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
import { mapActions } from 'vuex';
import deepEqual from 'deep-equal';
import ClassIntroCard from '../partials/ClassIntroCard';
import studentService from '../../services/studentService';

export default {
  name: 'LandingPage',
  components: {
    ClassIntroCard,
  },
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
    ...mapActions('class', ['postClassUser']),
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'APPLY': {
          try {
            await vm.postClassUser({
              classId: data,
            });
            vm.$notify({
              title: '수강 신청 요청 성공',
              message: '메세지',
              type: 'success',
            });
          } catch (error) {
            vm.$notify({
              title: '수강 신청 요청 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }

          try {
            await vm.getPopularClassList();
          } catch (error) {
            vm.$notify({
              title: '과목 목록 가져오기 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
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
    async getPopularClassList() {
      const vm = this;
      const res = await studentService.fetchPopularClassList();
      // * If fetched popularClassList is different from stored one, replace it
      if (deepEqual(res, vm.popularClassList)) {
        return;
      }
      vm.popularClassList = res;
      vm.$vlf.setItem('popularClassList', res);
    },
  },
  async mounted() {
    const vm = this;
    await vm.getPopularClassList();
    vm.handleResize();
  },
};
</script>


<style lang="scss" scoped>
  .container {
    min-width: 500px;
    margin: auto;
  }

  .bg-white {
    // background-color: red;
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