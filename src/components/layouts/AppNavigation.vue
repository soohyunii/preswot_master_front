<template>
  <div>
    <!-- TODO: replace index of el-menu-item (now just plain string) to corresponding vue-router's path -->
    <el-menu
      default-active="1"
      class="app-nav-menu"
      :default-openeds="['3', '4']"
      :router="true"
    >
      <el-menu-item index="/">
        <i class="fa fa-home el-compatible" style="width: 18px; height: 18px;"></i>
        <!-- TODO: Translation -->
        <span slot="title">홈</span>
      </el-menu-item>

      <el-menu-item index="2">
        <i class="el-icon-setting"></i>
        <span slot="title">
          <!-- TODO: Translation -->
          과목 리스트
        </span>
      </el-menu-item>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <!-- TODO: Translation -->
          <span slot="title">수강 중인 과목</span>
        </template>
        <el-menu-item-group>
          <!-- TODO: replace with v-for -->
          <el-menu-item index="3-1">어쩌구</el-menu-item>
          <el-menu-item index="3-2">저쩌구</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <!-- TODO: Translation -->
          <span slot="title">강의 중인 과목</span>
        </template>
        <el-menu-item-group>
          <!-- TODO: replace with v-for -->
          <el-menu-item index="4-1">저쩌구</el-menu-item>
          <el-menu-item index="4-2">어쩌구</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AppNavigation',
  // data() {
  //   return {
  //     isCollapse: false,
  //   };
  // },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
  },
  // methods: {
  //   onSelect(index) {
  //     const vm = this;
  //     switch (index) {
  //       case '1': {
  //         vm.$router.push({
  //           name: 'LandingPage',
  //         });
  //         break;
  //       }
  //       case '2': {
  //         vm.$router.push({
  //           path: '/asdf',
  //         });
  //         break;
  //       }
  //       // TODO: dynamic onSelect
  //       default: {
  //         throw new Error('not defined index', index);
  //       }
  //     }
  //   },
  // },
};
</script>

<style lang="scss">
// handling font awesome icons
.el-menu--collapse > .el-menu-item .fa.el-compatible {
  margin: 0;
  vertical-align: middle;
  width: 24px;
  text-align: center;
}

.el-menu-item .fa.el-compatible {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.fa.el-compatible {
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fa.el-compatible {
  content: "\E638";
}

.app-nav-menu {
  height: 93vh;
}
.app-nav-menu:not(.el-menu--collapse) {
  width: 190px;
  min-height: 400px;
}
</style>
