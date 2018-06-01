<template>
  <div id="landing_page_wrapper" class="bt-container">
    <resize-observer @notify="handleResize" />
    <landing-search-header/>
    <class-intro-card-grid :onClick="onClick" :span="span" :popularClassList="popularClassList"></class-intro-card-grid>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ClassIntroCard from '../partials/ClassIntroCard';
import ClassIntroCardGrid from '../partials/ClassIntroCardGrid';
import LandingSearchHeader from '../partials/LandingSearchHeader';
import utils from '../../utils';

export default {
  name: 'LandingPage',
  components: {
    ClassIntroCard,
    ClassIntroCardGrid,
    LandingSearchHeader,
  },
  beforeMount() {
    const vm = this;
    vm.handleResize();
    vm.getPopularClassList();
  },
  computed: {
    ...mapState('NNclass', ['popularClassList']),
  },
  data() {
    return {
      span: 0,
    };
  },
  methods: {
    ...mapActions('NNclass', [
      'getPopularClassList',
    ]),
    async onClick(type) {
      switch (type) {
        default: {
          console.log('@LandingPage.vue/onClick(type)/default : 할 일을 입력하세요.'); // eslint-disable-line
          // throw new Error(`not defined type ${type}`);
        }
      }
    },
    handleResize() {
      const vm = this;
      switch (utils.getViewportSize()) {
        case 'xs':
          vm.span = 12;
          break;
        case 'sm':
          vm.span = 8;
          break;
        case 'md':
          vm.span = 6;
          break;
        default:
          vm.span = 4;
          break;
      }
    },
  },
};
</script>