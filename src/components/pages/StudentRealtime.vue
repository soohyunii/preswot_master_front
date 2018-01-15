<template>
    <div>
        <el-container>
            <el-aside width="100px"></el-aside>
            <el-main>
                <!-- TODO: translation -->
                자바 4강(배열)<hr>
                <el-row>
                    <el-col :span="12" v-if="!isClose">
                        <!-- TODO: translation -->
                        <div>
                            영상이 들어가는 공간(팝업버튼)
                            <el-button @click="onClick('CLOSE')">X</el-button>
                        </div>
                    </el-col>
                    <el-col :span="isClose ? 24 : 12">
                        <!-- TODO: Get SummaryData from dummy -->
                       <student-realtime-summary :SummaryData="SummaryData"></student-realtime-summary>
                    </el-col>
                </el-row>
                <br /><br />
                <el-row>
                    <el-col :span="12">
                        <!-- TODO: translation -->
                        <div>문제가 들어가는 공간<hr></div>
                    </el-col>
                    <el-col :span="12">
                        <!-- TODO: translation -->
                        <div>강의자료<hr></div>
                    </el-col>
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
      isClose: false,
      SummaryData: [],
    };
  },
  methods: {
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'CLOSE': {
          vm.isClose = true;
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
