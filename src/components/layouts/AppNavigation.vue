<template>
  <div id="app_nav_wrapper">
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

      <el-menu-item index="/classes">
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
              {{ item.className | truncate(16) }}
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
          <template v-for="(item, key, index) in teachingClassList">
            <el-menu-item :index="'4-'+index" :key="key">
              <!-- TODO: link to each class -->
              {{ item.className | truncate(16) }}
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <!-- TODO: Find a better place to be -->
      <router-link to="/a/student/lecture/realtime">Student Realtime</router-link>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import studentService from '../../services/studentService';
import teacherService from '../../services/teacherService';

export default {
  name: 'AppNavigation',
  data() {
    return {
      // isCollapse: false,
      attendingClassList: [],
      teachingClassList: [],
    };
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
  },
  async mounted() {
    const vm = this;
    vm.attendingClassList = await studentService.fetchAttendingClassList();
    vm.teachingClassList = await teacherService.fetchTeachingClassList();
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

// * AppNavigation
#app_nav_wrapper {
  height: 100%;
  .app-nav-menu {
    height: 100%;
  }
}
</style>
