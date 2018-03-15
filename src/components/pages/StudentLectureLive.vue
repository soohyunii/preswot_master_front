<template>
  <div>
    <el-row>
      <el-col>
        <youtube
          id="video"
          :video-id="youtubeId"
          :player-width="playerWidth"
          :player-height="(playerWidth * 10) / 16"
        >
        </youtube>
      </el-col>
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
              <sc-common-viewer />
              <sc-material-viewer v-if="currentEditingScItemType === '강의자료'" />
              <sc-homework-viewer v-if="currentEditingScItemType === '숙제'" />
              <sc-survey-viewer v-if="currentEditingScItemType === '설문'" />
              <sc-question-viewer v-if="currentEditingScItemType === '문항'" />
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
import { getIdFromURL } from 'vue-youtube-embed';

import Sc from '../partials/Sc';
import StudentLectureLiveSummary from '../partials/StudentLectureLiveSummary';
import ScCommonViewer from '../partials/ScCommonViewer';
import ScMaterialViewer from '../partials/ScMaterialViewer';
import ScHomeworkViewer from '../partials/ScHomeworkViewer';
import ScSurveyViewer from '../partials/ScSurveyViewer';
import ScQuestionViewer from '../partials/ScQuestionViewer';
import utils from '../../utils';


export default {
  name: 'StudentLectureLive',
  components: {
    Sc,
    StudentLectureLiveSummary,
    ScCommonViewer,
    ScMaterialViewer,
    ScHomeworkViewer,
    ScSurveyViewer,
    ScQuestionViewer,
  },
  created() {
    this.$socket.connect();
    const vm = this;
    const params = {
      lecture_id : Number.parseInt(vm.$route.params.scId, 10),
    }
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    console.log('socket connected'); // eslint-disable-line
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params = {
        lecture_id: Number.parseInt(vm.$route.params.scId, 10),
        user_id: utils.getUserIdFromJwt(),
      };
      this.$socket.emit('HEART_BEAT', JSON.stringify(params));
    }, 3000);
  },
  data() {
    return {
      isCloseMovie: false,
      isCloseStatusbar: false,
      SummaryData: [],
      sHeartbeatIntervalId: 0,
      youtubeId: '',
      playerWidth: 1000,
    };
  },
  async beforeMount() {
    const vm = this;
    vm.youtubeId = 'TODO:replace';
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    await vm.getSc();
    await vm.$nextTick();
    vm.youtubeId = getIdFromURL(vm.scVideoLink);
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
    const params = {
      lecture_id : Number.parseInt(vm.$route.params.scId, 10),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
  },
  mounted() {
    this.$socket.on('RELOAD_LECTURE_ITEM', (msg) => {
      const jsonMSG = JSON.parse(msg);
      if (jsonMSG.reload === true) {
        // do refresh scenario when socket detected
        this.updateScenario();
      }
    });
  },
  async updated() {
    const vm = this;
    await vm.$nextTick();
    const displayWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.getElementsByName('body')[0].clientWidth;
    vm.playerWidth = (displayWidth * 9.5) / 10;
  },
  computed: {
    ...mapState('sc', ['scTitle', 'scType', 'scStartDate', 'scVideoLink']),
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
    updateScenario() {
      alert('시나리오 변경이 일어났습니다. 새로고침이 필요합니다'); // eslint-disable-line
      const vm = this;
      vm.getSc();
      // TODO : 학생이 문제를 보고 풀 수 있는 공간에 대한 업데이트도 수행되야 함
      // vm.getScItem({
      //   scItemId: vm.currentEditingScItem.id,
      // });
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.$socket.close();
  },
  destroyed() {
    clearInterval(vm.sHeartbeatIntervalId);
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
