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
        <i class="fas fa-home fa-lg fa-fw el-compatible"></i>
        <!-- TODO: Translation -->
        <span slot="title">홈</span>
      </el-menu-item>

      <el-menu-item index="/classes" class="menu">
        <i class="fas fa-list fa-lg fa-fw el-compatible"></i>
        <span slot="title">
          <!-- TODO: Translation -->
          과목 리스트
        </span>
      </el-menu-item>

      <el-submenu index="3" class="menu">
        <template slot="title">
          <i class="fas fa-graduation-cap fa-lg fa-fw el-compatible"></i>
          <!-- TODO: Translation -->
          <span slot="title">수강 중인 과목</span>
        </template>
        <el-menu-item-group>
          <template v-for="(item, index) in studyingClassList">
            <el-tooltip
              effect="dark"
              :content="item.name"
              :disabled="item.name.length < truncateLength"
              placement="right"
              :key="index">
              <el-menu-item
                index="/a/student/class"
                @click="clickClassButton(item, index)"
                :key="index">
                <!-- TODO: link to each class -->
                {{ item.name | truncate(truncateLength) }}
              </el-menu-item>
            </el-tooltip>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4" class="menu">
        <template slot="title">
          <i class="fas fa-book fa-lg fa-fw el-compatible"></i>
          <!-- TODO: Translation -->
          <span slot="title">강의 중인 과목</span>
        </template>
        <el-menu-item-group>
          <template v-for="(item, index) in teachingClassList">
            <el-tooltip
              effect="dark"
              :content="item.name"
              :disabled="item.name.length < truncateLength"
              placement="right"
              :key="index">
              <el-menu-item
                :key="index"
                index="/a/teacher/class"
                @click="clickClassButton(item, index)"
              >
                <!-- TODO: link to each class -->
                {{ item.name | truncate(truncateLength) }}
              </el-menu-item>
            </el-tooltip>
          </template>
        </el-menu-item-group>
      </el-submenu>

      <!-- TODO: Find a better place to be -->
      <router-link to="/a/student/lecture/1/live">Student Live</router-link> <br />
      <router-link to="/a/test">Chart Test</router-link> <br />
      <router-link to="/a/student/class">Student Class</router-link> <br />
      <a :href = "`${serverUrl}/downloads/download_logfile/${userId}`">log_file</a> <br />
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
import utils from '../../utils';
import { mapState, mapMutations, mapActions } from 'vuex';
import { baseUrl } from '../../services/config';
// import studentService from '../../services/studentService';
// import teacherService from '../../services/teacherService';

export default {
  name: 'AppNavigation',
  data() {
    return {
      // isCollapse: false,
      truncateLength: 16,
      serverUrl: `${baseUrl}`,
      userId: utils.getUserIdFromJwt(),
    };
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
    ...mapState('class', [
      'studyingClassList',
      'teachingClassList',
      'currentClassIndex',
    ]),
  },
  methods: {
    ...mapMutations('class', [
      'updateCurrentClassIndex',
    ]),
    ...mapActions('class', [
      'getMyClassLists',
    ]),
    clickClassButton(item, index) {
      const vm = this;
      vm.updateCurrentClassIndex({
        currentClassIndex: index,
      });
    },
  },
  async mounted() {
    const vm = this;
    await vm.getMyClassLists();
    vm.$forceUpdate();
  },
};
</script>
