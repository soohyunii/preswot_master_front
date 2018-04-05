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
            <router-view/>
          </el-main>
          <el-footer id="app_footer_wrapper">
            <app-footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    {{ appTheme }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import './app.scss';
// import './variables.scss'; // * To use $--color-primary scss variable

import AppNavigation from './components/layouts/AppNavigation';
import AppHeader from './components/layouts/AppHeader';
import AppFooter from './components/layouts/AppFooter';

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
      return null;
    },
  },
};
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/earlyaccess/notosanskr.css);
@import "~@/app.scss";
@import "~@/variables.scss";

body {
  user-select: none;
}

#app {
  font-family: 'Noto Sans KR', sans-serif !important;
  display: flex;
  min-height: 108vh;
  flex-direction: column;
}

#app_router_view_wrapper {
  background-color: $app-oatmeal;
  flex: 1;
}

#app_footer_wrapper {
  background-color: $app-oatmeal;
}

#teacher_theme {
  background-color: darken($app-ultra-violet, 10%);
}

#teacher_lecture_live_theme {
  background-color: lighten($app-orange, 10%);
}

#student_theme {
  background-color: darken($app-oatmeal, 70%);
}
</style>