<template>
  <div id="app">
    <el-container>
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-container>
        <el-aside width="200px" v-show="isNavCollapsed">
          <app-navigation></app-navigation>
        </el-aside>
        <el-container>
          <el-main>
            <router-view/>
          </el-main>
          <el-footer>
            <app-footer></app-footer>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// Import element-ui css
import './element-variables.scss';
// import 'element-ui/lib/theme-chalk/index.css'; // eslint-disable-line

import AppNavigation from './components/layouts/AppNavigation';
import AppHeader from './components/layouts/AppHeader';
import AppFooter from './components/layouts/AppFooter';

export default {
  name: 'app',
  components: {
    AppNavigation,
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
  },
};
</script>

<style>
@import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
body {
  font-family: 'Noto Sans KR', sans-serif !important;
}
</style>
