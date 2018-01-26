<template>
  <div>
    <el-container>
      <el-aside width="150px">
        <teaching-class-list />
      </el-aside>

      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row :gutter="5">
          <el-col :span="3">
            <!-- TODO: translate -->
            <el-dropdown @command="onClickLectureType">
              <el-button type="primary" size="medium">
                분류 : {{ lectureType }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="강의">강의</el-dropdown-item>
                <el-dropdown-item command="숙제">숙제</el-dropdown-item>
                <el-dropdown-item command="퀴즈">퀴즈</el-dropdown-item>
                <el-dropdown-item command="시험">시험</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>

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
              <h3 class="lecture-name">
                {{ lectureName }}
                <i class="el-icon-edit" @click="changeLectureName()"></i>
              </h3>
            </el-col>
          </template>
        </el-row>
        <br v-if="inputFlag"/>
        <hr><br />

        <el-row :gutter="30">
          <el-col :span="16">
            <div>
              <sc />
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <sc-item-adder />
            </div>
          </el-col>
        </el-row>

        <div id="app_lecture_editor" v-show="!isScEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              <!-- TODO: translation -->
              <sc-material-editor />
              <sc-active-time-editor />

            </el-col>
          </el-row>
        </div>
      </el-main>
      <!-- 이 메인은 맞음 끝 -->
    </el-container>

  </div>
</template>

<style lang="scss" scoped>
#app_lecture_editor {
  margin-top: 2vh;
  padding: 0px 20px 20px 20px;
  background-color: white;
}

.lecture-name {
  margin: 8px 0;
  // background-color: red;
}
</style>


<script>
import { mapGetters } from 'vuex';
import Sc from '../partials/Sc';
import ScItemAdder from '../partials/ScItemAdder';
import ScMaterialEditor from '../partials/ScMaterialEditor';
import ScActiveTimeEditor from '../partials/ScActiveTimeEditor';
import TeachingClassList from '../partials/TeachingClassList';

export default {
  name: 'TeacherNewLecture',
  components: {
    Sc,
    ScItemAdder,
    ScMaterialEditor,
    ScActiveTimeEditor,
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
  computed: {
    ...mapGetters('teacher', ['isScEmpty']),
  },
  methods: {
    onClickLectureType(lectureType) {
      const vm = this;
      vm.lectureType = lectureType;
    },
    changeLectureName() {
      const vm = this;
      vm.inputFlag = !vm.inputFlag;
    },
  },
};
</script>
