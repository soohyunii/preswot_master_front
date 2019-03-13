<template>
	<div id="class_index_wrapper" class="bt-container">
	  <h2 class="page-title">조회하기>강사>상세보기</h2>
	  <el-form :model="value" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
	  	<el-form-item label="이메일">
        <el-input v-model="value.email" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
        </el-form-item>
	  </el-form>
	</div>
</template>

<script>
import classService from '../../services/classService';
import { mapActions, mapState } from 'vuex';
import utils from '../../utils';

export default {
	name: 'ViewTeacherAll',
	async created() {
	  const vm=this;
	  //학생이 url로 접근하는 경우 방지
	  const accessId = utils.getUserIdFromJwt();
      const accessCheck = await authService.returnUserInfo({
        userID: accessId,
      });
      if (accessCheck.data.userInfo.type === 0) {
        vm.$router.push('/');
      }
      await vm.getMasterTeacherAll();
      console.log(vm.getMasterTeacherAll());
	},
	async mounted() {
	  const vm=this;
	  if (vm.isView) {
	  	const res = await classService.getMasterTeacherAll({id: vm.teacherId});
	  	vm.value.email=res.data.email;
	  }
	},
	/* computed: {
	  isView() {
	  	const vm = this;
        return vm.$route.fullPath.includes('/view');
	  },
	  teacherId() {
	  	const vm = this;
        return vm.$route.path.split('view/')[1].split('/teacher')[0];
	  },
	}, */

};
	
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
    margin-bottom : 25px;
  }
}	
</style>