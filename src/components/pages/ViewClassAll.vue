<template>
  <div id="class_index_wrapper" class="bt-container">
  	<div h2 class="page-title"> 조회하기 > <router-link :to="`/a/view/class`">과목</router-link> > 상세보기</div>
  	<div class="profile">
  	  <img src="../../assets/profi.png">
  	  <div class="class_detail">
  	  	<div class="detail_top" v-model="class_name" :list="list"> 과목명 : {{list.name}} </div>
        <div class="detail_isActive" v-if="isActive==true"> 현재 비활성화 과목입니다 </div>
  	  	<!-- <br/><br/> -->
  	  	<div class="detail" v-if="isActive==false" v-model="teacher_name" :list="list"> 강사명 : {{list.teacher_email_id}} </div>
  	  	<!-- <br/><br/> -->
  	  	<div class="detail" v-if="isActive==false" v-model="capacity" :list="list"> 정원 : {{list.capacity}} 명</div>
  	  	<!-- <br/><br/> -->
        <div class="detail_horizon" v-if="isActive==false" v-model="start_date" :list="list">강의날짜 : {{list.start_date}}  ~ </div> <div class="detail_horizon2" v-model="end_date" :list="list"> {{list.end_date}} </div>
  	  	<!-- <br/><br/> -->
  	  	<div class="detail_horizon3" v-if="isActive==false" v-model="start_time" :list="list">강의시간: {{list.start_time}}  ~ </div> <div class="detail_horizon4" v-model="end_time" :list="list">
        {{list.end_time}}</div>
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
import {mapActions, mapState} from 'vuex';
import utils from '../../utils';
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
	data(){
		return {
			list: [],
      classes:[],
      lecture:[],
      student:[],
      buttonType:'',
      class_name:'',
      teacher_name:'',
      capacity:0,
      start_date:new Date(),
      end_date:new Date(),
      start_time:'',
      end_time:'',
      location:'',
      isActive:true,
		};
	},
  computed: {
    classId(){
      const vm=this;
      return vm.$route.path.split('view/')[1].split('/detail')[0];
    },

  },
  async mounted(){
    const vm=this;
    const class_id = vm.classId;
    console.log('class_id란?==========',class_id);
    const res = await masterService.getMasterClass({class_id:class_id});
    console.log('res.data=============!!!!',res.data);
    vm.list=res.data;
    if(res.data.isActive==false){
      vm.isActive=false;
    } else {
      vm.isActive=true;
    }
  },
	methods: {
		/*classes: function(){
		return {
			classes: true,
			lecture: false,
			student: false,
			list: [],
			}
		},
		lecture: function() {
		return {
			classes: false,
			lecture: true,
			student: false,
			list: [],
			}	
		},
		student: function(){
		return {
			classes: false,
			lecture: false,
			student: true,
			list: [],
			}
	    },*/	
    classOnChange: function(){
      const vm=this;
      /*if(vm.buttonType==='classOnChange'){
        vm.buttonType='classOnChange'
        console.log('classOnChange');
      } else if(vm.buttonType==='lectureOnChange'){
        vm.buttonType='lectureOnChange'
        console.log('1111111111111');
      } else {
        vm.buttonType='studentOnChange'
        console.log('2222222222222222');
      }*/
      vm.buttonType='classOnChange';
	  },
    lectureOnChange: function(){
      const vm=this;
      vm.buttonType='lectureOnChange';
    },
    studentOnChange: function(){
      const vm=this;
      vm.buttonType='studentOnChange';
    },
    /*funcRef(){
      window.addEventListener("hashchange", funcRef, false);
      console.log('change!');
    }*/
  },
  /*window.onpageshow = function(event){
    if(event.persisted){
      console.log('change back');
    }
  }*/
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
    /*border:1px solid blue;*/
  }
  .profile img {
  	position:relative;
    margin:0px;
  	/*margin: 50px 50px 10px 30px;
  	border: 1px solid red;*/
  }
  .profile .class_detail {
  	position: absolute;
  	width: 550px;
  	float:right;
  	margin: 0px 150px 100px 0;
  	/*border:1px solid blue;*/
    top:110px;
    left:280px;
  }
  .right-align {
    /*border:1px solid blue;*/	
    position:relative;
    margin: 150px 0 0 0;
  }
  .table-name {
  	margin: 20px 0 0 0;
  }
  .detail_top{
    margin-bottom:5px;
    width:470px;
    /*border:1px solid black;*/
  }
  .detail{
    /*position: relative;*/
    /*border:1px solid red;*/
    margin-top:5px;
    width:470px;
    margin-bottom:5px;
  }
  .detail_horizon{
    /*position: relative;
    top: 0px;
    left: 70px;*/
    /*border:1px solid red;*/
    margin-top:5px;
    width:300px;
    margin-bottom:5px;
  }
  .detail_horizon2{
    position: relative;
    top: -23px;
    left: 170px;
    /*border:1px solid green;*/
    width:150px;
    // margin-bottom:5px;
    /*margin-top:5px;
    width:470px;*/
  }
  .detail_horizon3{
    /*position: relative;
    top:-50px;*/
    /*border:1px solid red;*/
    margin-top:-15px;
    width:470px;
    margin-bottom:5px;
  }
  .detail_horizon4{
    position:relative;
    top:-23px;
    left:125px;
    width:100px;
    // margin-bottom:5px;
    /*border:1px solid red;*/
  }
  .detail_bottom{
    margin-top:-15px;
  }
  .detail_isActive{
    margin-top: 30px;
    font-size: 1.5em;
  }
}
</style>