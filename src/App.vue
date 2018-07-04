<template>
  <div id="app">
    <el-container>
      <el-header :id="appTheme">
        <app-header />
      </el-header>
      <el-container>
        <el-aside width="200px" v-show="!isNavCollapsed">
          <app-navigation />
        </el-aside>
        <el-container>
          <el-main id="app_router_view_wrapper" >
            <router-view :key="$route.fullPath"></router-view> <!-- vue router에서 동일한 path 호출시 새로고침 효과 -->
          </el-main>
          <el-footer>
            <app-footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import './app.scss';
// import './variables.scss'; // * To use $--color-primary scss variable

import AppNavigation from './components/layouts/AppNavigation';
import AppHeader from './components/layouts/AppHeader';
import AppFooter from './components/layouts/AppFooter';
import utils from './utils';

export default {
  name: 'app',
  data() {
    return {
      teacherTheme: {
        background: '$app-ultra-violet',
      },
    };
  },
  components: {
    AppNavigation,
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
    appTheme() {
      const vm = this;
      const path = vm.$route.path;
      if (path.includes('teacher')) {
        if (path.includes('live')) {
          return 'teacher_lecture_live_theme';
        }
        return 'teacher_theme';
      } else if (path.includes('student')) {
        return 'student_theme';
      }
      return 'default_theme';
    },
  },
  methods: {
    ...mapMutations('auth', ['updateJwt']),
    validateJwt() {
      const vm = this;
      const jwt = utils.getJwtFromLocalStorage();
      if (!jwt) { // * 로그인 안한 경우
        // * do nothing
      } else if (utils.isJwtExpired(jwt)) { // * 로그인은 했었는데 jwt 만료됨
        const redirect = confirm('로그인 세션이 만료되었습니다. 확인을 누르면 로그인 페이지로 이동합니다.'); // eslint-disable-line no-alert
        if (redirect) {
          vm.updateJwt({
            jwt: '',
          });
          vm.$router.push('/login');
        }
      }
    },
    chromeChecker() {
      const result = utils.checkBrowser();
      if (result.name !== 'chrome') {
        // eslint-disable-next-line
        const r = confirm('Preswot은 chrome에서만 지원 가능합니다. chrome 다운로드 페이지로 이동하시겠습니까?');
        if (r === true) {
          window.open('https://www.google.co.kr/chrome/index.html', '_blank');
        }
      }
    },
  },
  mounted() {
    const vm = this;
    vm.chromeChecker();
    vm.validateJwt();
    window.setInterval(() => {
      vm.validateJwt();
    }, 60 * 1000);
  },
};
</script>

<style lang="scss">
@import "~@/app.scss";
@import "~@/variables.scss";

#app {
  display: flex;
  min-height: 108vh;
  flex-direction: column;
}

#app_router_view_wrapper {
  background-color: lighten($app-oatmeal, 50%);
  flex: 1;
}

#teacher_theme {
  // background-color: darken($app-ultra-violet, 10%);
  background-color: darken(#2497D8, 10%);
}

#teacher_lecture_live_theme {
  background-color: lighten($app-orange, 10%);
}

#student_theme {
  background-color: darken($app-oatmeal, 70%);
}

#default_theme {
  background-color: darken(#2497D8, 10%); 
  /* sh s : png파일 문제*/
  /* background-color: rgba(0, 0, 0, 0.7); */
  /* background-color: rgba(0, 0, 0, 0); */
  /* box-shadow: 0 1px 2px rgba(0,0,0,0.9); */
/*   background-image: url('https://cdn.zeplin.io/5b1f513665ca1be045ff097e/screens/8AB2F00A-8758-4DC0-B3AE-BF54C3A629F6.png'); */
  height:100px;

  /* sh e */
}
</style>
