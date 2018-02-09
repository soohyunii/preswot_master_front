<template>
  <div>
    <el-container>
      <el-aside width="150px">
        <!-- <teaching-class-list-aside /> -->
      </el-aside>
      <el-main>
        <el-row class="video">
          <iframe width="100%" height="500px" src="https://www.youtube.com/embed/DAHsPaR-tAU?autoplay=1" frameborder="0" allowfullscreen autoplay></iframe>
        </el-row>
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

        <el-tabs class="tabs" v-model="activeTab">
          <el-tab-pane label="시나리오 수정" name="first">
            <!-- <sc-editor /> -->
            <h1>TODO: 시나리오 수정~</h1>
          </el-tab-pane>
          <!-- <el-tab-pane label="시나리오 지식맵 수정" name="second">
            <div style="width: 100%; height: 100%;">
              <knowledge-map />
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="시나리오 아이템 수정" name="third">
            <h1>TODO: 시나리오 아이템 수정~</h1>
            <!-- <el-row :gutter="30" class="sc-row">
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
                  <h1>아이템 편집</h1>
                  <sc-common-editor />
                  <sc-material-editor
                    v-if="currentEditingScItemType === '강의자료'
                    || currentEditingScItemType === '숙제'"
                  />
                  <sc-survey-editor v-if="currentEditingScItemType === '설문'" />
                  <div v-if="currentEditingScItemType === '문항'">
                    TODO: 문항~~
                  </div>
                  <sc-active-time-editor />

                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
          <!-- <el-tab-pane label="시나리오 삭제" name="fourth">
            <el-row>
              <el-col style="max-width: 600px;">
                <el-form label-width="120px">
                  <el-form-item label="시나리오 삭제">
                    <el-button type="primary" @click="onClickDelete">시나리오 삭제</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane> -->
        </el-tabs>
        <el-row>
          <div class="statusbar"  v-bind:class="{ activeInfo: isActiveInfo}" @click="onClick('OPEN_STATUS_INFO')">
            <teacher-lecture-live-summary :SummaryData="SummaryData" />
          </div>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
  .statusbar {
    position:fixed;
    left:0px;
    bottom:0px;
    width:100%;
    padding: 8px 0px 5px 0px;
    background:rgba(0, 0, 0, 0.6);
    color: white;
    -webkit-transition: max-height 1s;
    -moz-transition: max-height 1s;
    -ms-transition: max-height 1s;
    -o-transition: max-height 1s;
    transition: max-height 1s;
    overflow: hidden;
    height:100%;
    max-height:25px;
  }
  .video {
    background-color: black;
    min-height: 500px;
  }
  .statusbar.activeInfo{
    max-height: 85%;

  }

  .lecture-name {
    margin: 8px 0;
    // background-color: red;
  }

  // .current-lecture-time {
  //   margin: 8px 0;
  //   background-color: red;
  // }

  // .elapsed-time {
  //   margin: 8px 0;
  //   background-color: pink;
  // }
</style>

<script>
  import { mapGetters } from 'vuex';

  import Sc from '../partials/Sc';
  import ScItemAdder from '../partials/ScItemAdder';
  import ScItemSummary from '../partials/ScItemSummary';
  import ScMaterialEditor from '../partials/ScMaterialEditor';
  import ScActiveTimeEditor from '../partials/ScActiveTimeEditor';
  import ScCommonEditor from '../partials/ScCommonEditor';
  import TeacherLectureLiveSummary from '../partials/TeacherLectureLiveSummary';


  export default {
    name: 'TeacherLectureLive',
    components: {
      Sc,
      ScItemAdder,
      ScItemSummary,
      ScCommonEditor,
      ScMaterialEditor,
      ScActiveTimeEditor,
      TeacherLectureLiveSummary,
    },
    data() {
      // TODO: translate
      return {
        activeTab: 'first',
        scTitle: '4강 (배열)', // TODO: replace
        scType: '강의', // TODO: replace
        SummaryData: [],
        isCloseMovie: false,
        isCloseStatusbar: false,
        isActiveInfo: false,
      };
    },
    methods: {
      onClick(type) {
        const vm = this;
        switch (type) {
          case 'OPEN_STATUS_INFO': {
            vm.isActiveInfo = !vm.isActiveInfo;
          }
        }
      },
    },
    computed: {
      ...mapGetters('teacher', [
        'isScEmpty',
        // 'scType', // TODO: uncomment
      ]),
    },
  };
</script>
