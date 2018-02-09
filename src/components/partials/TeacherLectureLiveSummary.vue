<template>
  <div>
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
      <el-button type="primary" size="medium">
        집중도순
      </el-button>
      <el-button type="primary" size="medium">
        참여도순
      </el-button>
      <el-button type="primary" size="medium">
        이해도순
      </el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="one_user">
          <div class="user_pic" style="background-image:url('https://khneedssleep.com:8000//uploads/student_lecture_faces/1_1_2018-02-07 04-19-47.jpg')"></div>
          <div class="user_info">
            <div class="user_name">박명욱</div>
            <div class="participation_score">참여도: 33</div>
            <div class="concentration_score">집중도: 25</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<style lang="scss" scoped>
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
  export default {
    // TODO: 전달되는 데이터 명 확인
    name: 'TeacherLectureLiveSummary',
    props: ['SummaryData'],
    methods: {
    },
  };
</script>
