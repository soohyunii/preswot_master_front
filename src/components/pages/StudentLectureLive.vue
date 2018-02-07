<template>
  <div>
    <el-container>
      <el-aside width="100px"></el-aside>
      <el-main>
        <!-- TODO: translation -->
        자바 4강(배열)<hr>
        <el-row>
          <el-col :span="24" v-if="!isCloseMovie">
            <!-- TODO: translation -->
            <el-row class="video">
              <el-col :span="12" :offset="6">
                <video controls width=100% poster="../../assets/test.jpg">
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                </video>
              </el-col>
              <el-col :span="6">
                <i class="el-icon-circle-close" @click="onClick('CLOSE_MOVIE')" style="color:#dee2e8; vertical-align:top; font-size:30px;"/>
              </el-col>
              <el-col :span="6">
                <i class="el-icon-upload2" @click="onClick('POPUP_MOVIE')" style="color:#dee2e8; vertical-align:top; font-size:30px;"/>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <br /><br />
        <el-row>
          <el-col :span="isCloseMovie ? 24 : 12">
            <!-- TODO: translation -->
            <div>문제가 들어가는 공간<hr></div>
          </el-col>
          <el-col :span="12">
            <!-- TODO: translation -->
            <div>설문이 들어가는 공간<hr></div>
          </el-col>
          <el-col :span="12">
            <!-- TODO: translation -->
            <div>강의자료<hr></div>
          </el-col>
        </el-row>
        <el-row>
          <div class="statusbar" v-if="!isCloseStatusbar">
            <student-lecture-live-summary :SummaryData="SummaryData" />
            <el-col :span="5" style="text-align:right;">
              <i class="el-icon-close" @click="onClick('CLOSE_STATUSBAR')" />
            </el-col>
          </div>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import StudentLectureLiveSummary from '../partials/StudentLectureLiveSummary';

export default {
  name: 'StudentLectureLive',
  components: {
    StudentLectureLiveSummary,
  },
  data() {
    return {
      isCloseMovie: false,
      isCloseStatusbar: false,
      SummaryData: [],
    };
  },
  methods: {
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'CLOSE_MOVIE': {
          vm.isCloseMovie = true;
          break;
        }
        case 'CLOSE_STATUSBAR': {
          vm.isCloseStatusbar = true;
          break;
        }
        case 'POPUP_MOVIE': {
          window.open('https://www.w3schools.com/html/mov_bbb.mp4', '_blank', 'location=0');
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.statusbar {
   position:fixed;
   left:0px;
   bottom:0px;
   width:100%;
   padding: 8px 0px 5px 0px;
   background:rgba(0, 0, 0, 0.6);
   color: white;
}
.video {
  background-color: black;
  min-height: 100px;
}
</style>