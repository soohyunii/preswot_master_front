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
                        <div>
                            영상이 들어가는 공간(팝업버튼)
                            <el-button @click="onClick('CLOSE_MOVIE')">X</el-button>
                        </div>
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
                    <div id="footer" v-if="!isCloseFooter">
                        <student-realtime-summary :SummaryData="SummaryData"></student-realtime-summary>
                        <el-col :span="5" style="text-align:right;">
                            <i class="el-icon-close" @click="onClick('CLOSE_FOOTER')"></i>
                        </el-col>
                    </div>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import StudentRealtimeSummary from '../partials/StudentRealtimeSummary';

export default {
  name: 'StudentRealtime',
  components: {
    StudentRealtimeSummary,
  },
  data() {
    return {
      isCloseMovie: false,
      isCloseFooter: false,
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
        case 'CLOSE_FOOTER': {
          vm.isCloseFooter = true;
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

<style scoped>
#footer {
   position:fixed;
   left:0px;
   bottom:0px;
   height: 40px;
   width:100%;
   background:rgba(0, 0, 0, 0.5);
   color: white;
}
</style>