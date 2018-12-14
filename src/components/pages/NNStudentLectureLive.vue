<template>
  <div class="bt-container">
    <template v-if="$isPhone">
      <!--<h2>{{ path }}</h2>-->
      <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
        <el-breadcrumb-item :to="{ path: '/a/student/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ lectureName }}</el-breadcrumb-item>
      </el-breadcrumb>
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
                :answerSubmitted="submitFlag[item.lecture_item_id]"
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
      <!--<h2>{{ path }}</h2>-->
      <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
        <el-breadcrumb-item :to="{ path: '/a/student/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ lectureName }}</el-breadcrumb-item>
      </el-breadcrumb>
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
        <el-col :span="itemSize+8">
          <el-tabs type="card">
            <el-tab-pane label="강의아이템">
              <div v-if="lectureItem.length === 0">
                강사님의 신호를 기다리는 중입니다.
              </div>
              <div v-else>
                <el-button v-show="!pauseFlag && lectureType === 2" type="primary" @click="onClick('PAUSE')">일시정지</el-button>
                <el-button v-show="pauseFlag && lectureType === 2" type="primary" @click="onClick('RESTART')">재시작</el-button>
                <br>
                <el-col :span="itemSize">
                  <div v-for="(item, index) in lectureItem" :key="index" v-if="lectureItem.length < 2">
                    <lecture-live-item
                      :data="item"
                      :onClick="onClick"
                      :answerSubmitted="submitFlag[item.lecture_item_id]"
                      :lectureType="lectureType"
                      type="STUDENT"/>
                  </div>
                  <div v-for="(item, index) in lectureItems" :key="index" v-if="lectureItem.length > 1">
                    <lecture-live-item
                      :data="item"
                      :onClick="onClick"
                      :answerSubmitted="submitFlag[item.lecture_item_id]"
                      :lectureType="lectureType"
                      type="STUDENT"/>
                    <el-button type="primary" @click="onClick('PREV')">이전</el-button>
                    <el-button type="primary" @click="onClick('NEXT')">다음</el-button>
                  </div>
                </el-col>
                <el-col :span="8"><div>
                  <el-table :data="nowQuestion" v-if="lectureItem.length > 1">
                    <el-table-column label="번호">
                      <template slot-scope="scope">
                        {{ scope.row.num }}
                      </template>
                    </el-table-column>
                    <el-table-column label="제출 여부">
                      <template slot-scope="scope">
                        {{ scope.row.soc }}
                      </template>
                    </el-table-column>
                    <el-table-column>
                      <template slot-scope="scope">
                        <el-button size="small" @click="onClick('QUE', scope.row.num)">이동</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div></el-col>
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

    // 강의 아이템 목록, 첨부파일 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
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
    // vm.path = res2.data.name.concat(' > ', res.data.name);
    vm.className = res2.data.name;
    vm.classId = res.data.class_id;
    vm.lectureName = res.data.name;
    const res3 = await lectureService.getLectureMaterial({
      lectureId: vm.lectureId,
    });
    vm.materialList = res3.data;

    const params = {
      lecture_id: vm.lectureId,
      user_id: utils.getUserIdFromJwt(),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    /* 삭제 - 181214
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: vm.lectureId,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);
    */
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
      localLectureId: '', // beforeDestory에서 vm.$route.params.lectureId 를 못읽는 문제가 발생하여 임시 저장
      lectureItem: [], // 현재 표시중인 강의 아이템 - 하나
      lectureItems: [], // 현재 표시중인 강의 아이템 - 둘 이상
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
      submitFlag: {},
      videoLink: '',
      itemSize: 16,
      materialLink: '',
      focusMaterialFlag: true,
      focusVideoFlag: true,
      classId: '',
      className: '',
      lectureName: '',
      questionList: [], // 보기를 섞기 위해
      questionKey: [], // 바뀐 보기들의 순서를 나타내는 key
      nowQuestion: [], // 실시간 문항에 대한 정보용
      nowNum: 0, // 현재 보고 있는 아이템의 번호
      startTime: '', // 학생 로그 제출용
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
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
  },
  components: {
    LectureLiveItem,
    LectureLiveMaterial,
  },
  mounted() {
    const vm = this;
    vm.localLectureId = vm.lectureId; // 선언부 주석 참조
    window.addEventListener('beforeunload', vm.beforeLeave);
  },
  methods: {
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'SUBMIT': {
          vm.$set(vm.submitFlag, data.lectureItemId, true);
          switch (data.type) {
            case 0: { // 문항
              const itemId = data.lectureItemId;
              // 랜덤으로 섞이기 전의 실제 보기 - 정답
              const realAnswer = [];
              if (data.questionType === 0) {
                // 오리지널 보기로 되돌림
                data.answer.forEach((x) => {
                  const realN = vm.questionList.indexOf(itemId);
                  const realA = vm.questionKey[realN][x - 1];
                  realAnswer.push(realA + 1);
                });
              } else {
                realAnswer.push(data.answer[0]);
              }
              // 복수정답일 경우 순서대로 sort
              realAnswer.sort();
              // 학생이 제출했을 때 원래 보기에 맞게 바꿔서 전송
              studentService.submitQuestion({
                questionId: data.questionId,
                answers: realAnswer.length === 0 ? [''] : realAnswer, // length === 0 이면 [''] 보내주세요. 서버 요구사항 181112
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
              const endTime = new Date();
              if (vm.lectureItem.length > 1) {
                // 여러 아이템 중 하나 제출
                /*
                studentService.postLog({
                  id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  lecture_id: vm.lectureId,
                  item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  type: vm.nowQuestion[vm.nowNum].type,
                  order: vm.nowQuestion[vm.nowNum].order,
                  start_time: vm.startTime,
                  end_time: endTime,
                }); */
                const submitlog = {
                  lecture_id: vm.lectureId,
                  user_id: utils.getUserIdFromJwt(),
                  type: vm.nowQuestion[vm.nowNum].type,
                  start_time: vm.startTime,
                  end_time: endTime,
                  item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  answer: realAnswer.length === 0 ? [''] : realAnswer,
                  order: vm.nowQuestion[vm.nowNum].order,
                };
                vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
                vm.nowQuestion[vm.nowNum].soc = 'O';
              } else {
                // 한 아이템 하나 제출
                /*
                studentService.postLog({
                  id: vm.lectureItem[0].lecture_item_id,
                  lecture_id: vm.lectureId,
                  item_id: vm.lectureItem[0].lecture_item_id,
                  type: vm.lectureItem[0].type,
                  order: vm.lectureItem[0].order,
                  start_time: vm.startTime,
                  end_time: endTime,
                }); */
                const submitlog = {
                  lecture_id: vm.lectureId,
                  user_id: utils.getUserIdFromJwt(),
                  type: vm.lectureItem[0].type,
                  start_time: vm.startTime,
                  end_time: endTime,
                  item_id: vm.lectureItem[0].lecture_item_id,
                  answer: realAnswer.length === 0 ? [''] : realAnswer,
                  order: vm.lectureItem[0].order,
                };
                vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
              }
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
              vm.refreshLectureItem(false);
              break;
            }
            case 1: { // 설문
              studentService.submitSurvey({
                surveyId: data.surveyId,
                answer: data.answer.length === 0 ? [''] : data.answer, // length === 0 이면 [''] 보내주세요. 서버 요구사항 181112,
              });
              const endTime = new Date();
              if (vm.lectureItem.length > 1) {
                // 여러 아이템 중 설문
                /*
                studentService.postLog({
                  id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  lecture_id: vm.lectureId,
                  item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  type: vm.nowQuestion[vm.nowNum].type,
                  order: vm.nowQuestion[vm.nowNum].order,
                  start_time: vm.startTime,
                  end_time: endTime,
                }); */
                const submitlog = {
                  lecture_id: vm.lectureId,
                  user_id: utils.getUserIdFromJwt(),
                  type: vm.nowQuestion[vm.nowNum].type,
                  start_time: vm.startTime,
                  end_time: endTime,
                  item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
                  answer: data.answer.length === 0 ? [''] : data.answer,
                  order: vm.nowQuestion[vm.nowNum].order,
                };
                vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
                vm.nowQuestion[vm.nowNum].soc = 'O';
              } else {
                // 한 아이템 설문
                /*
                studentService.postLog({
                  id: vm.lectureItem[0].lecture_item_id,
                  lecture_id: vm.lectureId,
                  item_id: vm.lectureItem[0].lecture_item_id,
                  type: vm.lectureItem[0].type,
                  order: vm.lectureItem[0].order,
                  start_time: vm.startTime,
                  end_time: endTime,
                }); */
                const submitlog = {
                  lecture_id: vm.lectureId,
                  user_id: utils.getUserIdFromJwt(),
                  type: vm.lectureItem[0].type,
                  start_time: vm.startTime,
                  end_time: endTime,
                  item_id: vm.lectureItem[0].lecture_item_id,
                  answer: data.answer.length === 0 ? [''] : data.answer,
                  order: vm.lectureItem[0].order,
                };
                vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
              }
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
        case 'QUE': {
          // 만약 지금 보고있던게 자료였다면 로그 제출
          const endTime = new Date();
          if (vm.nowQuestion[vm.nowNum].soc === '자료') {
            /*
            studentService.postLog({
              id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              lecture_id: vm.lectureId,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              type: vm.nowQuestion[vm.nowNum].type,
              order: vm.nowQuestion[vm.nowNum].order,
              start_time: vm.startTime,
              end_time: endTime,
            }); */
            const submitlog = {
              lecture_id: vm.lectureId,
              user_id: utils.getUserIdFromJwt(),
              type: vm.nowQuestion[vm.nowNum].type,
              start_time: vm.startTime,
              end_time: endTime,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              order: vm.nowQuestion[vm.nowNum].order,
            };
            vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
          }
          // 문항 이동
          vm.lectureItems = [];
          vm.lectureItems.push(vm.lectureItem[data - 1]);
          vm.nowNum = data - 1;
          // 시작 시간 갱신
          vm.startTime = new Date();
          break;
        }
        case 'PREV': {
          if (vm.nowNum === 0) {
            vm.$notify({
              title: '알림',
              message: '첫번째 아이템입니다.',
              type: 'warning',
            });
            break;
          }
          // 만약 지금 보고있던게 자료였다면 로그 제출
          const endTime = new Date();
          if (vm.nowQuestion[vm.nowNum].soc === '자료') {
            /*
            studentService.postLog({
              id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              lecture_id: vm.lectureId,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              type: vm.nowQuestion[vm.nowNum].type,
              order: vm.nowQuestion[vm.nowNum].order,
              start_time: vm.startTime,
              end_time: endTime,
            }); */
            const submitlog = {
              lecture_id: vm.lectureId,
              user_id: utils.getUserIdFromJwt(),
              type: vm.nowQuestion[vm.nowNum].type,
              start_time: vm.startTime,
              end_time: endTime,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              order: vm.nowQuestion[vm.nowNum].order,
            };
            vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
          }
          // 이전 문항으로
          vm.lectureItems = [];
          vm.lectureItems.push(vm.lectureItem[vm.nowNum - 1]);
          vm.nowNum -= 1;
          // 시작 시간 갱신
          vm.startTime = new Date();
          break;
        }
        case 'NEXT': {
          if (vm.nowNum === vm.lectureItem.length - 1) {
            vm.$notify({
              title: '알림',
              message: '마지막 아이템입니다.',
              type: 'warning',
            });
            break;
          }
          // 만약 지금 보고있던게 자료였다면 로그 제출
          const endTime = new Date();
          if (vm.nowQuestion[vm.nowNum].soc === '자료') {
            /*
            studentService.postLog({
              id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              lecture_id: vm.lectureId,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              type: vm.nowQuestion[vm.nowNum].type,
              order: vm.nowQuestion[vm.nowNum].order,
              start_time: vm.startTime,
              end_time: endTime,
            }); */
            const submitlog = {
              lecture_id: vm.lectureId,
              user_id: utils.getUserIdFromJwt(),
              type: vm.nowQuestion[vm.nowNum].type,
              start_time: vm.startTime,
              end_time: endTime,
              item_id: vm.nowQuestion[vm.nowNum].lecture_item_id,
              order: vm.nowQuestion[vm.nowNum].order,
            };
            vm.$socket.emit('LECTURE_ITEM_LOG', JSON.stringify(submitlog));
          }
          // 다음 문항으로
          vm.lectureItems = [];
          vm.lectureItems.push(vm.lectureItem[vm.nowNum + 1]);
          vm.nowNum += 1;
          // 시작 시간 갱신
          vm.startTime = new Date();
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

        // 시작 시간 갱신
        vm.startTime = new Date();
        let nowN = 0;
        if (notify === false) {
          nowN = vm.nowNum;
        }
        vm.nowNum = 0;

        vm.lectureItems = [];
        vm.nowQuestion = [];

        // 새로 들어온 문항의 key 생성
        res3.data.forEach((x) => {
          if (x.type === 0) {
            // 객관식만 섞어줌
            if (x.questions[0].type === 0) {
              // 아직 보기가 안 섞인 문제일 경우
              if (vm.questionList.includes(x.lecture_item_id) === false) {
                // 보기의 수
                const numBogi = x.questions[0].choice.length;
                // 보기가 바뀔 배열
                const key = [];
                const checkRandom = [];
                // 특정 보기가 key에 들어갔는지 체크하는 배열
                for (let cr = 0; cr < numBogi; cr += 1) {
                  checkRandom.push(false);
                }
                // key 생성과정
                for (let c = 0; c < numBogi; c += 1) {
                  let suc = true;
                  while (suc) {
                    const temp = Math.floor(Math.random() * numBogi);
                    if (checkRandom[temp] === false) {
                      checkRandom[temp] = true;
                      key.push(temp);
                      suc = false;
                    }
                  }
                }
                // key가 생성된 question의 lecture_item_id와 만들어진 key를 저장
                // 강사가 문항을 내렸다 다시 올릴 경우 이미 만들어진 key를 이용해 동일하게 섞인 순서의 보기가 출력됨
                vm.questionList.push(x.lecture_item_id);
                vm.questionKey.push(key);
              }
            }
          }
        });

        // key에 맞게 문항 보기 섞어주기
        res3.data.forEach((x) => {
          if (x.type === 0) {
            if (x.questions[0].type === 0) {
              const numBogi = x.questions[0].choice.length;
              const newBogi = [];
              const newNum = vm.questionList.indexOf(x.lecture_item_id);
              for (let b = 0; b < numBogi; b += 1) {
                newBogi.push(-1);
              }
              for (let d = 0; d < numBogi; d += 1) {
                newBogi[d] = x.questions[0].choice[vm.questionKey[newNum][d]];
              }
              for (let c = 0; c < numBogi; c += 1) {
                x.questions[0].choice[c] = newBogi[c]; // eslint-disable-line
              }
            }
          }
        });

        if (res3.data.length !== 0) {
          vm.lectureItem = res3.data;
          // sequence 순서대로 강의 아이템 정렬
          vm.lectureItem.sort((a, b) => {
            const aItemSequence = Number(a.sequence);
            const bItemSequence = Number(b.sequence);
            return aItemSequence - bItemSequence;
          });
        } else if (vm.lectureType === 0) {
          vm.lectureItem = [];
        }

        // 아이템이 여러 개일 경우 처리
        if (vm.lectureItem.length > 1) {
          vm.lectureItems.push(vm.lectureItem[0]);
          vm.lectureItem.forEach((x, index) => {
            const tmp = {};
            // 제출 여부
            if (x.type === 4) {
              tmp.soc = '자료';
            } else if (x.type === 0) {
              if (x.questions[0].student_answer_logs.length > 0) {
                tmp.soc = 'O';
              } else {
                tmp.soc = 'X';
              }
            } else if (x.type === 1) {
              if (x.surveys[0].student_surveys.length > 0) {
                tmp.soc = 'O';
              } else {
                tmp.soc = 'X';
              }
            } else if (x.type === 2) {
              tmp.soc = '실습';
            } else if (x.type === 3) {
              tmp.soc = '토론';
            }
            tmp.type = x.type;
            tmp.order = x.order;
            tmp.lecture_item_id = x.lecture_item_id;
            tmp.num = index + 1;
            vm.nowQuestion.push(tmp);
          });
        }
        if (notify !== false) {
          vm.$notify({
            title: '알림',
            message: '강의아이템이 변경되었습니다.',
            type: 'warning',
          });
        }
        if (notify === false) {
          // 원래 보고 있던 문항으로
          vm.nowNum = nowN;
          vm.lectureItems = [];
          vm.lectureItems.push(vm.lectureItem[vm.nowNum]);
        }
      }, 1000);
    },
    presentMaterial(data) {
      const vm = this;
      vm.materialLink = `http://docs.google.com/gview?url=${data}&embedded=true`;
    },
    async getLectureItem() {
      // 무인 강의
      // 강사가 설정해 놓은 활성화 시간에 따라 자동으로 강의 아이템이 나오는데
      // 아이템 보기는 활성화 되기 전에 미리 세팅
      const vm = this;
      vm.timer = [];
      const res4 = await automaticLectureService.onlineJoin({
        lectureId: vm.lectureId,
      });

      // 문항들의 key 생성
      res4.data.items.forEach((x) => {
        if (x.type === 0) {
          if (x.questions[0].type === 0) {
            // 아직 보기가 안 섞인 문제일 경우
            if (vm.questionList.includes(x.lecture_item_id) === false) {
              // 보기의 수
              const numBogi = x.questions[0].choice.length;
              // 보기가 바뀔 배열
              const key = [];
              const checkRandom = [];
              // 특정 보기가 key에 들어갔는지 체크하는 배열
              for (let cr = 0; cr < numBogi; cr += 1) {
                checkRandom.push(false);
              }
              // key 생성과정
              for (let c = 0; c < numBogi; c += 1) {
                let suc = true;
                while (suc) {
                  const temp = Math.floor(Math.random() * numBogi);
                  if (checkRandom[temp] === false) {
                    checkRandom[temp] = true;
                    key.push(temp);
                    suc = false;
                  }
                }
              }
              // key가 생성된 question의 lecture_item_id와 만들어진 key를 저장
              // 강사가 문항을 내렸다 다시 올릴 경우 이미 만들어진 key를 이용해 동일하게 섞인 순서의 보기가 출력됨
              vm.questionList.push(x.lecture_item_id);
              vm.questionKey.push(key);
            }
          }
        }
      });

      // 문항들의 key 생성 - rawItem에 대해
      res4.data.rawItems.forEach((x) => {
        if (x.type === 0) {
          if (x.questions[0].type === 0) {
            // 아직 보기가 안 섞인 문제일 경우
            if (vm.questionList.includes(x.lecture_item_id) === false) {
              // 보기의 수
              const numBogi = x.questions[0].choice.length;
              // 보기가 바뀔 배열
              const key = [];
              const checkRandom = [];
              // 특정 보기가 key에 들어갔는지 체크하는 배열
              for (let cr = 0; cr < numBogi; cr += 1) {
                checkRandom.push(false);
              }
              // key 생성과정
              for (let c = 0; c < numBogi; c += 1) {
                let suc = true;
                while (suc) {
                  const temp = Math.floor(Math.random() * numBogi);
                  if (checkRandom[temp] === false) {
                    checkRandom[temp] = true;
                    key.push(temp);
                    suc = false;
                  }
                }
              }
              // key가 생성된 question의 lecture_item_id와 만들어진 key를 저장
              // 강사가 문항을 내렸다 다시 올릴 경우 이미 만들어진 key를 이용해 동일하게 섞인 순서의 보기가 출력됨
              vm.questionList.push(x.lecture_item_id);
              vm.questionKey.push(key);
            }
          }
        }
      });

      // key에 맞게 문항 보기 섞어주기 - item에 대해
      res4.data.items.forEach((x) => {
        if (x.questions[0].type === 0) {
          if (x.type === 0) {
            const numBogi = x.questions[0].choice.length;
            const newBogi = [];
            const newNum = vm.questionList.indexOf(x.lecture_item_id);
            for (let b = 0; b < numBogi; b += 1) {
              newBogi.push(-1);
            }
            for (let d = 0; d < numBogi; d += 1) {
              newBogi[d] = x.questions[0].choice[vm.questionKey[newNum][d]];
            }
            for (let c = 0; c < numBogi; c += 1) {
              x.questions[0].choice[c] = newBogi[c]; // eslint-disable-line
            }
          }
        }
      });

      // key에 맞게 문항 보기 섞어주기 - rawItem에 대해
      res4.data.rawItems.forEach((x) => {
        if (x.questions[0].type === 0) {
          if (x.type === 0) {
            const numBogi = x.questions[0].choice.length;
            const newBogi = [];
            const newNum = vm.questionList.indexOf(x.lecture_item_id);
            for (let b = 0; b < numBogi; b += 1) {
              newBogi.push(-1);
            }
            for (let d = 0; d < numBogi; d += 1) {
              newBogi[d] = x.questions[0].choice[vm.questionKey[newNum][d]];
            }
            for (let c = 0; c < numBogi; c += 1) {
              x.questions[0].choice[c] = newBogi[c]; // eslint-disable-line
            }
          }
        }
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
    beforeLeave() {
      const vm = this;
      const param = {
        lecture_id: vm.localLectureId,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('LEAVE_LECTURE', JSON.stringify(param));

      // 화면 떠나기 전 등록한 Listener 해제. 이 코드가 없으면 리스너가 중복 등록되어 버그가 발생함
      window.removeEventListener('beforeunload', vm.beforeLeave);
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.beforeLeave();
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
