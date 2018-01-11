<template>
  <div>
    <!-- TODO: replace index of el-menu-item (now just plain string) to corresponding vue-router's path -->
    <el-menu
      :default-active="$route.path"
      class="app-nav-menu"
      :default-openeds="['3', '4']"
      :router="true"
    >
      <el-menu-item index="/">
        <i class="fa fa-home el-compatible" style="width: 18px; height: 18px;"></i>
        <!-- TODO: Translation -->
        <span slot="title">홈</span>
      </el-menu-item>

      <el-menu-item index="/register">
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
          <template v-for="(item, key, index) in attendingClassList">
            <el-menu-item :index="'3-'+index" :key="key">
              <!-- TODO: link to each class -->
              {{ item.className }}
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <!-- TODO: Translation -->
          <span slot="title">강의 중인 과목</span>
        </template>
        <el-menu-item-group>
          <template v-for="(item, key, index) in openingClassList">
            <el-menu-item :index="'4-'+index" :key="key">
              <!-- TODO: link to each class -->
              {{ item.className }}
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <!-- TODO: Find a better place to be -->
      <router-link to="/a/teacher">Teacher Home</router-link> <br />
      <router-link to="/a/teacher/lecture/new">Teacher New Lecture</router-link>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import classService from '../../services/classService';

export default {
  name: 'AppNavigation',
  data() {
    return {
      // isCollapse: false,
      attendingClassList: [],
      openingClassList: [],
    };
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
  },
  filters: {

  },
  beforeRouteLeave(to, from) {
    console.log(to, from);
    console.log(1, 2, 3);
  },
  async mounted() {
    const vm = this;
    vm.attendingClassList = await classService.fetchAttendingClassList();
    vm.openingClassList = await classService.fetchOpeningClassList();
    // window.console.log(this.attending);
    // window.console.log(this.opening);
  },
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
