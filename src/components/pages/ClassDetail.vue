<template>
  <div class="bt-container">
    <div class="wrapper"> <!-- position:absolute의 부모가 되기 위해 relative 속성 부여 -->
      <img class="opac" :src="require('@/assets/study01.jpg')" height="500" width="100%">
      <div class="class-title-info">
        <div class="left">
          <div class="top">
            {{classes.name}}
          </div>
          <div class="bottom">
            {{classes.master.name}}
          </div>
        </div>
        <div class="right">
          <!-- <el-button disabled>수강하기</el-button> -->
          <el-button>수강하기</el-button>
        </div>
      </div>
    </div>

   <!--  <div class="bt-container"> --><!-- sh change -->
    <div class="wrapper">
      <div class="wrapper-box" id = "teacher-info">
        <div class="top semi-title-font">
          강사 소개
        </div>
        <div class="bottom">
          <div class="left">
            <img :src="require('@/assets/profi.png')" class="profile-pic">
          </div>
          <div class="right">
            {{classes.lecturer_description}}
          </div>
        </div>
      </div>
      <div class="wrapper-box" id = "class-info">
        <div class="wrapper-box-row semi-title-font">강의 상세 소개
        </div>

        <!-- sh : 강의 상세 소개에 이미지가 필요한가? -->
        <!-- <div class="wrapper-box-row">
          <img :src="require('@/assets/test.jpg')" height="300" width="100%">
        </div> -->
        <!-- sh e -->
        <div class="wrapper-box-row">
          {{classes.description}}
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import classService from '../../services/classService';

export default {
  name: 'ClassDetail',
  components: {
  },
  async mounted() {
    const vm = this;
    const b = {
      id: Number.parseInt(vm.$route.params.classId, 10),
    };
    const a = await classService.getClass(b);
    if (a.data.master.user_profile === null) {
      a.data.master.user_profile = {};
      a.data.master.user_profile.client_path = '';
    }
    vm.classes = a.data;
  },
  computed: {
  },
  data() {
    return {
      classes: {
        name: null,
        master: {
          name: null,
          user_profile: {
            client_path: '',
          },
        },
      },
    };
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.bt-container {
  position: relative;
}
.class-title-info {
  position:absolute;
  top: 0px;
  width: 97.5%;
  height: 500px;
}
.class-title-info .left {
  position: absolute;
  left: 46.5%;
  width: 50%;
  font-size: 21px;
}
.class-title-info .left .top {
  position: absolute;
  top: 100px;
  font-size:2em;
  font-weight:300px;
  /* border:1px solid black; */
}
.class-title-info .left .bottom {
  position: absolute;
  top: 190px;
  /* border:1px solid green; */
}
.class-title-info .right {
  position: absolute;
  right: 37.5%;
  top: 350px;
  /* border:1px solid red; */
}


.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.semi-title-font {
  font-size: 22px;
}
.wrapper-box {
  background-color: #ffffff;
  padding: 25px;
}

/* sh s*/
.opac{
  opacity:0.65;
}

.right .el-button{
  /* border:1px solid red; */
  width: 300px;
  height: 50px;
  border-radius: 20px;
  background-color: #1989fa;
  color:#ffffff;
  font-size:1.2em;

}

.right .el-button:hover{
  /* opacity:0.8; */
  /* box-shadow: 10px black; */
  background-color: rgba(0,0,0,0.2);
}

/* sh e */

#teacher-info {
  margin-top: 30px;
}
#teacher-info .top {
  margin-bottom: 30px;
}
#teacher-info .bottom .left {
  width: 15%;
  display: inline-block;
}
#teacher-info .bottom .right {
  display: inline-block;
}
#class-info {
  margin-top: 60px;
}
#class-info .wrapper-box-row {
  margin-bottom: 30px;
}
</style>
