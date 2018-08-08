<template>
  <div oncontextmenu="return false">
    <el-row v-if="isVideoVisible">
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

        <div id="app_lecture_editor" v-show="!isScEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              <sc-common-viewer />
              <sc-material-viewer v-if="currentEditingScItemType === '강의자료'" />
              <sc-homework-viewer v-if="currentEditingScItemType === '숙제'" />
              <sc-survey-viewer v-if="currentEditingScItemType === '설문'" />
              <sc-question-viewer v-if="currentEditingScItemType === '문항'" />
              <discussion v-if="currentEditingScItemType === '토론'" />
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
import isString from 'lodash.isstring';

import Sc from '../partials/Sc';
import StudentLectureLiveSummary from '../partials/StudentLectureLiveSummary';
import ScCommonViewer from '../partials/ScCommonViewer';
import ScMaterialViewer from '../partials/ScMaterialViewer';
import ScHomeworkViewer from '../partials/ScHomeworkViewer';
import ScSurveyViewer from '../partials/ScSurveyViewer';
import ScQuestionViewer from '../partials/ScQuestionViewer';
import discussion from '../partials/Discussion';
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
    discussion,
  },
  created() {
    this.$socket.connect();
    const vm = this;
    const params = {
      lecture_id: Number.parseInt(vm.$route.params.scId, 10),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    console.log('socket connected'); // eslint-disable-line
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: Number.parseInt(vm.$route.params.scId, 10),
        user_id: utils.getUserIdFromJwt(),
      };
      this.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);
  },
  data() {
    const vm = this;
    const order = isString(vm.$route.params.order) ?
      vm.$route.params.order.toUpperCase() : 'LIVE';
    /* eslint-disable no-nested-ternary */
    const scOrderFilter =
      order === 'PRE' ? 0 :
      order === 'LIVE' ? 1 :
      order === 'POST' ? 2 :
      1; // default live
    /* eslint-enable no-nested-ternary */
    vm.updateScOrderFilter({
      scOrderFilter,
    });
    return {
      SummaryData: [],
      sHeartbeatIntervalId: 0,
      elapsedTimeIntervalId: 0,
      youtubeId: '',
      playerWidth: 1000,
      fleetingSc: [],
    };
  },
  async beforeMount() {
    const vm = this;
    vm.updateScId({
      scId: Number.parseInt(vm.$route.params.scId, 10),
    });
    await vm.getSc();
    vm.updateOffsetSecNowDate();
    await vm.$nextTick();
    if (!vm.scVideoLink) {
      // FIXME: scVideoLink가 없을 떄 처리하기
      return;
    }
    vm.youtubeId = getIdFromURL(vm.scVideoLink);
    if (!vm.isScEmpty) {
      vm.updateCurrentEditingScItemIndex({
        currentEditingScItemIndex: null,
      });
    }
    const params = {
      lecture_id: Number.parseInt(vm.$route.params.scId, 10),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
  },
  mounted() {
    const vm = this;
    vm.$socket.on('RELOAD_LECTURE_ITEM', (msg) => {
      const jsonMSG = JSON.parse(msg);
      if (jsonMSG.reload === true) {
        // do refresh scenario when socket detected
        vm.updateScenario();
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
    ...mapState('sc', [
      'scTitle',
      'scType',
      'scStartDate',
      'scVideoLink',
      'scOrderFilter',
    ]),
    ...mapState('scItem', ['sc']),
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
    isVideoVisible() {
      const vm = this;
      switch (vm.scOrderFilter) {
        case 0: // pre
        case 2: { // post
          return false;
        }
        case 1: { // live
          return true;
        }
        default: {
          // eslint-disable-next-line
          console.error(`not defined scOrderFilter ${vm.scOrderFilter}`);
          return true;
        }
      }
    },
  },
  methods: {
    ...mapMutations('sc', [
      'updateScId',
      'updateScOrderFilter',
    ]),
    ...mapMutations('scItem', [
      'updateCurrentEditingScItemIndex',
    ]),
    ...mapActions('sc', [
      'getSc',
      'updateOffsetSecNowDate',
      'clearOffsetSecNowDate',
    ]),
    ...mapActions('scItem', [
      'getScItem',
      'getItemKeywords',
    ]),
    // onClick(type) {
    //   switch (type) {
    //     default: {
    //       throw new Error(`not defined type ${type}`);
    //     }
    //   }
    // },
    async refreshScItems() {
      const vm = this;
      await vm.getSc();
      for (let i = 0; i < vm.fleetingSc.length; i += 1) {
        if (vm.fleetingSc[i].opened !== vm.sc[i].opened &&
          vm.sc[i].opened === 1) {
          vm.updateCurrentEditingScItemIndex({
            currentEditingScItemIndex: i,
          });
          await vm.getScItem({ scItemId: vm.sc[i].id }); // eslint-disable-line
        }
      }
    },
    updateScenario() {
      const vm = this;
      vm.fleetingSc = vm.sc;
      vm.refreshScItems();
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.$socket.close();
    clearInterval(vm.sHeartbeatIntervalId);
    vm.clearOffsetSecNowDate();
  },
  destroyed() {
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
