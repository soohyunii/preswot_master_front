<!-- 매니저 계정으로 로그인 시 나타나는 메인화면 -->
<template>
	<div id="landing_page_wrapper" class="bt-container">
	    <resize-observer @notify="handleResize" />
	    <landing-search-header/>
	    관리자 페이지!
	</div>
</template>

<script>
import deepCopy from 'deep-copy';
import { mapState, mapActions } from 'vuex';
// import ClassIntroCard from '../partials/ClassIntroCard';
// import ClassIntroCardGrid from '../partials/ClassIntroCardGrid';
// import LandingSearchHeader from '../partials/LandingSearchHeader';
// import AppNavigation from '../layouts/AppNavigation';
import NNAppHeader from '../layouts/NNAppHeader';
import utils from '../../utils';

export default{
	name:'Manager',
	components:{
		// ClassIntroCard,
    	// ClassIntroCardGrid,
    	// LandingSearchHeader,
    	// AppNavigation,
    	NNAppHeader,
	},


};
</script>

<style lang="scss">
#landing_page_wrapper h3{
  	margin-top:45px;
}
</style>