<template>
  <div id="class_index_wrapper" class="bt-container">
  	<div h2 class="page-title"> 조회하기 > 과목및강의 > 상세보기</div>
  	<div class="profile">
  	  <img src="../../assets/profi.png">
  	  <div class="class_detail">
  	  	과목명 : 
  	  	<br/><br/>
  	  	강사명 : 
  	  	<br/><br/>
  	  	정원 :
  	  	<br/><br/>
  	  	강의시작일 :  
  	  	<br/><br/>
  	  	강의시간 / 공간 :
  	  </div>
  	</div>
  	<div class="right-align">
  	  <!-- <router-link to="/a/register/uni"> -->
        <!-- <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 32%"> -->
        <el-button  type="primary" v-on:click="classes" style="width: 32%">
          <div class="right-align-btn-layer">과목 이해도/집중도/참여도</div>
        </el-button>
      <!-- </router-link> -->
      <!-- <router-link to="/"> -->
        <!-- <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 32%"> -->
        <el-button type="primary" v-on:click="lecture" style="width: 32%">
          <div class="right-align-btn-layer">강의별 이해도/집중도/참여도</div>
        </el-button>
      <!-- </router-link> -->
      <!-- <router-link to="/"> -->
        <!-- <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 32%"> -->
        <el-button type="primary" v-on:click="student" style="width: 32%">
          <div class="right-align-btn-layer">수강학생 조회</div>
        </el-button>
      <!-- </router-link> -->
  	</div>
    <div class="table-name">
  	  <template v-if="lecture"> 
  	  	<master-lecture-all-table
  	    :list="list"
  	    />
  	  </template>
  	  <template v-if="classes"> 
  	  	<master-class-all-table
  	    :list="list"
  	    />
  	  </template>
  	  <template v-else="student"> 
  	  	<master-student-all-table
  	    :list="list"
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
		};
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
  	position: absolute;
  	width:58%;
  	height:30%;
  	top: 140px;
  	left:20%;
  }
  .profile img {
  	position:relative;
  	margin: 50px 5% 1% 15%;
  	/*border: 1px solid red;*/
  }
  .profile .class_detail {
  	position: static;
  	width: 60%;
  	float:right;
  	margin: 5% 0 5% 0;
  	/*border:1px solid blue;*/
  }
  .right-align {
    /*border:1px solid blue;*/	
    position:relative;
    margin: 350px 0 0 0;
  }
  .table-name {
  	margin: 30px 0 0 0;
  }
}
</style>