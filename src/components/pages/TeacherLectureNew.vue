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
                {{ lectureName }}
                <i class="el-icon-edit" @click="changeLectureName()"></i>
              </h3>
            </el-col>
          </template>

          <el-col :span="4">
            <!-- TODO: translate -->
            <el-dropdown @command="onClickLectureType">
              <el-button type="primary">
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
        </el-row>
        <br v-if="inputFlag"/>
        <hr><br />

        <el-row :gutter="30">
          <el-col :span="16">
            <div>
              <lecture-scenario />
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <lecture-scenario-item-adder />
            </div>
          </el-col>
        </el-row>

        <div id="app_lecture_editor" v-show="!isLectureScenarioEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              <!-- TODO: translation -->
              <h2>내용</h2>

              <el-row>
                <el-col :span="6">
                  파일 업로드
                </el-col>
                <el-col :span="18">
                  TODO: 업로드 [ + ]
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">
                  설명
                </el-col>
                <el-col :span="18">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="description"
                  >
                  </el-input>
                </el-col>
              </el-row>

              <h2>활성화 시간 입력</h2>
              <el-row>
                <el-col :span="6">
                  활성화 되는 시각
                </el-col>
                <el-col :span="6">
                  TODO: Time picker hh:mm:ss
                </el-col>

                <el-col :span="6">
                  활성화 지속 시간
                </el-col>
                <el-col :span="6">
                  TODO: Time picker mm:ss
                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </div>

        <h1>debugg</h1>
        lecture scenario: {{ lectureScenario }} <br />
        description: {{ description }} <br />
        currentEditingLectureScenarioItem: {{ currentEditingLectureScenarioItem }}
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
</style>


<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
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
  computed: {
    ...mapState('teacher', ['lectureScenario', 'currentEditingLectureScenarioItem']),
    ...mapGetters('teacher', ['isLectureScenarioEmpty']),
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLectureScenarioItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLectureScenarioItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingLectureScenarioItem({
          currentEditingLectureScenarioItem: {
            ...vm.currentEditingLectureScenarioItem,
            description,
          },
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingLectureScenarioItem']),
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
