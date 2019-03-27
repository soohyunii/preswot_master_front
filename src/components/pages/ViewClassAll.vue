<template>
  <div id="class_index_wrapper" class="bt-container">
  	<div h2 class="page-title"> 조회하기 > <router-link :to="`/a/view/class`">과목</router-link> > 상세보기</div>
  	<div class="profile">
  	  <img src="../../assets/profi.png">
  	  <div class="class_detail">
  	  	<div class="detail_top" v-model="class_name" :list="list"> 과목명 : {{list.name}} </div>
        <div class="detail_isActive" v-if="isActive==true"> 현재 비활성화 과목입니다 </div>
  	  	<div class="detail" v-if="isActive==false" v-model="main_teacher_name" :list="list"> 강사명 : {{main_teacher_name}} </div>
        <div class="detail2" v-if="isActive==false"> 부강사 : </div>
          
          <!-- <div class="sub_detail" v-model="userArray" v-for="sub_user in list.user_classes">{{sub_user.user.name}}</div> -->
          <div class="sub_detail" v-model="userArray" v-for="sub_user in list.user_classes">
            <span v-if="userArray !== []">{{sub_user.user.name}}</span>
          </div>
          
  	  	<div class="detail_horizon3" v-if="isActive==false" v-model="capacity" :list="list"> 정원 : {{list.capacity}} 명</div>
        <div class="detail_horizon" v-if="isActive==false" v-model="start_date" :list="list">강의날짜 : {{list.start_date}}  ~ </div> <div class="detail_horizon2" v-model="end_date" :list="list"> {{list.end_date}} </div>
  	  	<!-- <div class="detail_horizon3" v-if="isActive==false" v-model="start_time" :list="list">강의시간: {{list.start_time}}  ~ </div> <div class="detail_horizon4" v-model="end_time" :list="list">
        {{list.end_time}}</div> -->
        <div class="detail_bottom" v-if="isActive==false" v-model="location" :list="list"> 공간 : {{list.location}} </div>
  	  </div>
  	</div>
  	<div class="right-align">
        <el-button v-if="isActive==false" type="primary" v-on:click="classOnChange" style="width: 32%">
          <div class="right-align-btn-layer">과목 이해도/집중도/참여도</div>
        </el-button>
        <el-button v-if="isActive==false" type="primary" v-on:click="lectureOnChange" style="width: 32%">
          <div class="right-align-btn-layer">강의별 이해도/집중도/참여도</div>
        </el-button>
        <el-button v-if="isActive==false" type="primary" v-on:click="studentOnChange" style="width: 32%">
          <div class="right-align-btn-layer">수강학생 조회</div>
        </el-button>

        <el-button v-if="isActive==true" type="primary" v-on:click="classOnChange" style="width: 32%" disabled>
          <div class="right-align-btn-layer">과목 이해도/집중도/참여도</div>
        </el-button>
        <el-button v-if="isActive==true" type="primary" v-on:click="lectureOnChange" style="width: 32%" disabled>
          <div class="right-align-btn-layer">강의별 이해도/집중도/참여도</div>
        </el-button>
        <el-button v-if="isActive==true" type="primary" v-on:click="studentOnChange" style="width: 32%" disabled>
          <div class="right-align-btn-layer">수강학생 조회</div>
        </el-button>
  	</div>
    <div class="table-name" v-if="isActive==false">
      <template v-if="buttonType==='classOnChange'"> 
        <master-class-all-table
        :list="classes"
        />
      </template>
  	  <template v-else-if="buttonType==='lectureOnChange'"> 
  	  	<master-lecture-all-table
  	    :list="lecture"
  	    />
  	  </template>  	  
  	  <template v-else="buttonType==='studentOnChange'"> 
  	  	<master-student-all-table
  	    :list="student"
        v-if="buttonShow==false"
  	    />
        <div class="center-align" v-if="buttonShow==true">조회 할 학생이 없습니다</div>
        <el-button class="center-align-btn" v-if="buttonShow==true" v-on:click="mappingChange">
          <div>학생-과목 매핑하기</div>
        </el-button>
  	  </template>
  	</div>
    <div class="table-name" v-if="isActive==true">
      <template v-if="buttonType==='classOnChange'"> 
        <master-class-all-table
        :list="classes"
        disabled
        />
      </template>
      <template v-else-if="buttonType==='lectureOnChange'"> 
        <master-lecture-all-table
        :list="lecture"
        disabled
        />
      </template>     
      <template v-else="buttonType==='studentOnChange'"> 
        <master-student-all-table
        :list="student"
        disabled
        />
      </template>
    </div>
  </div>	

</template>

<script>
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable camelcase */
import MasterClassAllTable from '../partials/MasterClassAllTable';
import MasterStudentAllTable from '../partials/MasterStudentAllTable';
import MasterLectureAllTable from '../partials/MasterLectureAllTable';
import masterService from '../../services/masterService';

