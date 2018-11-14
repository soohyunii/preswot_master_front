<!-- 매니저 계정으로 로그인 시 나타나는 메인화면 -->
<template>
  <el-header>
  	<el-container>
      <div id="app" :style="{ backgroundImage: ('url('+require('@/assets/study05.jpg')+')') }">
      </div>
    </el-container>
    <el-footer>
    </el-footer>
  </el-header>   
</template>

<script>
// import deepCopy from 'deep-copy';
// import { mapState, mapActions } from 'vuex';
import NNAppHeader from '../layouts/NNAppHeader';
import NNAppFooter from '../layouts/NNAppFooter';
// import utils from '../../utils';

export default{
  name: 'Manager',
  components: {
    NNAppHeader,
    NNAppFooter,
  },
};
</script>

<style lang="scss">
.el-header{
	z-index:3;
}
#app {
  min-height: 100%; 
  min-width: 1024px;  
  width: 100%; 
  height: auto; 
  position: fixed; top: 0; left: 0;
  z-index:1;
}

@media screen and (max-width: 1024px){
	#app{
		left: 50%;
		margin-left: -512px;
	}
}

.el-footer{
	z-index:2;
}

/*#app_router_view_wrapper_main {
  flex: 1;
}*/

/*#landing_page_wrapper h3{
  	margin-top:45px;
}*/
</style>