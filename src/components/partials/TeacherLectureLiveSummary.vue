<template>
  <div class="ts">
    <!-- TODO: translation -->
    <el-row>
      <el-col :offset="6" :span="2" style="text-align:center;"><div>수강생 평균 집중도</div></el-col>
      <el-col :span="4"><el-progress :text-inside="true" :stroke-width="20" :percentage="70"></el-progress></el-col>
      <el-col :span="3" style="text-align:center;"><div>수강생 평균 참여도</div></el-col>
      <el-col :span="4"><el-progress :text-inside="true" :stroke-width="20" :percentage="100" status="success"></el-progress></el-col>
      <el-col :span="5" style="text-align:right;">
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
      <el-col :span="3" v-for="item in forLoopData">
        <div class="one_user">
          <div class="user_pic" v-bind:style='{ backgroundImage: "url(" + item.latest_pic_path + ")", }'></div>
          <div class="user_info">
            <div class="user_name">{{item.name}}</div>
            <div class="participation_score">참여도: {{item.participation_score}}</div>
            <div class="concentration_score">집중도: {{item.concentration_score}}</div>
            <div class="concentration_score">이해도: {{item.understanding_score}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .ts{
    background:rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 0px 5px 0px;
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
  import realtimeLectureService from '../../services/realtimeLectureService';


  export default {
    // TODO: 전달되는 데이터 명 확인
    name: 'TeacherLectureLiveSummary',
    props: ['SummaryData', 'lectureId'],
    data() {
      return {
        forLoopData: null,
        loopInterval: 0,
      };
    },
    methods: {
      async getLectureStat() {
        const vm = this;
        try {
          var lectureData = await realtimeLectureService.getStudentLectureLog({
            lectureId: vm.lectureId, opt: vm.opt,
          });
          for (var i = 0; i < lectureData.data.length; i += 1) {
            // eslint-disable-next-line
            lectureData.data[i].latest_pic_path = '"'+ lectureData.data[i].latest_pic_path + '"';
            // eslint-disable-next-line
            console.log(lectureData.data[i].latest_pic_path);
          }

          vm.forLoopData = lectureData.data;
        } catch (e) {
          throw new Error('request error');
        }
      },
      onClick(type) {
        const vm = this;
        switch (type) {
          case 'GET_LECTURE_SCORE_ORDER_BY_CONCENTRATION': {
            //vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 0;
            vm.getLectureStat();
            break;
          }
          case 'GET_LECTURE_SCORE_ORDER_BY_PARTICIPATION': {
            //vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 1;
            vm.getLectureStat();
            break;
          }
          case 'GET_LECTURE_SCORE_ORDER_BY_UNDERSTANDING': {
            //vm.lectureId = 1; // 강의 아이디를 여기에다가 넣어야됨
            vm.opt = 2;
            vm.getLectureStat();
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
