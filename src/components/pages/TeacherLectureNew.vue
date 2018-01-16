<template>
  <div>
    <el-container>
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

      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row>
          <el-col :span="24">
            <div class="lecture-number-name" v-if="inputFlag">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input v-model="lectureName"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button @click="changeLectureName()">확인</el-button>
                </el-col>
              </el-row>
              <br/>
            </div>
            <div class="lecture-number-name" v-else>
              <h3>
                {{lectureName}}
                <i class="el-icon-edit" @click="changeLectureName()"></i>
              </h3>
            </div>
          </el-col>
        </el-row>
        <br />

        <el-row :gutter="30">
          <el-col :span="16">
            <div class="grid-content bg-white">
              <lecture-scenario />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-white">
              <lecture-scenario-item-adder />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <!-- TODO: translation -->
            <div class="lecture-number-name">새 문항 입력하기</div>
            <div>문항에 관련된 사항 입력 공간</div>
          </el-col>
          <el-col :span="8">
            <div>
              <!-- TODO: translation -->
              <div class="lecture-number-name">활성화 방식</div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <!-- 이 메인은 맞음 끝 -->
    </el-container>

  </div>
</template>

<script>
import LectureScenario from '../partials/LectureScenario';
import LectureScenarioItemAdder from '../partials/LectureScenarioItemAdder';
import teacherService from '../../services/teacherService';

export default {
  name: 'TeacherNewLecture',
  components: {
    LectureScenario,
    LectureScenarioItemAdder,
  },
  data() {
    return {
      teachingClassList: [],
      lectureName: '4강 (배열)',
      inputFlag: false,
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
    vm.teachingClassList = await teacherService.fetchTeachingClassList();
  },
};
</script>


<style scoped>
  .lecture-number-name {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: darkorange;
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
    min-height: 150x;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>