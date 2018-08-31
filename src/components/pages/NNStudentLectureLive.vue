<template>
  <div class="bt-container">
    <template v-if="$isPhone">
      <h2>{{ path }}</h2>
      <youtube
        v-show="focusVideoFlag"
        id="video"
        :video-id="youtubeId"
        player-width="100%"
        player-height="300px"
        :player-vars="{ autoplay: 1 }"
        :mute="true"/>
      <div v-if="materialLink === ''">
        선택된 자료가 없습니다. [강의자료] 탭에서 <i class="el-icon-view"/> 아이콘을 눌러주세요.
      </div>
      <div v-else>
        <iframe v-show="focusMaterialFlag" frameborder="0" :src="materialLink" width="100%" height="400"></iframe>
      </div>
      <div>
        <el-button v-show="focusVideoFlag" type="primary" size="small" @click="onClick('FOCUSVIDEO')">강의영상 숨기기</el-button>
        <el-button v-show="!focusVideoFlag" type="primary" size="small" @click="onClick('FOCUSVIDEO')">강의영상 보이기</el-button>
        <el-button v-show="focusMaterialFlag" type="primary" size="small" @click="onClick('FOCUSMATERIAL')">강의자료 숨기기</el-button>
        <el-button v-show="!focusMaterialFlag" type="primary" size="small" @click="onClick('FOCUSMATERIAL')">강의자료 보이기</el-button>
      </div>
      <br/>
      <el-tabs type="card">
        <el-tab-pane label="강의아이템">
          <div v-for="(item, index) in lectureItem" :key="index">
              <lecture-live-item
                :data="item"
                :onClick="onClick"
                :answerSubmitted="submitFlag.get(item.lecture_item_id)"
                :lectureType="lectureType"
                type="STUDENT"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="강의자료">
          <lecture-live-material
            :materialList="materialList"
            :presentMaterial="presentMaterial"
            />
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-if="!$isPhone">
      <h2>{{ path }}</h2>
      <el-row :gutter="20">
        <el-col :span="12">
          <div v-if="videoLink === ''">
            등록된 영상이 없습니다.
          </div>
          <div v-else>
            <youtube
              v-show="focusVideoFlag"
              id="video"
              :video-id="youtubeId"
              player-width="100%"
              player-height="400px"
              :player-vars="{ autoplay: 1 }"
              :mute="true">
            </youtube>
            <div style="float: right">
              <el-button v-show="focusVideoFlag" type="primary" @click="onClick('FOCUSVIDEO')">강의영상 숨기기</el-button>
              <el-button v-show="!focusVideoFlag" type="primary" @click="onClick('FOCUSVIDEO')">강의영상 보이기</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="materialLink === ''">
            선택된 자료가 없습니다. [강의자료] 탭에서 <i class="el-icon-view"/> 아이콘을 눌러주세요.
          </div>
          <div v-else>
            <iframe v-show="focusMaterialFlag" frameborder="0" :src="materialLink" width="100%" height="400"></iframe>
            <div style="float: right">
              <el-button v-show="focusMaterialFlag" type="primary" @click="onClick('FOCUSMATERIAL')">강의자료 숨기기</el-button>
              <el-button v-show="!focusMaterialFlag" type="primary" @click="onClick('FOCUSMATERIAL')">강의자료 보이기</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="itemSize">
          <el-tabs type="card">
            <el-tab-pane label="강의아이템">
              <div v-if="lectureItem.length === 0">
                강사님의 신호를 기다리는 중입니다.
              </div>
              <div v-else>
                <el-button v-show="!pauseFlag && lectureType === 2" type="primary" @click="onClick('PAUSE')">일시정지</el-button>
                <el-button v-show="pauseFlag && lectureType === 2" type="primary" @click="onClick('RESTART')">재시작</el-button>
                <br>
                <div v-for="(item, index) in lectureItem" :key="index">
                    <lecture-live-item
                      :data="item"
                      :onClick="onClick"
                      :answerSubmitted="submitFlag.get(item.lecture_item_id)"
                      :lectureType="lectureType"
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
                :presentMaterial="presentMaterial"
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
    <el-dialog
      title="Info"
      :visible.sync="continueDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="220px">
      <!-- :before-close="handleClose"> -->
      <span>강의를 이어서 보시겠습니까?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueLecture(true)">예</el-button>
        <el-button type="primary" @click="continueLecture(false)">아니오</el-button>
      </span>
    </el-dialog>
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
  name: 'NNStudentLectureLive',
  async created() {
    const vm = this;
    // 소켓 연결 및 주기적으로 보내는 신호, 리스너 등록
    vm.$socket.connect();
    vm.joinTime = Date.now();
    vm.lectureId = Number.parseInt(vm.$route.params.lectureId, 10);
    // 강의 아이템 목록, 첨부파일 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    res.data.lecture_items.forEach((item) => {
      vm.submitFlag.set(item.lecture_item_id, false);
    });
    /*
     *  lectureType : 0 (유인 강의), 1(무인 단체 강의), 2(무인 개인 강의)
     */
    vm.lectureType = res.data.type;
    if (res.data.video_link !== null) {
      vm.videoLink = res.data.video_link;
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

    const res3 = await lectureService.getLectureMaterial({
      lectureId: vm.lectureId,
    });
    vm.materialList = res3.data;

    const params = {
      lecture_id: vm.lectureId,
      user_id: utils.getUserIdFromJwt(),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: vm.lectureId,
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
      vm.timer = [];
      const res4 = await automaticLectureService.offlineJoin({
        lectureId: vm.lectureId,
      });
      res4.data.items.forEach((item) => {
        vm.timer.push(setTimeout(() => {
          vm.lectureItem = [];
          vm.lectureItem.push(item);
        }, item.offset * 1000));
      });
    } else if (vm.lectureType === 2) {
      const res5 = await automaticLectureService.onlineJoin({
        lectureId: vm.lectureId,
      });
      if (res5.data.offset === -1) {
        vm.continueLecture(false);
      } else {
        vm.continueDialogVisible = true;
      }
      vm.pauseFlag = false;
    }
  },
  data() {
    return {
      path: '', // 과목 , 강의 제목 이름
      lectureId: undefined,
      lectureItem: [], // 현재 표시중인 강의 아이템
      lectureType: undefined,
      materialList: undefined, // 강의자료 목록
      additionalList: undefined, // 참고자료 목록
      joinTime: undefined, // 학생이 강의에 입장한 시간
      timer: [],
      pastLectureItem: {
        lectureItemId: undefined,
        offset: undefined,
      },
      pauseFlag: true,
      continueDialogVisible: false,
      continueFlag: false,
      submitFlag: new Map(),
      videoLink: '',
      itemSize: 16,
      materialLink: '',
      focusMaterialFlag: true,
      focusVideoFlag: true,
    };
  },
  computed: {
    youtubeId() {
      return getIdFromURL(this.videoLink);
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
  mounted() {
    const vm = this;
    // eslint-disable-next-line
    window.onbeforeunload = function () {
      const param = {
        lecture_id: vm.lectureId,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('LEAVE_LECTURE', JSON.stringify(param));
    };
  },
  methods: {
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SUBMIT': {
          vm.submitFlag.set(data.lectureItemId, true);
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
                lecture_item_id: Number.parseInt(data.lectureItemId, 10),
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
                lecture_item_id: Number.parseInt(data.lectureItemId, 10),
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
        case 'FOCUSVIDEO': {
          if (vm.focusVideoFlag) {
            vm.focusVideoFlag = false;
            if (!vm.focusMaterialFlag) {
              vm.itemSize = 24;
            }
          } else {
            vm.focusVideoFlag = true;
            vm.itemSize = 16;
          }
          break;
        }
        case 'FOCUSMATERIAL': {
          if (vm.focusMaterialFlag) {
            vm.focusMaterialFlag = false;
            if (!vm.focusVideoFlag) {
              vm.itemSize = 24;
            }
          } else {
            vm.focusMaterialFlag = true;
            vm.itemSize = 16;
          }
          break;
        }
        case 'PAUSE': {
          vm.pauseFlag = true;
          vm.leaveOnlineLecture();
          break;
        }
        case 'RESTART': {
          vm.pauseFlag = false;
          vm.continueLecture(true);
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
    presentMaterial(data) {
      const vm = this;
      vm.materialLink = `http://docs.google.com/gview?url=${data}&embedded=true`;
    },
    async getLectureItem() {
      const vm = this;
      vm.timer = [];
      const res4 = await automaticLectureService.onlineJoin({
        lectureId: vm.lectureId,
      });
      let lectureItemList;
      if (vm.continueFlag === true) {
        lectureItemList = res4.data.items;
      } else {
        lectureItemList = res4.data.rawItems;
      }
      const result = vm.groupBy(lectureItemList, item => [item.offset]);
      vm.pastLectureItem.lectureItemId = res4.data.items[0].lecture_item_id;
      vm.pastLectureItem.offset = res4.data.offset;
      result.forEach((item) => {
        vm.timer.push(setTimeout(() => {
          vm.joinTime = Date.now();
          vm.lectureItem = [];
          vm.lectureItem = item;
        }, item[0].offset * 1000));
      });
    },
    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(group => groups[group]);
    },
    continueLecture(flag) {
      const vm = this;
      vm.joinTime = Date.now();
      vm.continueDialogVisible = false;
      vm.continueFlag = flag;
      vm.getLectureItem();
    },
    leaveOnlineLecture() {
      const vm = this;
      let offset = vm.participationTime;
      if (vm.lectureItem[0]
        && vm.lectureItem[0].lecture_item_id === vm.pastLectureItem.lectureItemId
        && vm.continueFlag) {
        offset += vm.pastLectureItem.offset;
      }
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
      vm.timer.forEach((item) => {
        clearTimeout(item);
      });
      // clearTimeout(vm.timer);
    },
  },
  beforeDestroy() {
    const vm = this;
    const param = {
      lecture_id: vm.lectureId,
      user_id: utils.getUserIdFromJwt(),
    };
    vm.$socket.emit('LEAVE_LECTURE', JSON.stringify(param));
    /*
     *  무인 강의에서 학생이 강의에서 나갈 경우, 강의 수강 시간을 알기 위해
     *  최근에 듣던 강의 아이템과 해당 강의 아이템 시작으로부터의 경과 시간을 보냄
     */
    vm.$socket.close();
    if (vm.lectureType === 1) {
      automaticLectureService.offlineLeave({
        lectureId: vm.lectureId,
      });
    } else if (vm.lectureType === 2) {
      vm.leaveOnlineLecture();
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
