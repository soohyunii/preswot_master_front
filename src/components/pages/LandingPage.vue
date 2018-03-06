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
          <template v-for="(item, index) in openedClassList">
            <el-col :key="item.class_id" :span="8" v-if="index < elementNumber">
              <class-intro-card
                :title="item.name"
                :description="item.description"
                :classId="item.class_id"
                :onClick="onClick"
                :label-span="5"
                :teacher-list="[item.master.email_id]"
                :start-date-str="formatDate(item.start_item)"
                :end-date-str="formatDate(item.end_time)"
              />
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
import { mapActions, mapState } from 'vuex';
import deepEqual from 'deep-equal';
import studentService from '../../services/studentService';
import ClassIntroCard from '../partials/ClassIntroCard';
import utils from '../../utils';

export default {
  name: 'Home',
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
  computed: {
    ...mapState('class', ['openedClassList']),
  },
  methods: {
    ...mapActions('class', [
      'getClassLists',
      'getMyClassLists',
    ]),
    formatDate: utils.formatDate,
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
            await vm.getMyClassLists();
            await vm.getClassLists();
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
  },
  async mounted() {
    const vm = this;
    const res = await studentService.fetchPopularClassList();
    await vm.getClassLists();
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