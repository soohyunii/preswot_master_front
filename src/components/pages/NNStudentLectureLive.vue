<template>
  <div>
    <template v-if="$isPhone">
      <h2>{{ path }}</h2>
      <youtube
        v-show="focusFlag"
        id="video"
        :video-id="youtubeId"
        player-width="100%"
        player-height="300px"
        :player-vars="{ autoplay: 1 }"
        :mute="true">
      </youtube>
      <div style="float: right">
        <el-button v-show="focusFlag" type="primary" @click="onClick('FOCUS')">강의영상 숨기기</el-button>
        <el-button v-show="!focusFlag" type="primary" @click="onClick('FOCUS')">강의영상 보이기</el-button>
      </div>
      <el-tabs type="card">
        <el-tab-pane label="강의아이템">
          <lecture-live-item
            :data="lectureItem"
            :onClick="onClick"
            type="STUDENT"/>
        </el-tab-pane>
        <el-tab-pane label="강의자료">
          <lecture-live-material
            :materialList="materialList"
            :additionalList="additionalList"
            />
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-if="!$isPhone">
      <h2>{{ path }}</h2>
      <el-row :gutter="20">
        <el-col :span="12">
          <div v-if="videolink === ''">
            등록된 영상이 없습니다.
          </div>
          <div v-else>
            <youtube
              v-show="focusFlag"
              id="video"
              :video-id="youtubeId"
              player-width="100%"
              player-height="500px"
              :player-vars="{ autoplay: 1 }"
              :mute="true">
            </youtube>
            <div style="float: right">
              <el-button v-show="focusFlag" type="primary" @click="onClick('FOCUS')">강의영상 숨기기</el-button>
              <el-button v-show="!focusFlag" type="primary" @click="onClick('FOCUS')">강의영상 보이기</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-tabs type="card">
            <el-tab-pane label="강의아이템">
              <div v-if="lectureItem.length === 0">
                강사님의 신호를 기다리는 중입니다.
              </div>
              <div v-else>
                <div v-for="(item, index) in lectureItem" :key="index">
                  <lecture-live-item
                    :data="item"
                    :onClick="onClick"
                    type="STUDENT"/>
                </div>
              </div>
              <!-- <el-button style="float:right" type="primary" size="small" @click="onClick('SUBMIT')">제출</el-button> -->
              <!-- <lecture-live-item
                :data="lectureItem"
                :onClick="onClick"/> -->
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
    </template>
  </div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed';
import { setTimeout, clearTimeout } from 'timers';
import classService from '../../services/classService';
import lectureService from '../../services/lectureService';
import studentService from '../../services/studentService';
import LectureLiveItem from '../partials/LectureLiveItem';
import LectureLiveMaterial from '../partials/LectureLiveMaterial';
import utils from '../../utils';
import automaticLectureService from '../../services/automaticLectureService';

