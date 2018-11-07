<!-- 조회하기 - 대학 화면 -->
<template>
	<div id="landing_page_wrapper" class="bt-container">
	    <resize-observer @notify="handleResize" />
	    <landing-search-header/>
	    조회하기 > 대학
	    
	</div>
</template>

<script>
// import deepCopy from 'deep-copy';
// import { mapState, mapActions } from 'vuex';
import NNAppHeader from '../layouts/NNAppHeader';
import NNAppFooter from '../layouts/NNAppFooter';
// import utils from '../../utils';

export default{
  name: 'ViewUni',
  components: {
    NNAppHeader,
    NNAppFooter,
  },
};
</script>

<style lang="scss">
#landing_page_wrapper h3{
  	margin-top:45px;
}
</style>