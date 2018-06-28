<template>
<br><br/>
  <div id="teacher_lecture_live_wrapper" class="bt-container">
      <h2>{{ path }}</h2>
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
      </el-col>
      <el-col :span="12">
        <teacher-lecture-live-item
        v-if="currentLectureItemId !== -1"
        :lectureItemId="currentLectureItemId"
        :onClick="onClick"
        :isAuto="isAuto"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <teacher-lecture-live-item-list
          :dataList="tableItemList"
          :onClick="onClick"
          :isAuto="isAuto"
        />
      </el-col>
      <!-- // TODO : 실시간 질문
      <el-col :span="12">
        <teacher-lecture-live-chat
          v-if="isAuto === false"
        />
      </el-col>
      -->
    </el-row>
    <div class="statusbar">
      <teacher-lecture-live-summary :lectureId="lectureId"/>
    </div>
  </div>
</template>

<script>
// FIXME : Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('<URL>')
//   does not match the recipient window's origin ('<URL>'). 에러 해결
import { getIdFromURL } from 'vue-youtube-embed';
import lectureService from '../../services/lectureService';
import classService from '../../services/classService';
import TeacherLectureLiveItemList from '../partials/TeacherLectureLiveItemList';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import TeacherLectureLiveChat from '../partials/TeacherLectureLiveChat';
import TeacherLectureLiveSummary from '../partials/TeacherLectureLiveSummary';
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
    const res3 = await lectureService.getOpenedLectureItem({ lectureId: vm.lectureId });
    if (res3.data !== null) {
      vm.currentLectureItemId = res3.data.lecture_item_id;
    }
  },
  data() {
    return {
      tableItemList: [],
      currentLectureItemId: -1,
      path: '',
      isAuto: false,
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
    youtubeId: () => (getIdFromURL('https://www.youtube.com/watch?v=actDWRiD9RI&list=UUEgIN0yG3PeVF4JfJ-ZG0UQ')),
  },
  components: {
    TeacherLectureLiveItemList,
    TeacherLectureLiveItem,
    TeacherLectureLiveChat,
    TeacherLectureLiveSummary,
  },
  methods: {
    onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SHOW': {
          if (vm.currentLectureItemId !== -1) {
            vm.$notify({
              title: '알림',
              message: '다른 아이템을 보이려면 기존 아이템을 내려주세요.',
              type: 'warning',
            });
            break;
          }
          vm.currentLectureItemId = data;
          const params = {
            lecture_id: Number.parseInt(vm.lectureId, 10),
            opened: 1,
            lecture_item_id: Number.parseInt(vm.currentLectureItemId, 10),
          };
          vm.$socket.emit('LECTURE_ITEM_ACTIVATION', JSON.stringify(params));
          break;
        }
        case 'HIDE': {
          const params = {
            lecture_id: Number.parseInt(vm.lectureId, 10),
            opened: 0,
            lecture_item_id: Number.parseInt(vm.currentLectureItemId, 10),
          };
          vm.$socket.emit('LECTURE_ITEM_ACTIVATION', JSON.stringify(params));
          vm.currentLectureItemId = -1;
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
</style>