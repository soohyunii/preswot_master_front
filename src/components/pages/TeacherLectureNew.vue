<template>
  <div>
    <el-container>
      <teaching-class-list />

      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row :gutter="5">
          <template v-if="inputFlag">
            <el-col :span="6">
              <el-input v-model="lectureName"></el-input>
            </el-col>
            <!-- TODO: translate -->
            <el-col :span="2">
              <el-button @click="changeLectureName()">확인</el-button>
            </el-col>
          </template>

          <template v-else>
            <el-col :span="8">
              <h3>
                {{lectureName}}
                <i class="el-icon-edit" @click="changeLectureName()"></i>
              </h3>
            </el-col>
          </template>

          <el-col :span="4">
            <!-- TODO: translate -->
            <el-dropdown @command="onClick">
              <el-button type="primary">
                분류 : {{lectureType}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="A">강의</el-dropdown-item>
                <el-dropdown-item command="B">숙제</el-dropdown-item>
                <el-dropdown-item command="C">퀴즈</el-dropdown-item>
                <el-dropdown-item command="D">시험</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <br v-if="inputFlag"/>
        <hr><br />

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
        <el-row :gutter="30">
          <el-col :span="16">
            <!-- TODO: translation -->
            <div>새 문항 입력하기</div><hr>
            <div>문항에 관련된 사항 입력 공간</div>
          </el-col>
          <el-col :span="8">
            <div>
              <!-- TODO: translation -->
              <div>활성화 방식</div><hr>
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
import TeachingClassList from '../partials/TeachingClassList';

export default {
  name: 'TeacherNewLecture',
  components: {
    LectureScenario,
    LectureScenarioItemAdder,
    TeachingClassList,
  },
  data() {
    // TODO: translate
    return {
      teachingClassList: [],
      lectureName: '4강 (배열)',
      inputFlag: false,
      currentClassName: '',
      lectureType: '강의',
    };
  },
  methods: {
    // TODO: translate
    onClick(command) {
      const vm = this;
      switch (command) {
        default:
        case 'A':
          vm.lectureType = '강의';
          break;
        case 'B':
          vm.lectureType = '숙제';
          break;
        case 'C':
          vm.lectureType = '퀴즈';
          break;
        case 'D':
          vm.lectureType = '시험';
          break;
      }
    },
    changeLectureName() {
      const vm = this;
      vm.inputFlag = !vm.inputFlag;
    },
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