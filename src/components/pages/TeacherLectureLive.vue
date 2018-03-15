<template>
  <div>
    <el-container>
      <el-aside width="150px">
        <!-- <teaching-class-list-aside /> -->
      </el-aside>
      <el-main>
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
                  <sc-item-adder />
                </div>
              </el-col>
            </el-row>

            <el-row
              v-show="currentEditingScItem"
              :gutter="30"
            >
              <el-col :span="24">
                <br />
                <h1>강의 중 임시 활성화</h1>
                <p>* 임시 활성화는 기존에 세팅되어있던 값을 덮어씌우지 않지만, 취소하지 않는 한 계속 활성화됩니다.</p>
                <el-button type="primary" @click="onClick('TEMP_ACTIVATE')">
                  임시 활성화
                </el-button>
                <el-button type="primary" @click="onClick('TEMP_DEACTIVATE')">
                  임시 활성화 취소
                </el-button>
                <br />
                <br />
                <br />
              </el-col>
            </el-row>

            <div id="app_lecture_editor" v-show="!isScEmpty">
              <el-row :gutter="30">
                <el-col :span="24">
                  <h1>아이템 편집</h1>
                  <sc-common-editor />
                  <sc-material-editor v-if="currentEditingScItemType === '강의자료'" />
                  <sc-homework-editor v-if="currentEditingScItemType === '숙제'" />
                  <sc-survey-editor v-if="currentEditingScItemType === '설문'" />
                  <sc-question-editor v-if="currentEditingScItemType === '문항'" />
                  <sc-active-time-editor />

                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- <el-tabs class="tabs" v-model="activeTab">
          <el-tab-pane label="시나리오 수정" name="first">
            <h1>TODO: 시나리오 수정~</h1>
          </el-tab-pane>
          <el-tab-pane label="시나리오 아이템 수정" name="third">
            <h1>TODO: 시나리오 아이템 수정~</h1>
          </el-tab-pane>
        </el-tabs> -->
        <el-row>
          <div class="video-wrapper">
            <i v-show="!isInfoVisible"
              :class="iconClass"
              @click="onClick('PLAYER_TOGGLE')"
            >
            </i>
            <div v-show="isPlayerVisible">
              <youtube
                id="video"
                :video-id="youtubeId"
                player-width="500"
                player-height="300"
                :player-vars="{
                  autoplay: 1,
                }"
                :mute="true"
              >
              </youtube>
            </div>
            <!-- <iframe
              width="500px"
              height="300px"
              :src="youtubeId"
              frameborder="0"
              allowfullscreen
              autoplay
            >
            </iframe> -->
          </div>
          <div class="statusbar" v-bind:class="{ activeInfo: isInfoVisible}">
            <div class="statusbar_for_click" @click="onClick('TOGGLE_STATUS_INFO')"></div>
            <teacher-lecture-live-summary :lectureId= "Number.parseInt($route.params.scId, 10)"/>
          </div>
        </el-row>
      </el-main>
    </el-container>
    <!--
    <h1>debug</h1>
    현재시간 : {{now}}<br/>
    활성화 시각 : {{scStartDate}}<br/>
    활성화 시각 이후 : {{afterStartDateOffsetSec}} sec<br/> -->
  </div>
</template>

<style lang="scss" scoped>
  @import "~@/variables.scss";

  .video-wrapper {
    position: fixed;
    right: 0;
    bottom: 30px;
    text-align: right;
    .toggle-icon {
      color: $app-ultra-violet;
      margin: 5px;
    }
  }

  .editor {
    background-color: white;
    padding: 1.5vh 2.5vw;
    border-radius: 5px;

    .sc-row {
      padding: 20px;
      background-color: $app-oatmeal;
    }
  }
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
  .statusbar_for_click{
    width:100%;
    height:30px;
    position:absolute;
    z-index:999;
  }
  .statusbar.activeInfo{
    max-height: 85%;
  }
  // .video {
  //   background-color: black;
  //   min-height: 500px;
  // }


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
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { getIdFromURL } from 'vue-youtube-embed';

import Sc from '../partials/Sc';
import ScItemAdder from '../partials/ScItemAdder';
import ScItemSummary from '../partials/ScItemSummary';
import ScMaterialEditor from '../partials/ScMaterialEditor';
import ScActiveTimeEditor from '../partials/ScActiveTimeEditor';
import ScHomeworkEditor from '../partials/ScHomeworkEditor';
import ScSurveyEditor from '../partials/ScSurveyEditor';
import ScCommonEditor from '../partials/ScCommonEditor';
import ScQuestionEditor from '../partials/ScQuestionEditor';
import TeacherLectureLiveSummary from '../partials/TeacherLectureLiveSummary';
import utils from '../../utils';

