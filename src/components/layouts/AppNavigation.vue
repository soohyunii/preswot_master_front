<template>
  <div id="app_nav_wrapper">
    <!-- TODO: replace index of el-menu-item (now just plain string) to corresponding vue-router's path -->
    <el-menu
      :default-active="$route.path"
      class="app-nav-menu"
      :default-openeds="['3', '4']"
      :router="true"
    >
      <el-menu-item index="/" class="menu">
        <i class="fa fa-home fa-lg fa-fw el-compatible"></i>
        <!-- TODO: Translation -->
        <span slot="title">홈</span>
      </el-menu-item>

      <el-menu-item index="/classes" class="menu">
        <i class="fa fa-list fa-lg fa-fw el-compatible"></i>
        <span slot="title">
          <!-- TODO: Translation -->
          과목 리스트
        </span>
      </el-menu-item>

      <el-submenu index="3" class="menu">
        <template slot="title">
          <i class="fa fa-graduation-cap fa-lg fa-fw el-compatible"></i>
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

      <el-submenu index="4" class="menu">
        <template slot="title">
          <i class="fa fa-book fa-lg fa-fw el-compatible"></i>
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
  mounted() {
    const vm = this;
    studentService.fetchAttendingClassList()
    .then((attendingClassList) => {
      vm.attendingClassList = attendingClassList;
    })
    .catch(() => {
      // fetch fail
    });

    teacherService.fetchTeachingClassList()
    .then((teachingClassList) => {
      vm.teachingClassList = teachingClassList;
    })
    .catch(() => {
      // fetch fail
    });
  },
};
</script>

<style lang="scss" scoped>
// * handling font awesome icons
#app_nav_wrapper {
  height: 100%;
  .app-nav-menu {
    height: 100%;
    border: 0;
  }
  .el-menu-item.menu, .el-submenu.menu .el-submenu__title {
    padding-left: 15px !important;
  }
  .el-menu-item .fa.el-compatible {
    margin-right: 5px;
    text-align: center;
    vertical-align: middle;
  }
  .fa.el-compatible {
    content: "\E638";
    vertical-align: middle;
  }
  .menu span {
    vertical-align: baseline;
    line-height: 18.6667px;
    margin-left: 7px;
  }
  .el-menu-item-group__title {
    display: none;
  }
  .el-menu-item-group .el-menu-item {
    height: 42px;
    line-height: 42px;
  }
}
</style>
