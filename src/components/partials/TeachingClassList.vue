<template>
  <el-aside width="150px">
    <template v-for="(item, key) in teachingClassList">
      <el-row :key="key">
        <el-col align="center">
          <!-- TODO: link to each class -->
          <el-button v-if="isCurrentClass(item)" type="info" disabled>
          <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
          {{ item.className | truncate(10) }}
          </el-button>
          <el-button @click="moveClass(item.className)" v-else>
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
</template>

<script>
import teacherService from '../../services/teacherService';

export default {
  name: 'teachingClassList',
  data() {
    return {
      currentClassName: '',
      teachingClassList: [],
      // scenarioList: [],
    };
  },
  // TODO: Replace dummy functions
  methods: {
    async moveClass(teachingClassName) {
      const vm = this;
      vm.currentClassName = teachingClassName;
      const whereToMove = vm.currentClassName;
      vm.$emit('moveClass', { whereToMove });
      // vm.scenarioList = await teacherService.fetchScenarioList({ teachingClassName });
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
  async mounted() {
    const vm = this;
    vm.teachingClassList = await teacherService.fetchTeachingClassList();
    // 강사 메인화면 페이지 접속 직후 주시하는 과목 없는 경우 제일 첫번째 과목 정보 나타냄
    if (!vm.currentClassName && vm.teachingClassList) {
      vm.currentClassName = vm.teachingClassList[0].className;
    }
    const whereToMove = vm.currentClassName;
    // window.console.log('mounted', whereToMove);
    vm.$emit('moveClass', { whereToMove });
  },
};
</script>