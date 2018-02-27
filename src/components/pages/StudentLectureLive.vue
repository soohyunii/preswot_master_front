<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="3">
        <el-dropdown>
          <el-button type="primary" size="medium" disabled>
            분류 : {{ scType }}<i class="el-icon-edit el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="강의">강의</el-dropdown-item>
            <el-dropdown-item command="숙제">숙제</el-dropdown-item>
            <el-dropdown-item command="퀴즈">퀴즈</el-dropdown-item>
            <el-dropdown-item command="시험">시험</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>

      <el-col :span="8">
        <h3 class="lecture-name">
          {{ scTitle }}
          <i class="el-icon-edit"></i>
        </h3>
      </el-col>


    </el-row>

    <hr><br />

    <el-row class="editor">
      <el-col>
        <el-row :gutter="30" class="sc-row">
          <el-col :span="16">
            <div>
              <sc />
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <!-- <sc-item-adder /> -->
            </div>
          </el-col>
        </el-row>

        <!-- v-show="currentEditingScItem" -->

        <div id="app_lecture_editor" v-show="!isScEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              TODO:
              학생이 문제 보고
              문제 풀 수 있는 공간
              <sc-common-viewer />
              <sc-material-viewer v-if="currentEditingScItemType === '강의자료'" />
              <!-- <h1>아이템 편집</h1>
              <sc-common-editor />
              <sc-material-editor v-if="currentEditingScItemType === '강의자료'" />
              <sc-homework-editor v-if="currentEditingScItemType === '숙제'" />
              <sc-survey-editor v-if="currentEditingScItemType === '설문'" />
              <sc-question-editor v-if="currentEditingScItemType === '문항'" />
              <sc-active-time-editor /> -->

            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

import Sc from '../partials/Sc';
import StudentLectureLiveSummary from '../partials/StudentLectureLiveSummary';
import ScCommonViewer from '../partials/ScCommonViewer';
import ScMaterialViewer from '../partials/ScMaterialViewer';

export default {
  name: 'StudentLectureLive',
  components: {
    Sc,
    StudentLectureLiveSummary,
    ScCommonViewer,
    ScMaterialViewer,
  },
  data() {
    return {
      isCloseMovie: false,
      isCloseStatusbar: false,
      SummaryData: [],
    };
  },
  async beforeMount() {
    const vm = this;
    vm.youtubeId = 'TODO:replace';
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    await vm.getSc();
    // TODO: handle sc empty
    if (!vm.isScEmpty) {
      vm.updateCurrentEditingScItemIndex({
        currentEditingScItemIndex: 0,
      });
      // 문항, 강의자료의 id가 이 단계에서 얻어짐 => getItemKeywords() 함수에서 이 id를 이용
      await vm.getScItem({
        scItemId: vm.currentEditingScItem.id,
      });
      // if (['문항', '강의자료'].includes(vm.currentEditingScItemType)) {
      //   vm.getItemKeywords();
      // }
    }
  },
  computed: {
    ...mapState('sc', ['scTitle', 'scType', 'scStartDate']),
    ...mapGetters('scItem', [
      'isScEmpty',
      'currentEditingScItem',
    ]),
    currentEditingScItemType() {
      const vm = this;
      const item = vm.currentEditingScItem;
      if (!item) {
        return null;
      }
      return item.type;
    },
  },
  methods: {
    ...mapMutations('sc', [
      'updateScId',
    ]),
    ...mapMutations('scItem', [
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('sc', [
      'getSc',
    ]),
    ...mapActions('scItem', [
      'getScItem',
      'getItemKeywords',
    ]),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'CLOSE_MOVIE': {
          vm.isCloseMovie = true;
          break;
        }
        case 'CLOSE_STATUSBAR': {
          vm.isCloseStatusbar = true;
          break;
        }
        case 'POPUP_MOVIE': {
          window.open('https://www.w3schools.com/html/mov_bbb.mp4', '_blank', 'location=0');
          break;
        }
        case 'OPEN_STATUS_INFO': {
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .statusbar {
    position:fixed;
    left:0px;
    bottom:0px;
    width:100%;
    padding: 8px 0px 5px 0px;
    background:rgba(0, 0, 0, 0.6);
    color: white;
  }
  .video {
    background-color: black;
    min-height: 500px;
  }
</style>
