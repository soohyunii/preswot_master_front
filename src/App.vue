<template>
  <div id="app">
    <el-container>
      <el-header>
        <app-header />
      </el-header>
      <el-container>
        <el-aside width="200px" v-show="isNavCollapsed">
          <app-navigation />
        </el-aside>
        <el-container>
          <el-main id="app_router_view_wrapper" >
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
import './app.scss';

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

<style lang="scss">
@import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
@import "~@/variables.scss";

body {
  font-family: 'Noto Sans KR', sans-serif !important;
}

#app {
  display: flex;
  min-height: 108vh;
  flex-direction: column;
}

#app_router_view_wrapper {
  background-color: $oatmeal;
  flex: 1;
}

</style>
