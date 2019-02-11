<template>
  <div class="ts">
    <!-- TODO: translation -->
    <el-row>
      <el-col :offset="1" :span="3" style="text-align:center;"><div>수강생 평균 이해도</div></el-col>
      <el-col :span="3"><el-progress :text-inside="true" :stroke-width="20" :percentage="avg_data.avg_understanding_score"></el-progress></el-col>
      <el-col :span="4" style="text-align:center;"><div>수강생 평균 참여도</div></el-col>
      <el-col :span="3"><el-progress :text-inside="true" :stroke-width="20" :percentage="avg_data.avg_participation_score" status="success"></el-progress></el-col>
      <el-col :span="4" style="text-align:center;"><div>수강생 평균 집중도</div></el-col>
      <el-col :span="3"><el-progress :text-inside="true" :stroke-width="20" :percentage="avg_data.avg_concentration_score" status="success"></el-progress></el-col>
      <el-col :span="3" style="text-align:right;">
        <i class="el-icon-close" @click="onClick('CLOSE_STATUSBAR')" />
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" size="medium" @click="onClick('GET_LECTURE_SCORE_ORDER_BY_CONCENTRATION')">
        집중도순
      </el-button>
      <el-button type="primary" size="medium" @click="onClick('GET_LECTURE_SCORE_ORDER_BY_PARTICIPATION')">
        참여도순
      </el-button>
      <el-button type="primary" size="medium" @click="onClick('GET_LECTURE_SCORE_ORDER_BY_UNDERSTANDING')">
        이해도순
      </el-button>
    </el-row>
    <el-row :gutter="20" id="student_score">
      <el-col :span="3" v-for="(item, index) in forLoopData" :key="index">
        <div class="one_user">
          <div class="user_pic" v-bind:style='{ backgroundImage: "url(" + item.latest_pic_path + ")", }'></div>
          <div class="user_info">
            <div class="user_name">{{item.name}}</div>
            <div class="participation_score">참여도: {{item.participation_score}}</div>
            <div class="concentration_score">집중도: {{item.concentration_score}}</div>
            <div class="concentration_score">이해도: {{item.understanding_score}}</div>
            <div class="face_auth">본인여부: {{item.face_auth}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
  .el-progress-bar__innerText {
    color:#000000;
  }
  .el-row {
    margin-bottom: 20px;
    padding-left:30px;
    padding-right:30px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .one_user {
    width:100px;
    height:200px;
    margin: 0 auto;
    padding:10px 10px 10px 10px;
    text-align:center;
  }
  .user_pic {
    width:100%;
    height:100px;
    background-size:cover;
    border-radius:50%
  }
  .user_info {
    padding-top:10px;
    font-size:12px;
  }
  .select_btn{
    width: 100px;
    height: 50px;
    background-color: #ff7c25;
    display: -webkit-box;
    -webkit-box-align: center;
    float: left;
    margin-right: 20px;
    -webkit-box-pack: center;
  }

</style>
<script>
  // import realtimeLectureService from '../../services/realtimeLectureService';
  import { EventBus } from '../../event-bus';

  export default {
    // TODO: 전달되는 데이터 명 확인
    name: 'TeacherLectureLiveSummary',
    props: ['SummaryData', 'lectureId'],
    data() {
      return {
        forLoopData: null,
        loopInterval: 0,
        avg_data: {
          avg_concentration_score: 0,
          avg_participation_score: 0,
          avg_understanding_score: 0,
        },
      };
    },
    async mounted() {
      const vm = this;
      EventBus.$on('makeSummary', vm.tm);
      /*
      vm.$socket.on('GET_REALTIME_STAT', (msg) => {
        const jsonMSG = JSON.parse(msg);
        vm.avg_data = {
          avg_concentration_score: Number(jsonMSG[0].avg_concentration_score.toFixed(1)),
          avg_participation_score: Number(jsonMSG[0].avg_participation_score.toFixed(1)),
          avg_understanding_score: Number(jsonMSG[0].avg_understanding_score.toFixed(1)),
        };
      }); */
    },
    destroyed() {
      const vm = this;
      clearInterval(vm.loopInterval);
    },
    computed: {

    },
    methods: {
      async getLectureStat() {
        const vm = this; // eslint-disable-line
        // 아직 수정 X. 추후에 수정할 것
        try {
          /*
          const lectureData = await realtimeLectureService.getStudentLectureLog({
            lectureId: vm.lectureId, opt: vm.opt,
          });
          for (let i = 0; i < lectureData.data.length; i += 1) {
            // eslint-disable-next-line
            lectureData.data[i].latest_pic_path = '"'+ lectureData.data[i].latest_pic_path + '"';
            // eslint-disable-next-line
          }

          vm.forLoopData = lectureData.data; */
        } catch (e) {
          throw new Error('request error');
        }
      },
      tm(data) {
        const vm = this;
        // 서버에서 넘어온 값으로 그래프 그리기
        if (data[0] === 'ud') {
          vm.avg_data.avg_understanding_score = data[1];
        } else if (data[0] === 'cc') {
          vm.avg_data.avg_concentration_score = data[1];
        } else if (data[0] === 'pp') {
          vm.avg_data.avg_participation_score = data[1];
        }
      },
      onClick(type) {
        const vm = this;
        switch (type) {
          case 'GET_LECTURE_SCORE_ORDER_BY_CONCENTRATION': {
            // vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 0;
            clearInterval(vm.loopInterval);
            vm.loopInterval = setInterval(vm.getLectureStat, 10000);
            break;
          }
          case 'GET_LECTURE_SCORE_ORDER_BY_PARTICIPATION': {
            // vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 1;
            clearInterval(vm.loopInterval);
            vm.loopInterval = setInterval(vm.getLectureStat, 10000);
            break;
          }
          case 'GET_LECTURE_SCORE_ORDER_BY_UNDERSTANDING': {
            // vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 2;
            clearInterval(vm.loopInterval);
            vm.loopInterval = setInterval(vm.getLectureStat, 10000);
            break;
          }
          case 'CLOSE_STATUSBAR': {
            break;
          }
          default: {
            break;
          }
        }
      },
    },
  };
</script>
