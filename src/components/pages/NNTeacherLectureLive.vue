<template>
  <div id="teacher_lecture_live_wrapper" class="bt-container">
    <template v-if="$isPhone">
      <h2>{{ path }}</h2><br/>
        <youtube
          id="video"
          :video-id="youtubeId"
          player-width="100%"
          player-height="500px"
          :player-vars="{ autoplay: 1 }"
          :mute="true">
        </youtube>
        <teacher-lecture-live-item-list
          v-if="isTableItemListLoaded"
          :dataList="tableItemList"
          :onClick="onClick"
          :isAuto="isAuto"
        />
    </template>
    <template v-if="!$isPhone">
      <h2>{{ path }}</h2><br/>
        <el-row :gutter="20">
          <el-col :span="12">
            <youtube
              id="video"
              :video-id="youtubeId"
              player-width="100%"
              player-height="500px"
              :player-vars="{ autoplay: 1 }"
              :mute="true">
            </youtube>
          <el-button type="primary" size="small" @click="onClick('SHOWALL', questionItemIdList)">
            문항 모두 보이기
          </el-button>
          <el-button type="primary" size="small" @click="onClick('SHOWALL', surveyItemIdList)">
            설문 모두 보이기
          </el-button>
            <teacher-lecture-live-item-list
              v-if="isTableItemListLoaded"
              :dataList="tableItemList"
              :onClick="onClick"
              :isAuto="isAuto"
            />
          </el-col>
          <el-col :span="12">
            <div v-for="id in currentLectureItemId" :key="id">
              <teacher-lecture-live-item
              :lectureItemId="id"
              :onClick="onClick"
              :isAuto="isAuto"
              />
            </div>
          </el-col>
        </el-row>
        <br />
        <div v-for="(itemId, index) in currentLectureItemId" :key="itemId">
          <el-row>
            <lecture-question-result
              v-if="currentLectureItemId.length > 0 && tableItemList[tableItemIndex[index]] && tableItemList[tableItemIndex[index]].type === 0"
              :classId="classId"
              :itemId="itemId"
              resultType="실시간"/>
            <lecture-survey-result
              v-if="currentLectureItemId.length > 0 && tableItemList[tableItemIndex[index]] && tableItemList[tableItemIndex[index]].type === 1"
              :classId="classId"
              :itemId="itemId"
              resultType="실시간"/>
          </el-row>
        </div>

        <!--
        <el-row :gutter="20">
          <el-col :span="12">
          </el-col>
          // TODO : 실시간 질문
          <el-col :span="12">
            <teacher-lecture-live-chat
              v-if="isAuto === false"
            />
          </el-col>
        </el-row>
        -->
        <div class="statusbar" v-bind:class="{ activeInfo: isInfoVisible}">
        <div class="statusbar_for_click" @click="onClick('TOGGLE_STATUS_INFO')"></div>
        <teacher-lecture-live-summary :lectureId= "lectureId"/>
      </div>
    </template>
  </div>
</template>

<script>
// FIXME : Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('<URL>')
//   does not match the recipient window's origin ('<URL>'). 에러 해결
import { getIdFromURL } from 'vue-youtube-embed';
import deepCopy from 'deep-copy';
import lectureService from '../../services/lectureService';
import classService from '../../services/classService';
import TeacherLectureLiveItemList from '../partials/TeacherLectureLiveItemList';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import TeacherLectureLiveChat from '../partials/TeacherLectureLiveChat';
import TeacherLectureLiveSummary from '../partials/TeacherLectureLiveSummary';
import LectureQuestionResult from '../partials/LectureQuestionResult';
import LectureSurveyResult from '../partials/LectureSurveyResult';
import utils from '../../utils';

