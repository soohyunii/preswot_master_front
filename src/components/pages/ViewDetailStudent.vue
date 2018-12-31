<template>
  <div id="class_index_wrapper" class="bt-container">
  	<div h2 class="page-title"> 조회하기 > 과목및강의 > 상세보기</div>
  	<div class="profile">
  	  <!-- <img src="../../assets/profi.png"> -->
  	  <div class="class_detail">
  	  	<!-- <div class="detail_top" v-model="ID" :list="list"> ID : {{list.name}} </div> --> 
  	  	<!-- <br/><br/> -->
  	  	<div class="detail_top" v-model="name" :list="list"> 학생이름 : {{list.name}} </div>
  	  	<!-- <br/><br/> -->
  	  	<div class="detail" v-model="sex" :list="list"> 성별 : {{list.sex}} </div>
  	  	<!-- <br/><br/> -->
        <div class="detail" v-model="birth" :list="list">생년월일 : {{list.birth}}  </div> 
  	  	<!-- <br/><br/> -->
  	  	<div class="detail" v-model="university_name" :list="list">대학: {{list.university_name}} </div> 
        <div class="detail" v-model="department_name" :list="list">학과 : {{list.department_name}} </div>
        <div class="detail_top" v-model="address" :list="list">주소 : {{list.address}} </div>
        <div class="detail" v-model="email_id" :list="list">이메일 : {{list.email_id}} </div>
        <div class="detail" v-model="phone" :list="list">핸드폰번호 : {{list.phone}} </div>
        <div class="detail" v-model="account_number" :list="list">계좌번호 : {{list.account_number}} </div>
        <div class="detail" v-model="account_bank" :list="list">계좌은행 : {{list.account_bank}} </div>
  	  </div>
  	</div>
  	<!-- <div class="right-align">
        <el-button  type="primary" v-on:click="classOnChange" style="width: 32%">
          <div class="right-align-btn-layer">과목 이해도/집중도/참여도</div>
        </el-button>
        <el-button type="primary" v-on:click="lectureOnChange" style="width: 32%">
          <div class="right-align-btn-layer">강의별 이해도/집중도/참여도</div>
        </el-button>
        <el-button type="primary" v-on:click="studentOnChange" style="width: 32%">
          <div class="right-align-btn-layer">수강학생 조회</div>
        </el-button>
  	</div> -->
    <div class="table-name">
      <!-- <template v-if="buttonType==='classOnChange'">  -->
        <master-student-score-detail
        :list="list"
        />
      <!-- </template> -->
  	  <!-- <template v-else-if="buttonType==='lectureOnChange'"> 
  	  	<master-lecture-all-table
  	    :list="lecture"
  	    />
  	  </template>  	  
  	  <template v-else="buttonType==='studentOnChange'"> 
  	  	<master-student-all-table
  	    :list="student"
  	    />
  	  </template> -->
  	</div>
  </div>	

</template>

<script>
import {mapActions, mapState} from 'vuex';
import utils from '../../utils';
/*import MasterClassAllTable from '../partials/MasterClassAllTable';	
import MasterStudentAllTable from '../partials/MasterStudentAllTable';
import MasterLectureAllTable from '../partials/MasterLectureAllTable';*/
import MasterStudentScoreDetail from '../partials/MasterStudentScoreDetail';
import masterService from '../../services/masterService';

export default {
	name: 'ViewDetailStudent',
	components: {
		/*MasterClassAllTable,
		MasterStudentAllTable,
		MasterLectureAllTable,*/
    MasterStudentScoreDetail,
	},
	data(){
		return {
			list: [],
      name:null,
      sex:null,
      birth:new Date(),
      university_name:'',
      department_name:'',
      address:'',
      email_id:'',
      phone:'',
      account_number:'',
      account_bank:'',
/*      classes:[],
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
      location:'',*/
		};
	},
  computed: {
    classId(){
      const vm=this;
      return vm.$route.path.split('student/')[1].split('/detail')[0];
    },

  },
  async mounted(){
    const vm=this;
    const class_id = vm.classId;
    console.log('class_id란?==========',class_id);
    const res = await masterService.getMasterUser({email_id:class_id});
    console.log('res.data=============!!!!',res.data);
    vm.list=res.data;
    //console.log(vm.list.sex);
    if(vm.list.sex==1){
      vm.list.sex="남자"
    } else {
      vm.list.sex="여자"
    }
    if(vm.list.birth.indexOf("T")!=-1){
      console.log(vm.list.birth.indexOf("T"));
      vm.list.birth=vm.list.birth.split("T")[0];
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
  	width: 700px;
    height:150px;
  	float:right;
  	margin: 0px 150px 100px 0;
  	// border:1px solid blue;
    top:110px;
    left:40px;
    column-count: 2;
  }
  .right-align {
    /*border:1px solid blue;*/	
    position:relative;
    margin: 150px 0 0 0;
  }
  .table-name {
    position:relative;
    top:100px;
  	margin: 20px 0 0 0;
    //border:1px solid red;
  }
  .detail_top{
    margin-top: 0px;
    margin-bottom:5px;
    width:470px;
    /*border:1px solid black;*/
  }
  .detail{
    /*position: relative;*/
    /*border:1px solid red;*/
    margin-top:8px;
    width:470px;
    margin-bottom:8px;
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
    left: 285px;
    /*border:1px solid green;*/
    width:250px;
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
    left:280px;
    width:300px;
    // margin-bottom:5px;
    // border:1px solid red;
  }
  .detail_bottom{
    margin-top:-15px;
  }
}
</style>