<template>
  <div>
    <el-container>

      <!-- TODO: 이 부분도 TeacherLectureNew.vue와 동일한데, 독립적으로 분리시키는건 어떨까요? -->
      <el-aside width="150px">
        <template v-for="(item, key) in teachingClassList">
          <el-row :key="key">
            <el-col align="center">
              <!-- TODO: link to each class -->
              <el-button v-if="isCurrentClass(item)" type="info" disabled>
                <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
                {{ item.className | truncate(10) }}
              </el-button>
              <el-button @click="moveClass(item)" v-else>
                <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
                {{ item.className | truncate(10) }}
              </el-button>
            </el-col>
          </el-row>
        </template>

        <el-row>
          <el-col align="center">
          <!-- TODO: Implement adding lecture part -->
          <!-- TODO: translation -->
          <el-button @click="dummyAddClass()">
            <i class='el-icon-circle-plus' style="font-size: 50px;"></i><br/>
            과목 추가
          </el-button>
          </el-col>
        </el-row>
      </el-aside>

      <el-main>
        <h3>{{ currentClassName }}</h3><hr>

        <!-- TODO: translation -->
        <!-- TODO: Link to each page per button-->
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />

        <lecture-list :tableData="scenarioList"></lecture-list>

        <!-- TODO: Implement dummy response about lecture statistics -->
        <lecture-statistics></lecture-statistics>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import LectureList from '../partials/LectureList';
import LectureStatistics from '../partials/LectureStatistics';
import teacherService from '../../services/teacherService';

export default {
  name: 'TeacherHome',
  data() {
    return {
      currentClassName: '',
      teachingClassList: [],
      scenarioList: [],
    };
  },
  // TODO: Replace dummy functions
  methods: {
    async moveClass(item) {
      const vm = this;
      vm.currentClassName = item.className;
      vm.scenarioList = await teacherService.fetchScenarioList({ teachingClass: vm.currentClassName }); // eslint-disable-line
      // window.console.log(vm.scenarioList.className);
    },
    dummyIcons() {
      // TODO: Replace icons of classes
      return 'el-icon-document';
    },
    dummyAddClass() {
      // TODO: Link to adding class page
    },
    isCurrentClass(item) {
      const vm = this;
      return item.className === vm.currentClassName;
    },
  },
  computed: {
  },
  async mounted() {
    const vm = this;
    vm.teachingClassList = await teacherService.fetchTeachingClassList();
    // 강사 메인화면 페이지 접속 직후 주시하는 과목 없는 경우 제일 첫번째 과목 정보 나타냄
    if (!vm.currentClassName) {
      vm.currentClassName = vm.teachingClassList[0].className;
    }
    vm.scenarioList = await teacherService.fetchScenarioList({ teachingClass: vm.currentClassName }); // eslint-disable-line
    // window.console.log(vm.scenarioList.className);
  },
  components: {
    LectureList,
    LectureStatistics,
  },
};

</script>

<style lang="scss" scoped>
</style>