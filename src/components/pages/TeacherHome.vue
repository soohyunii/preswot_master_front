<template>
  <div>
    <el-container class="outline">

      <!-- TODO: 이 부분도 TeacherLectureNew.vue와 동일한데, 독립적으로 분리시키는건 어떨까요? -->
      <el-aside width="150px">
        <template v-for="(item, key) in teachingClassList">
          <el-row :key="key">
            <el-col align="center">
              <!-- TODO: link to each class -->
              <el-button @click="dummy(item)" v-if="disabledummy(item)" type="info" disabled>
                <i :class="dummyIcons()" style="font-size: 50px;"></i><br/>
                {{ item.className | truncate(10) }}
              </el-button>
              <el-button @click="dummy(item)" v-else>
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
          <el-button @click="dummy('과목추가')">
            <i class='el-icon-circle-plus' style="font-size: 50px;"></i><br/>
            과목 추가
          </el-button>
          </el-col>
        </el-row>
      </el-aside>

      <el-main>
        <h3>{{currentLecture}}</h3><hr>

        <!-- TODO: translation -->
        <!-- TODO: Link to each page per button-->
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />

        <!-- TODO: Implement dummy response about lecture list -->
        <lecture-list :tableData="tableData"></lecture-list>

        <!-- TODO: Implement dummy response about lecture statistics -->
        <lecture-statistics></lecture-statistics>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import LectureList from '../partials/LectureList';
import LectureStatistics from '../partials/LectureStatistics';
import classService from '../../services/classService';

export default {
  name: 'TeacherHome',
  data() {
    return {
      tableData: [{
        num: '1',
        date: '2018-01-02',
        name: '1강',
        understanding: 100,
      }, {
        num: '2',
        date: '2018-01-09',
        name: '2강',
        understanding: 86,
      }, {
        num: '3',
        date: '2018-01-13',
        name: '3강',
        understanding: 57,
      }, {
        num: '4',
        date: '2018-01-15',
        name: '4강',
        understanding: 72,
      }],
      currentLecture: '',
      teachingClassList: [],
    };
  },
  methods: {
    dummyIcons() {
      return 'el-icon-document';
    },
    dummy(index) {
      window.console.log(index);
    },
    disabledummy(item) {
      if (item.className === 'Vue.js') {
        const vm = this;
        vm.currentLecture = item.className;
        return true;
      }
      return false;
    },
    changeLectureName() {
      const vm = this;
      vm.inputFlag = !vm.inputFlag;
    },
  },
  async mounted() {
    const vm = this;
    vm.teachingClassList = await classService.fetchTeachingClassList();
  },
  components: {
    LectureList,
    LectureStatistics,
  },
};

</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: rgb(255, 255, 255);
    color: #333;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>