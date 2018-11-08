<!-- 조회하기 - 대학 화면 -->
<template>
	<div id="class_index_wrapper" class="bt-container">
		<h2 class="page-title">조회하기>대학</h2>
		<master-uni-table
			:list="list"
			:onClick="onClick"
		/>
	</div>
</template>

<script>
// import deepCopy from 'deep-copy';
// import { mapState, mapActions } from 'vuex';
import StudentClassTable from '../partials/StudentClassTable';
import NNAppHeader from '../layouts/NNAppHeader';
import NNAppFooter from '../layouts/NNAppFooter';
import utils from '../../utils';

export default{
  name: 'ViewUni',
  components: {
    NNAppHeader,
    NNAppFooter,
    StudentClassTable,
  },
  data(){
  	return{

  	}
  }
};
</script>

<style lang="scss">
#class_index_wrapper{
	border:1px solid red;
}
</style>