<template>
	<div id="teacher_class_new_wrapper" class="bt-container">
		<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <h1 class="register-success"> 
		강의은행 그룹 등록이 완료되었습니다!
	  </h1>
	  <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
	  <div class="right-align">
	  	<router-link to="/a/register/bank">
	  		<el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 25%">
	  			<div class="right-align-btn-layer">강의은행 그룹 등록하기</div>
	  		</el-button>
	  	</router-link>
	  	<router-link to="/a/view/bank">
        	<el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 25%">
          		<div class="right-align-btn-layer">목록보기</div>
        	</el-button>
        </router-link>
        <router-link to="/">
        	<el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 25%">
          		<div class="right-align-btn-layer">홈으로</div>
        	</el-button>
        </router-link>
	  </div>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped>
  .register-success {
	float: left;
	position: relative;
	left: 30%;
  }

  .right-align {
  	padding: 3% 0 0 10%;
  }

  .el-button {
  	margin: 0 2% 0 3%;
  }

</style>