export default {
  name: 'TeacherLectureLive',
  components: {
    Sc,
    ScItemAdder,
    ScItemSummary,
    ScCommonEditor,
    ScQuestionEditor,
    ScMaterialEditor,
    ScHomeworkEditor,
    ScSurveyEditor,
    ScActiveTimeEditor,
    TeacherLectureLiveSummary,
  },
  created() {
    this.$socket.connect();
    const vm = this;
    vm.sUpdateTimelineLogIntervalId = setInterval(() => {
      const params = {
        lecture_id: Number.parseInt(vm.$route.params.scId, 10),
      };
      vm.$socket.emit('UPDATE_TIMELINE_LOG', JSON.stringify(params));
    }, 18000);
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: Number.parseInt(vm.$route.params.scId, 10),
        user_id: utils.getUserIdFromJwt(),
      };
      console.log(params2);
      this.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);
  },
  async beforeMount() {
    const vm = this;
    vm.youtubeId = getIdFromURL(vm.$route.query.link);
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    await vm.getSc();
    vm.updateScVideoLink({ scVideoLink: vm.$route.query.link });
    vm.putSc();
    vm.elapsedTimeIntervalId = vm.updateOffsetSecNowDate();
    // TODO: handle sc empty
    if (!vm.isScEmpty) {
      vm.updateCurrentEditingScItemIndex({
        currentEditingScItemIndex: 0,
      });
      // 문항, 강의자료의 id가 이 단계에서 얻어짐 => getItemKeywords() 함수에서 이 id를 이용
      await vm.getScItem({
        scItemId: vm.currentEditingScItem.id,
      });
      if (['문항', '강의자료'].includes(vm.currentEditingScItemType)) {
        vm.getItemKeywords();
      }
    }
      const params = {
        lecture_id : Number.parseInt(vm.$route.params.scId, 10),
      };
      vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
  },
  data() {
    // TODO: translate
    return {
      activeTab: 'first',
      SummaryData: [],
      isInfoVisible: false,
      lectureId: 1,
      youtubeId: '',
      isPlayerVisible: true,
      elapsedTimeIntervalId: null,
      sUpdateTimelineLogIntervalId: null,
      sHeartbeatIntervalId: 0,
    };
  },
  methods: {
    ...mapMutations('sc', [
      'updateScId',
      'updateScVideoLink',
    ]),
    ...mapMutations('scItem', [
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('sc', [
      'getSc',
      'putSc',
      'updateOffsetSecNowDate',
    ]),
    ...mapActions('scItem', [
      'getScItem',
      'getItemKeywords',
      'setActivated',
      'setDeactivated',
    ]),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'TOGGLE_STATUS_INFO': {
          vm.isInfoVisible = !vm.isInfoVisible;
          vm.isPlayerVisible = false;
          break;
        }
        case 'PLAYER_TOGGLE': {
          vm.isPlayerVisible = !vm.isPlayerVisible;
          break;
        }
        case 'TEMP_ACTIVATE': {
          console.log('ta'); // eslint-disable-line
          const params = {
            opened: 1,
            lecture_item_id: vm.currentEditingScItem.id,
            lecture_id: Number.parseInt(vm.$route.params.scId, 10),
          };
          this.$socket.emit('LECTURE_ITEM_ACTIVATION', JSON.stringify(params));
          vm.setActivated(vm);
          break;
        }
        case 'TEMP_DEACTIVATE': {
          console.log('tda'); // eslint-disable-line
          const params = {
            opened: 0,
            lecture_item_id: vm.currentEditingScItem.id,
            lecture_id: Number.parseInt(vm.$route.params.scId, 10),
          };
          this.$socket.emit('LECTURE_ITEM_ACTIVATION', JSON.stringify(params));
          vm.setDeactivated(vm);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
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
    iconClass() {
      const vm = this;
      return {
        'toggle-icon': true,
        fa: true,
        'fa-2x': true,
        'fa-eye-slash': vm.isPlayerVisible,
        'fa-eye': !vm.isPlayerVisible,
      };
    },
  },
  beforeDestory() {
    this.$socket.close();
    clearInterval(vm.sHeartbeatIntervalId);
  },
  destroyed() {
    const vm = this;
    clearInterval(vm.elapsedTimeIntervalId);
    clearInterval(vm.sUpdateTimelineLogIntervalId);
  },
};
</script>