export default {
  name: 'ViewClassAll',
  components: {
    MasterClassAllTable,
    MasterStudentAllTable,
    MasterLectureAllTable,
  },
  data() {
    return {
      list: [],
      classes: [],
      lecture: [],
      student: [],
      buttonType: '',
      class_name: '',
      main_teacher_name: '',
      sub_teacher_name: '',
      capacity: 0,
      start_date: new Date(),
      end_date: new Date(),
      start_time: '',
      end_time: '',
      location: '',
      isActive: true,
      buttonShow: false,
      userArray: [],
    };
  },
  computed: {
    classId() {
      const vm = this;
      return vm.$route.path.split('view/')[1].split('/detail')[0];
    },
  },
  async mounted() {
    const vm = this;
    const class_id = vm.classId;
    const userArray = [];
    const res = await masterService.getMasterClass({ class_id });
    vm.list = res.data;
    if (res.data.isActive === false) {
      vm.isActive = false;
      if (res.data.user_classes.length !== 0) {
        for (let i = 0; i < res.data.user_classes.length; i += 1) {
          if (res.data.user_classes[i].user.email_id === res.data.master.email_id) {
            vm.main_teacher_name = res.data.user_classes[i].user.name;
            res.data.user_classes.splice(i, 1);
          } else {
            userArray[i] = res.data.user_classes[i].user.email_id;
          }
        }
      }
    } else {
      vm.isActive = true;
    }
  },
  methods: {
    async classOnChange() {
      const vm = this;
      vm.buttonType = 'classOnChange';
      console.log(vm.userArray);
    },
    async lectureOnChange() {
      const vm = this;
      vm.buttonType = 'lectureOnChange';
    },
    async studentOnChange() {
      const vm = this;
      vm.buttonType = 'studentOnChange';
      if (vm.student.length === 0) {
        vm.buttonShow = true;
      }
    },
    async mappingChange(class_id) {
      const vm = this;
      console.log('현재 과목이 어느대학, 어느 학과에 소속되어 있는지를 가져와 아래 메시지창에 띄운다.');
      class_id = 7;
      const res = await masterService.getMasterClass({ class_id });
      const uniName = res.data.university_name;
      const deptName = res.data.department_name;
      vm.$confirm(`${uniName} ${deptName} 학과 학생들과 매핑하겠습니까?`, undefined, {
        confirmButtonText: '예, 매핑하겠습니다',
        cancelButtonText: '아니오, 매핑하지 않겠습니다',
        type: 'warning',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#class_index_wrapper {
  .page-title{
  	position:relative;
    float:left;
    width:1000px;
    height: 24px;

    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;

    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;
  }
  .profile {
  	position: relative;
  	width:180px;
  	height:200px;
  	top: 20px;
  	left:270px;
  }
  .profile img {
  	position:relative;
    margin:0px;
  }
  .profile .class_detail {
  	position: absolute;
  	width: 550px;
  	float:right;
  	margin: 0px 150px 100px 0;
    top:110px;
    left:280px;
  }
  .right-align {	
    position:relative;
    margin: 150px 0 0 0;
  }
  .table-name {
  	margin: 20px 0 0 0;
  }
  .detail_top{
    margin-bottom:5px;
    width:470px;
  }
  .detail{
    margin-top:5px;
    width:470px;
    margin-bottom:5px;
  }
  .detail_horizon{
    position: relative;
    float: left;
    width:300px;
    height: 20px;
    margin-bottom:5px;
    /*border: 1px solid blue;*/
  }
  .detail_horizon2{
    position: relative;
    float: left;
    left: -130px;
    width:150px;
    /*border: 1px solid red;*/
  }
  .detail_horizon3{
    position: relative;
    float: left;
    /*margin-top: 5px;*/
    width: 100%;
    margin-bottom:5px;
    /*border: 1px solid green;*/
  }
  .detail_horizon4{
    position:relative;
    top:-23px;
    left:125px;
    width:100px;
  }
  .detail_bottom{
    position: relative;
    float: left;
    margin-top:0px;
    width: 470px;
    /*border: 1px solid blue;*/
  }
  .detail_isActive{
    margin-top: 30px;
    font-size: 1.5em;
  }
  .center-align {
    margin: 60px 0 30px 0;
    padding: 0 0 0 45%;
  }
  .center-align-btn {
    margin: 0 0 0 40%;
    width: 22%;
  }
  .detail2 {
    margin-top:0px;
    /*width:220px;*/
    /*width: 100%;*/
    margin-bottom:5px;
    float: left;
    /*border: 1px solid blue;*/
  }
  .sub_detail {
    /*display: inline-block;
    position: relative;
    width: 30%;*/
    margin-top: 0;
    margin-left: 5px;
    float: left;
    /*border: 1px solid red;*/
  }
}
</style>