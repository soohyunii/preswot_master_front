<template>
  <div id="class_index_wrapper" class="bt-container">
  	<h2 class="page-title">조회하기 > 학생 및 성적표 > 전체학생 성적표조회</h2>
  	  <div>
  	  	<el-form :model="input" ref="elForm" style="max-width: 1000px;" class="elForm">
  	        <select id="uni-choice" v-model="input.choiceUni">
  	  	      <option selected="">대학선택</option>
  	        </select>
  	        <select id="dept-choice" v-model="input.choiceDept">
  	  	      <option selected="">학과선택</option>
  	        </select>
  	        <select id="semester-choice" v-model="input.choiceSemester">
  	  	      <option selected="">학기선택</option>
  	        </select>
  	        <el-button icon="el-icon-search" circle></el-button>
  	    </el-form>	
  	  </div>
  	  <div style="margin-top: 50px;">
  	  	<master-student-score
  	  	  :list="list"
  	  	  />
  	  </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import utils from '../../utils';
import MasterStudentScore from '../partials/MasterStudentScore';	

export default {
	name: 'ViewStudentScore',
	components: {
		MasterStudentScore,
	},
	async created() {
		const vm = this;
		const accessId = utils.getUserIdFromJwt();
		const accessCheck = await authService.returnUserInfo({
			userID: accessId,
		});
		if (accessCheck.data.userInfo.type === 0){
			vm.$router.push('/');
		}
	},
	data() {
		const initialInput = {
			choiceUni: '대학선택',
			choiceDept: '학과선택',
			choiceSemester: '학기선택',
		};
		return {
			initialInput,
			input: Object.assign({}, initialInput),
			list: [],
		};
	},
}
	
</script>

<style lang="scss" scoped>
#class_index_wrapper {
  .page-title{
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
    margin-bottom : 60px;
  }
}

.elForm select {
	/*border: 1px solid red;*/
	margin-right: 25px;
	margin-left : 15px;
	width:180px;
}

</style>