export default {
  name: 'TeacherLectureLive',
  async created() {
    const vm = this;
    // 강의 아이템 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    vm.tableItemList = res.data.lecture_items;
    // sequence 순서대로 강의 아이템 정렬
    vm.tableItemList.sort((a, b) => {
      const aItemSequence = Number(a.sequence);
      const bItemSequence = Number(b.sequence);
      return aItemSequence - bItemSequence;
    });
    const res2 = await classService.getClass({
      id: res.data.class_id,
    });
    vm.path = res2.data.name.concat(' > ', res.data.name);
    // 소켓 연결 및 주기적으로 보내는 신호 설정
    vm.$socket.connect();
    const params = {
      lecture_id: Number.parseInt(vm.lectureId, 10),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    vm.sUpdateTimelineLogIntervalId = setInterval(() => {
      vm.$socket.emit('UPDATE_TIMELINE_LOG', JSON.stringify(params));
    }, 18000);
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: Number.parseInt(vm.lectureId, 10),
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);

    // opened 상태인 아이템이 이미 있다면 보이기
    // const res3 = await lectureService.getOpenedLectureItem({ lectureId: vm.lectureId });
    // if (res3.data.length !== 0) {
    //   res3.data.forEach((item) => {
    //     vm.currentLectureItemId.push(item.lecture_item_id);
    //     vm.tableItemIndex.push(
    //       vm.tableItemList.findIndex(tableItem =>
    //         tableItem.lecture_item_id === item.lecture_item_id,
    //       ),
    //     );
    //   });
    // }
  },
  data() {
    return {
      tableItemList: [],
      tableItemIndex: [],
      currentLectureItemId: [],
      path: '',
      isAuto: false,
      isInfoVisible: false,
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
    youtubeId: () => (getIdFromURL('https://www.youtube.com/watch?v=actDWRiD9RI&list=UUEgIN0yG3PeVF4JfJ-ZG0UQ')),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
    isTableItemListLoaded() {
      const vm = this;
      if (vm.tableItemList.length === 0) {
        return false;
      }
      return true;
    },
    questionItemIdList() {
      const vm = this;
      return vm.tableItemList.filter(item => item.type === 0).map(item => item.lecture_item_id);
    },
    surveyItemIdList() {
      const vm = this;
      return vm.tableItemList.filter(item => item.type === 1).map(item => item.lecture_item_id);
    },
  },
  components: {
    TeacherLectureLiveItemList,
    TeacherLectureLiveItem,
    TeacherLectureLiveChat,
    TeacherLectureLiveSummary,
    LectureQuestionResult,
    LectureSurveyResult,
  },
  methods: {
    onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SHOWALL': {
          if (vm.currentLectureItemId.length !== 0) {
            vm.$notify({
              title: '알림',
              message: '다른 아이템을 보이려면 기존 아이템을 내려주세요.',
              type: 'warning',
            });
            break;
          }
          vm.currentLectureItemId = deepCopy(data);
          const params = [];
          vm.currentLectureItemId.forEach((item) => {
            vm.tableItemIndex.push(
              vm.tableItemList.findIndex(tableItem =>
                tableItem.lecture_item_id === item),
            );
            const param = {
              lecture_id: Number.parseInt(vm.lectureId, 10),
              opened: 1,
              lecture_item_id: item,
            };
            params.push(param);
          });
          vm.$socket.emit('LECTURE_ITEMS_ACTIVATION', JSON.stringify(params));
          break;
        }
        case 'SHOW': {
          if (!vm.currentLectureItemId.includes(data)) {
            const itemIndex = vm.tableItemList.findIndex(tableItem =>
                tableItem.lecture_item_id === data);
            let putIndex = 0;
            /*
             *  여러 강의 아이템을 'SHOW' 하는 경우, 미리 설정된 sequence를 기준으로 정렬
             */
            for (let i = 0; i < vm.tableItemIndex.length; i += 1) {
              if (itemIndex < vm.tableItemIndex[i]) {
                putIndex = i;
                break;
              }
              if (i + 1 === vm.tableItemIndex.length) {
                putIndex = i + 1;
              }
            }
            vm.currentLectureItemId.splice(putIndex, 0, data);
            vm.tableItemIndex.splice(putIndex, 0, itemIndex);
            const param = {
              lecture_id: Number.parseInt(vm.lectureId, 10),
              opened: 1,
              lecture_item_id: data,
            };
            vm.$socket.emit('LECTURE_ITEMS_ACTIVATION', JSON.stringify([param]));
          }
          break;
        }
        case 'HIDE': {
          const param = {
            lecture_id: Number.parseInt(vm.lectureId, 10),
            opened: 0,
            lecture_item_id: data,
          };
          vm.$socket.emit('LECTURE_ITEMS_ACTIVATION', JSON.stringify([param]));
          const itemIndex = vm.currentLectureItemId.findIndex(id => id === data);
          vm.currentLectureItemId.splice(itemIndex, 1);
          vm.tableItemIndex.splice(itemIndex, 1);
          break;
        }
        case 'SUBMIT': {
          vm.$notify({
            title: '알림',
            message: '이 버튼은 현재 수강중인 학생만 이용할 수 있습니다.',
            type: 'warning',
          });
          break;
        }
        case 'TOGGLE_STATUS_INFO': {
          vm.isInfoVisible = !vm.isInfoVisible;
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
  beforeDestroy() {
    this.$socket.close();
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  border-radius: 4px;
  min-height: 500px;
}
.bg-purple-light {
  background: #e5e9f2;
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
</style>
