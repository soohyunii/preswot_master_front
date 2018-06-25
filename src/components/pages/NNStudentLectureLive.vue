<template>
  <div>
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
        <el-tabs type="card">
          <el-tab-pane label="강의아이템">
            <lecture-live-item
              :data="lectureItem"
              :onClick="onClick"/>
          </el-tab-pane>
          <el-tab-pane label="강의자료">
            <lecture-live-material
              :materialList="materialList"
              :additionalList="additionalList"
              />
          </el-tab-pane>
          <!-- // TODO : 실시간 질문
          <el-tab-pane label="실시간 질문">
            <el-input v-model="comment" placeholder="내용을 입력해주세요." type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
            <p> 실시간 질문은 강의시간 동안에 강사님만 볼 수 있습니다. </p>
            <el-button type="primary" @click="onClick('SENDREALTIMEQUESTION')">보내기</el-button>
          </el-tab-pane>
          -->
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed';
import studentService from '../../services/studentService';
import classService from '../../services/classService';
import lectureService from '../../services/lectureService';
import LectureLiveItem from '../partials/LectureLiveItem';
import LectureLiveMaterial from '../partials/LectureLiveMaterial';
import utils from '../../utils';

export default {
  name: 'StudentLectureLive',
  async created() {
    const vm = this;
    // 화면 갱신
    vm.refreshLectureItem(false);

    // 강의 아이템 목록, 첨부파일 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    vm.tableItemList = res.data.lecture_items;
    const res2 = await classService.getClass({
      id: res.data.class_id,
    });
    vm.path = res2.data.name.concat(' > ', res.data.name);
    const res3 = await lectureService.getLectureMaterialAdditional({
      lectureId: vm.lectureId,
    });
    vm.materialList = res3.data.material;
    vm.additionalList = res3.data.additional;

    // 소켓 연결 및 주기적으로 보내는 신호, 리스너 등록
    vm.$socket.connect();
    const params = {
      lecture_id: Number.parseInt(vm.lectureId, 10),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: Number.parseInt(vm.lectureId, 10),
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);
    vm.$socket.on('RELOAD_LECTURE_ITEM', (msg) => {
      const jsonMSG = JSON.parse(msg);
      if (jsonMSG.reload === true) {
        vm.refreshLectureItem();
      }
    });
  },
  data() {
    return {
      path: '', // 과목 , 강의 제목 이름
      lectureItem: undefined, // 현재 표시중인 강의 아이템
      materialList: undefined, // 강의자료 목록
      additionalList: undefined, // 참고자료 목록
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
    LectureLiveItem,
    LectureLiveMaterial,
  },
  methods: {
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SUBMIT': {
          switch (data[0]) {
            case 0: { // 문항
              studentService.submitQuestion({
                questionId: data[1],
                answers: data[2],
                interval: 0,
                codeLanguage: undefined,
              });
              vm.$notify({
                title: '알림',
                message: '제출하였습니다.',
                type: 'success',
              });
              break;
            }
            case 1: { // 설문
              studentService.submitSurvey({
                surveyId: data[1],
                answer: data[2],
              });
              vm.$notify({
                title: '알림',
                message: '제출하였습니다.',
                type: 'success',
              });
              break;
            }
            default: {
              throw new Error(`not defined type ${type}`);
            }
          }
          break;
        }
        case 'SENDREALTIMEQUESTION': {
          // vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    async refreshLectureItem(notify) {
      const vm = this;

      // opened 상태인 아이템이 있다면 보이기
      const res3 = await lectureService.getOpenedLectureItem({ lectureId: vm.lectureId });
      if (res3.data !== null) {
        vm.lectureItem = res3.data;
      } else {
        vm.lectureItem = undefined;
      }
      if (notify !== false) {
        vm.$notify({
          title: '알림',
          message: '강의아이템이 변경되었습니다.',
          type: 'warning',
        });
      }

      // FIXME : 강사 화면에서 빠른속도로 아이템 보임/숨김을 조작하는 경우, 가끔 학생 화면에서 반영이 안되는 문제 있음
      // FIXME : 실제 DB에서 가져오는 opened 값이 변하지 않은것을 확인
      // console.log('@refreshLectureItem / getOpenedLectureItem / res3.data.opened = ');
      // console.log(res3.data === null ? null : res3.data.opened);
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