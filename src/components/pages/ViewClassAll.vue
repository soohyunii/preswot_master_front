<template>
  <div id="class_index_wrapper" class="bt-container">
  	<div h2 class="page-title"> 조회하기 > <router-link :to="`/a/view/class`">과목</router-link> > 상세보기</div>
  	<div class="profile">
  	  <img src="../../assets/profi.png">
  	  <div class="class_detail">
  	  	<div class="detail_top" v-model="class_name" :list="list"> 과목명 : {{list.name}} </div>
        <div class="detail_isActive" v-if="isActive==true"> 현재 비활성화 과목입니다 </div>
  	  	<div class="detail" v-if="isActive==false" v-model="teacher_name" :list="list"> 강사명 : {{list.teacher_email_id}} </div>
  	  	<div class="detail" v-if="isActive==false" v-model="capacity" :list="list"> 정원 : {{list.capacity}} 명</div>
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
  	    />
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
      teacher_name: '',
      capacity: 0,
      start_date: new Date(),
      end_date: new Date(),
      start_time: '',
      end_time: '',
      location: '',
      isActive: true,
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
    const res = await masterService.getMasterClass({ class_id });
    vm.list = res.data;
    if (res.data.isActive === false) {
      vm.isActive = false;
    } else {
      vm.isActive = true;
    }
  },
  methods: {
    async classOnChange() {
      const vm = this;
      vm.buttonType = 'classOnChange';
    },
    async lectureOnChange() {
      const vm = this;
      vm.buttonType = 'lectureOnChange';
    },
    async studentOnChange() {
      const vm = this;
      vm.buttonType = 'studentOnChange';
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
    margin-top:5px;
    width:300px;
    margin-bottom:5px;
  }
  .detail_horizon2{
    position: relative;
    top: -23px;
    left: 170px;
    width:150px;
  }
  .detail_horizon3{
    margin-top:-15px;
    width:470px;
    margin-bottom:5px;
  }
  .detail_horizon4{
    position:relative;
    top:-23px;
    left:125px;
    width:100px;
  }
  .detail_bottom{
    margin-top:-18px;
  }
  .detail_isActive{
    margin-top: 30px;
    font-size: 1.5em;
  }
}
</style>