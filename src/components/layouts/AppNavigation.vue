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
            <el-tooltip
              effect="dark"
              :content="item.className"
              :disabled="item.className.length < truncateLength"
              placement="right"
              :key="key">
              <el-menu-item :index="'3-'+index" :key="key">
                <!-- TODO: link to each class -->
                {{ item.className | truncate(truncateLength) }}
              </el-menu-item>
            </el-tooltip>
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
            <el-tooltip
              effect="dark"
              :content="item.className"
              :disabled="item.className.length < truncateLength"
              placement="right"
              :key="key">
              <el-menu-item :index="'4-'+index" :key="key">
                <!-- TODO: link to each class -->
                {{ item.className | truncate(truncateLength) }}
              </el-menu-item>
            </el-tooltip>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <!-- TODO: Find a better place to be -->
      <router-link to="/a/student/lecture/live">Student Live</router-link> <br />
      <router-link to="/a/teacher/lecture/live">Teacher Live</router-link> <br />
      <router-link to="/a/test">Chart Test</router-link> <br />
      <router-link to="/a/teacher/lecture/wordCloudExample">wordCloudExample</router-link> <br />
    </el-menu>
  </div>
</template>

<style lang="scss">
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

<script>
import { mapState } from 'vuex';
import studentService from '../../services/studentService';
// import teacherService from '../../services/teacherService';

export default {
  name: 'AppNavigation',
  data() {
    return {
      // isCollapse: false,
      truncateLength: 16,
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
    // vm.teachingClassList = await teacherService.fetchTeachingClassList();
    // TODO: replace with teacherService.fetchTeachingClassList
    vm.teachingClassList = [
      {
        className: 'Vue.js',
      },
      {
        className: 'Node.js',
      },
      {
        className: 'TensorFlow with python and C++',
      },
      {
        className: 'length_test_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ];
  },
};
</script>