export default {
  name: 'StudentLectureLive',
  async created() {
    const vm = this;
    vm.joinTime = Date.now();
    // 강의 아이템 목록, 첨부파일 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    /*
     *  lectureType : 0 (유인 강의), 1(무인 단체 강의), 2(무인 개인 강의)
     */
    vm.lectureType = res.data.type;
    if (res.data.video_link !== null) {
      vm.videolink = res.data.video_link;
    }
    if (vm.lectureType === 0) {
      // 화면 갱신
      vm.refreshLectureItem(false);
    }
    vm.tableItemList = res.data.lecture_items;
    const res2 = await classService.getClass({
      id: res.data.class_id,
    });
    vm.path = res2.data.name.concat(' > ', res.data.name);
    // const res3 = await lectureService.getLectureMaterial({
    //   lectureId: vm.lectureId,
    // });
    // vm.materialList = res3.data.material;
    // vm.additionalList = res3.data.additional;

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
    if (vm.lectureType === 0) {
      vm.$socket.on('RELOAD_LECTURE_ITEMS', (msg) => {
        const jsonMSG = JSON.parse(msg);
        if (jsonMSG.reload === true) {
          vm.refreshLectureItem();
        }
      });
    }
    vm.$socket.on('GET_REALTIME_STAT', (msg) => {
      const jsonMSG = (JSON.parse(msg))[0];
      const result = utils.checkBrowser();
      if (typeof jsonMSG.on_program !== 'undefined' && !jsonMSG.on_program && result.os.includes('Windows') === true) {
        // eslint-disable-next-line
        alert("교육 데이터 수집 프로그램을 실행하셔야 강의에 입장하실 수 있습니다.");
        window.location.href = '/download';
      }
    });
    if (vm.lectureType === 1) {
      const res4 = await automaticLectureService.offlineJoin({
        lectureId: vm.lectureId,
      });
      res4.data.items.forEach((item) => {
        vm.timer = setTimeout(() => {
          vm.lectureItem = [];
          vm.lectureItem.push(item);
        }, item.offset * 1000);
      });
    } else if (vm.lectureType === 2) {
      const res4 = await automaticLectureService.onlineJoin({
        lectureId: vm.lectureId,
      });
      vm.pastLectureItem.lectureItemId = res4.data.items[0].lecture_item_id;
      vm.pastLectureItem.offset = res4.data.offset;
      res4.data.items.forEach((item) => {
        vm.timer = setTimeout(() => {
          vm.joinTime = Date.now();
          vm.lectureItem = [];
          vm.lectureItem.push(item);
        }, item.offset * 1000);
      });
    }
  },
  data() {
    return {
      path: '', // 과목 , 강의 제목 이름
      lectureItem: [], // 현재 표시중인 강의 아이템
      lectureType: undefined,
      materialList: undefined, // 강의자료 목록
      additionalList: undefined, // 참고자료 목록
      joinTime: undefined, // 학생이 강의에 입장한 시간
      timer: undefined,
      pastLectureItem: {
        lectureItemId: undefined,
        offset: undefined,
      },
      focusFlag: true,
      videolink: '',
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
    youtubeId() {
      return getIdFromURL(this.videolink);
    },
    participationTime() {
      const vm = this;
      return Math.floor((Date.now() - vm.joinTime) / 1000);
    },
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
          switch (data.type) {
            case 0: { // 문항
              studentService.submitQuestion({
                questionId: data.questionId,
                answers: data.answer,
                interval: 0,
                codeLanguage: data.language,
              }).then((res) => {
                if (data.questionType === 2) {
                  if (data.answerFile !== undefined && data.answerFile.length !== 0) {
                    for (let i = 0; i < data.answerFile.length; i += 1) {
                      studentService.postAnswerLogFile({
                        studentAnswerLogId: res.data.student_answer_log_id,
                        file: data.answerFile[i].raw,
                      });
                    }
                  }
                }
              });
              vm.$notify({
                title: '알림',
                message: '제출하였습니다.',
                type: 'success',
              });
              const params = {
                lecture_item_id: Number.parseInt(vm.lectureItem.lecture_item_id, 10),
                user_id: utils.getUserIdFromJwt(),
              };
              vm.$socket.emit('DOING_LECTURE_ITEM', JSON.stringify(params));
              vm.lectureItem = [];
              vm.refreshLectureItem(false);
              break;
            }
            case 1: { // 설문
              studentService.submitSurvey({
                surveyId: data.surveyId,
                answer: data.answer,
              });
              vm.$notify({
                title: '알림',
                message: '제출하였습니다.',
                type: 'success',
              });
              const params = {
                lecture_item_id: Number.parseInt(vm.lectureItem.lecture_item_id, 10),
                user_id: utils.getUserIdFromJwt(),
              };
              vm.$socket.emit('DOING_LECTURE_ITEM', JSON.stringify(params));
              vm.lectureItem = [];
              vm.refreshLectureItem(false);
              break;
            }
            default: {
              throw new Error(`not defined type ${type}`);
            }
          }
          break;
        }
        /*
        case 'SENDREALTIMEQUESTION': {
          break;
        }
        */
        case 'FOCUS': {
          if (vm.focusFlag) {
            vm.focusFlag = false;
          } else {
            vm.focusFlag = true;
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    refreshLectureItem(notify) {
      const vm = this;
      // opened 상태인 아이템이 있다면 보이기 : 빠른 속도로 아이템 보임/숨김 조작하는 경우 버그 해결하기위해 1초 지연
      setTimeout(async () => {
        // TODO: 강의 아이템이 여러개인 경우, 빠른 속도로 조작 시 같은 아이템이 중복하여 들어가는 버그 발생
        const res3 = await lectureService.getOpenedLectureItem({ lectureId: vm.lectureId });
        if (res3.data.length !== 0) {
          vm.lectureItem = res3.data;
          // sequence 순서대로 강의 아이템 정렬
          vm.lectureItem.sort((a, b) => {
            const aItemSequence = Number(a.sequence);
            const bItemSequence = Number(b.sequence);
            return aItemSequence - bItemSequence;
          });
        } else {
          vm.lectureItem = [];
        }
        if (notify !== false) {
          vm.$notify({
            title: '알림',
            message: '강의아이템이 변경되었습니다.',
            type: 'warning',
          });
        }
      }, 1000);
    },
  },
  beforeDestroy() {
    const vm = this;
    /*
     *  무인 강의에서 학생이 강의에서 나갈 경우, 강의 수강 시간을 알기 위해
     *  최근에 듣던 강의 아이템과 해당 강의 아이템 시작으로부터의 경과 시간을 보냄
     */
    let offset = vm.participationTime;
    if (vm.lectureItem[0].lecture_item_id === vm.pastLectureItem.lectureItemId) {
      offset += vm.pastLectureItem.offset;
    }
    vm.$socket.close();
    if (vm.lectureType === 1) {
      automaticLectureService.offlineLeave({
        lectureId: vm.lectureId,
      });
    } else if (vm.lectureType === 2) {
      let lectureItemId;
      if (vm.lectureItem.length === 0) {
        lectureItemId = undefined;
      } else {
        lectureItemId = vm.lectureItem[0].lecture_item_id;
      }
      automaticLectureService.onlineLeave({
        lectureId: vm.lectureId,
        lectureItemId,
        offset,
      });
      clearTimeout(vm.timer);
    }
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
