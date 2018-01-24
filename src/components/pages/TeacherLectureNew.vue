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
              <sc />
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <ls-item-adder />
            </div>
          </el-col>
        </el-row>

        <div id="app_lecture_editor" v-show="!isLsEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              <!-- TODO: translation -->
              <ls-material-editor />

              <h2>활성화 시간 입력</h2>
              <el-row>
                <el-col :span="6">
                  활성화 되는 시각
                </el-col>
                <el-col :span="6">
                  <el-time-picker v-model="activeTime" :default-value="defaultTime" :clearable="false" placeholder="00:00:00" />
                  <br/>{{activeTime}}<br/>
                  TODO: Time picker hh:mm:ss
                </el-col>

                <el-col :span="6">
                  활성화 지속 시간
                </el-col>
                <el-col :span="6">
                  <el-time-picker v-model="activeDurationTime" :default-value="defaultTime" :clearable="false" format="mm분 ss초" placeholder="0분 0초" />
                  <br/>{{activeDurationTime}}<br/>
                  TODO: Time picker mm:ss
                </el-col>
              </el-row>

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
</style>


<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import Sc from '../partials/Sc';
import LsItemAdder from '../partials/LsItemAdder';
import LsMaterialEditor from '../partials/LsMaterialEditor';
import TeachingClassList from '../partials/TeachingClassList';

export default {
  name: 'TeacherNewLecture',
  components: {
    Sc,
    LsItemAdder,
    LsMaterialEditor,
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
      defaultTime: new Date(0, 0, 0),
    };
  },
  computed: {
    ...mapGetters('teacher', ['isLsEmpty']),
    ...mapState('teacher', ['ls', 'currentEditingLsItem', 'currentEditingLsItemIndex']),
    activeTime: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLsItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLsItem.activeTime || new Date(0, 0, 0);
        }
        return new Date(0, 0, 0);
      },
      set(activeTime) {
        const vm = this;
        vm.updateCurrentEditingLsItem({
          currentEditingLsItem: {
            ...vm.currentEditingLsItem,
            activeTime,
          },
          lectureElementIndex: vm.currentEditingLsItemIndex,
        });
      },
    },
    activeDurationTime: {
      get() {
        const vm = this;
        if (!!vm.currentEditingLsItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingLsItem.activeDurationTime || new Date(0, 0, 0);
        }
        return new Date(0, 0, 0);
      },
      set(activeDurationTime) {
        const vm = this;
        vm.updateCurrentEditingLsItem({
          currentEditingLsItem: {
            ...vm.currentEditingLsItem,
            activeDurationTime,
          },
          lectureElementIndex: vm.currentEditingLsItemIndex,
        });
      },
    },
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingLsItem']),
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
