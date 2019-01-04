<template>
  <div id="teacher_lecture_live_wrapper" class="bt-container">
    <template v-if="$isPhone">
      <!-- <h2>{{ path }}</h2><br/> -->
      <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
        <el-breadcrumb-item :to="{ path: '/a/teacher/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ lectureName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <br/>
        <youtube
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
        <teacher-lecture-live-item-list
          v-if="isTableItemListLoaded"
          :dataList="tableItemList"
          :onClick="onClick"
          :isAuto="isAuto"
        />
    </template>
    <template v-if="!$isPhone">
      <!--<h2>{{ path }}</h2><br/>-->
      <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
        <el-breadcrumb-item :to="{ path: '/a/teacher/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ lectureName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <br/>
      <el-row :gutter="20">
        <el-col :span="12">
          <div v-if="videolink === ''">
            등록된 영상이 없습니다.
            <br><br>
          </div>
          <div v-else>
            <youtube
              v-show="focusFlag"
              id="video"
              :video-id="youtubeId"
              player-width="100%"
              :player-vars="{ autoplay: 1 }"
              :mute="true">
            </youtube>
            <div style="float: right">
              <el-button v-show="focusFlag" size="small" type="primary" @click="onClick('FOCUS')">강의영상 숨기기</el-button>
              <el-button v-show="!focusFlag" size="small" type="primary" @click="onClick('FOCUS')">강의영상 보이기</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          저널링 그래프 영역
        </el-col>
        <el-col :span="5">
          <table id="table_design" style="width: 330px; height: 150px;">
            <thead>
              <tr>
                <td>출석 현황</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>총 수강 인원</td>
                <td>{{ totalStudent }} 명</td>
              </tr>
              <tr>
                <td>출석 인원</td>
                <td>{{ presentStudent }} 명</td>
                <td>{{ (presentStudent/totalStudent*100).toFixed(1) }} %</td>
              </tr>
              <tr>
                <td>현재 인원</td>
                <td>{{ nowStudent }} 명</td>
                <td>+1 명</td>
              </tr>
            </tbody>
          </table>
          <table id="table_design" style="width: 330px; height: 100px;">
            <tbody>
              <tr>
                <td>집중도</td>
                <td>{{ concentration }}</td>
                <td>{{ concentrationChange }}</td>
              </tr>
              <tr>
                <td>참여도</td>
                <td>{{ participation }}</td>
                <td>{{ participationChange }}</td>
              </tr>
              <tr>
                <td>이해도</td>
                <td>{{ understanding }}</td>
                <td>{{ understandingChange }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
      <!--
      <table style="width: 100%;">
        <tbody>
          <tr>
            <td style="font-size: 18px;">
              <i style="font-size: 30px;" class="el-icon-picture"></i>
              <br/>
              문서 자료
            </td>
            <td>2번</td>
            <td>3번</td>
          </tr>
        </tbody>
      </table>-->
      <br />

      <el-steps :active="activeNum" align-center>
        <el-step v-for="item in stepData" :title="item.title" :icon="item.icon" :description="item.description" :key="item">
        </el-step>
      </el-steps>
      <el-row>
        <div style="height: 20px;" />
        <div style="float: right">
          <el-button size="small" type="primary" @click="onClick('NEXT_ITEM')">다음 아이템 보이기</el-button>
          <el-button size="small" @click="onClick('HIDE_ITEM')">아이템 내리기</el-button>
          <el-button size="small" @click="onClick('FULL_ITEM')">전체 아이템 확인</el-button>
        </div>
      </el-row>
      <el-row :gutter="20" style="height: 400px; background-color: #EBEEF5;" v-if="activeNum % 1 === 0">
        <el-col span="11" style="margin: 0;">
          <h2>현재 출제 목록</h2>
          <el-table :data="nowItemTable" height="300px" style="width: 450px;">
            <el-table-column label="타입" prop="type" width="50px;" />
            <el-table-column label="이름" prop="name" />
            <el-table-column label="제출 현황" width="100px;" />
            <el-table-column label="" width="80px;">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="itemCurrentState(scope.row)"
                  v-if="scope.row.type === '문항' || scope.row.type === '설문'">
                  분석
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<teacher-lecture-live-item-list
            v-if="isTableItemListLoaded"
            :dataList="tableItemList"
            :onClick="onClick" 
            :isAuto="isAuto"
          />-->
          <br>
        </el-col>
        <el-col span="10" style="margin-left: 20px;">
          <el-tabs v-model="activeTab" type="border-card" style="margin-top: 20px; height: 345px;" v-if="tabShow">
            <el-tab-pane label="답안 선택 현황" name="select">
              <el-table :data="selectStatus" height="280px" style="width: 400px;" :row-class-name="tRCName">
                <el-table-column label="답안" prop="answer" />
                <el-table-column label="학생 수" prop="num" width="130px" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="미제출자 목록" name="notyet">
              {{ notyetStatus }}
            </el-tab-pane>
            <el-tab-pane label="학생별 제출 횟수" name="submitNum">
              <el-table :data="submitStatus" height="280px" style="width: 400px;">
                <el-table-column label="제출 횟수" prop="submit" />
                <el-table-column label="학생 수" prop="num" width="130px" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <!-- 강사 화면에서 학생과 동일하게 아이템이 보여지던 기존 UI
          <div v-for="id in currentLectureItemId" :key="id">
            <teacher-lecture-live-item
              :lectureItemId="id"
              :onClick="onClick"
              :isAuto="isAuto"
            />
          </div>-->
        </el-col>
      </el-row>
      <br />
      <!--<el-row>
        <el-col :span="3"><strong>현재 강의를 듣고있는 인원</strong></el-col>
        <el-col :span="7"> {{ onStudentCount - 1 }} 명 </el-col>
      </el-row>-->
      <div v-for="(itemId, index) in currentLectureItemId" :key="itemId">
        <el-row>
          <lecture-question-result
            v-if="currentLectureItemId.length > 0 && tableItemList[tableItemIndex[index]] && tableItemList[tableItemIndex[index]].type === 0"
            :classId="classId"
            :lectureId="lectureId"
            :itemId="itemId"
            resultType="실시간"/>
          <lecture-survey-result
            v-if="currentLectureItemId.length > 0 && tableItemList[tableItemIndex[index]] && tableItemList[tableItemIndex[index]].type === 1"
            :classId="classId"
            :lectureId="lectureId"
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
      <div class="statusbar" v-bind:class="{ activeInfo: isInfoVisible }">
        <div class="statusbar_for_click" @click="onClick('TOGGLE_STATUS_INFO')"></div>
        <teacher-lecture-live-summary :lectureId= "lectureId"/>
      </div>
    </template>
  </div>
</template>

<script>
// FIXME : Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('<URL>')
// does not match the recipient window's origin ('<URL>'). 에러 해결
import { getIdFromURL } from 'vue-youtube-embed';
// import deepCopy from 'deep-copy';
import lectureService from '../../services/lectureService';
import classService from '../../services/classService';
import authService from '../../services/authService';
import TeacherLectureLiveItemList from '../partials/TeacherLectureLiveItemList';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import TeacherLectureLiveChat from '../partials/TeacherLectureLiveChat';
import TeacherLectureLiveSummary from '../partials/TeacherLectureLiveSummary';
import LectureQuestionResult from '../partials/LectureQuestionResult';
import LectureSurveyResult from '../partials/LectureSurveyResult';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';

export default {
  name: 'TeacherLectureLive',
  async created() {
    const vm = this;
    vm.lid = vm.lectureId;
    // 학생이 url로 접근하는 경우 방지
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }

    // 강의 아이템 목록, 과목, 강의명 가져오기
    const res = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    const grp = await lectureItemService.showGroup({
      lectureId: vm.lectureId,
    });
    const seq = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    grp.data.list.forEach((x) => {
      // 한 그룹마다
      const oneGroup = [];
      const idList = [];
      vm.groupIdList.push(x.group_id);
      x.list_ids.forEach((y) => {
        // 그룹에 속하는 여러 연결 리스트
        seq.data.forEach((z) => {
          if (parseInt(y, 10) === z.lecture_item_list_id) {
            // 일치하는 연결 리스트 찾아
            if (z.linked_list.includes('<$!<>') === true) {
              // 연결 리스트 존재
              const tmp = z.linked_list.split('<$!<>');
              tmp.forEach((v) => {
                idList.push(v);
              });
            } else {
              // 연결 리스트 없다면
              idList.push(z.linked_list);
            }
          }
        });
      });
      // 그룹 넣어주기
      idList.forEach((r) => {
        res.data.lecture_items.forEach((w) => {
          if (parseInt(r, 10) === w.lecture_item_id) {
            oneGroup.push(w);
          }
        });
      });
      vm.itemTable.push(oneGroup);
    });
    // 총 아이템 수
    vm.totalGroupNum = vm.itemTable.length - 1;

    // 문항 프로그레스 바 생성
    vm.itemTable.forEach((x) => {
      const itemProg = {};
      itemProg.title = x[0].name;
      itemProg.description = `${x.length} 아이템`;
      if (x[0].type === 0) { // 문항
        itemProg.icon = 'el-icon-edit';
      } else if (x[0].type === 1) { // 설문
        itemProg.icon = 'el-icon-edit-outline';
      } else if (x[0].type === 2) { // 실습
        itemProg.icon = 'el-icon-edit-document';
      } else if (x[0].type === 3) { // 토론
        itemProg.icon = 'el-icon-service';
      } else if (x[0].type === 4) { // 자료
        itemProg.icon = 'el-icon-picture';
      }
      vm.stepData.push(itemProg);
    });

    if (res.data.video_link !== null) {
      vm.videolink = res.data.video_link;
    }
    vm.tableItemList = res.data.lecture_items;
    // sequence 순서대로 강의 아이템 정렬
    const res2 = await classService.getClass({
      id: res.data.class_id,
    });
    // vm.path = res2.data.name.concat(' > ', res.data.name);
    vm.className = res2.data.name;
    vm.lectureName = res.data.name;
    // 소켓 연결 및 주기적으로 보내는 신호 설정
    vm.$socket.connect();
    const params = {
      lecture_id: vm.lectureId,
      user_id: utils.getUserIdFromJwt(),
    };
    vm.$socket.emit('JOIN_LECTURE', JSON.stringify(params));
    /* 삭제 - 181214
    let res1 = await lectureService.getOnStudentCount({
      lectureId: vm.lectureId,
    });
    if (res1.data.count > 1) {
      vm.onStudentCount = res1.data.count;
    }
    vm.sOnStudentCount = setInterval(async () => {
      res1 = await lectureService.getOnStudentCount({
        lectureId: vm.lectureId,
      });
      vm.onStudentCount = res1.data.count;
    }, 10000);
    */
    vm.sUpdateTimelineLogIntervalId = setInterval(() => {
      vm.$socket.emit('UPDATE_TIMELINE_LOG', JSON.stringify(params));
    }, 18000);
    /* 삭제 - 181214
    vm.sHeartbeatIntervalId = setInterval(() => {
      const params2 = {
        lecture_id: vm.lectureId,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('HEART_BEAT', JSON.stringify(params2));
    }, 3000);
    */
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
  data() {
    return {
      tableItemList: [],
      tableItemIndex: [],
      currentLectureItemId: [],
      path: '',
      isAuto: false,
      isInfoVisible: false,
      focusFlag: false,
      videolink: '',
      className: '',
      lectureName: '',
      selectItemList: [], // 선택된 아이템들
      selectItemIdList: [], // 선택된 아이템들 id
      mainquestion: [], // 대표문항 리스트
      subquestion: [], // 딸린문항 리스트
      nowGroup: -1, // 현재 그룹 번호
      lid: '', // 강의 종료시 필요한 아이템 아이디
      nowItemTable: [], // 현재 출제 중인 아이템 테이블
      ifShowItem: false, // 아이템 출제 중인지
      stepData: [], // 아이템 프로그레스 바
      totalStudent: 3, // 총 수강인원
      presentStudent: 2, // 출석인원
      nowStudent: 1, // 현재 인원
      concentration: 50, // 현재 집중도
      participation: 70, // 현재 참여도
      understanding: 30, // 현재 이해도
      concentrationChange: '-15%', // 집중도 변화
      participationChange: '+20%', // 참여도 변화
      understandingChange: '-17%', // 이해도 변화
      itemTable: [], // 아이템 테이블 - 최종
      totalGroupNum: '', // 전체 아이템 수
      activeNum: -0.5, // 현재 아이템 진행 번호
      groupIdList: [], // 그룹 id의 리스트
      tabShow: false, // 아이템 분석을 누를 경우 활성화
      activeTab: 'select', // 출제 아이템 분석의 탭
      selectStatus: [], // 특정 아이템 - 학생들의 답안 선택 현황
      notyetStatus: '', // 특정 아이템 - 미제출 학생들 명단
      submitStatus: [], // 특정 아이템 - 학생별 제출 횟수 현황
    };
  },
  computed: {
    youtubeId() {
      return getIdFromURL(this.videolink);
    },
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
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
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        // 다음 아이템 보이기
        case 'NEXT_ITEM': {
          if (vm.activeNum % 1 === 0) {
            // 이미 보이고 있는 아이템이 있음
            vm.$notify({
              title: '알림',
              message: '다음 아이템을 보이려면 기존 아이템을 내려주세요.',
              type: 'warning',
            });
            break;
          } else if (vm.activeNum > vm.totalGroupNum) {
            // 모든 아이템 보인 경우
            vm.$notify({
              title: '알림',
              message: '더 이상 보일 아이템이 없습니다.',
              type: 'warning',
            });
            break;
          }
          // 위 두 경우 아닐 경우 아이템 보이기
          vm.activeNum += 0.5;
          vm.itemTable[vm.activeNum].forEach((x) => {
            if (x.type === 0) {
              x.type = '문항'; // eslint-disable-line
            } else if (x.type === 1) {
              x.type = '설문'; // eslint-disable-line
            } else if (x.type === 2) {
              x.type = '실습'; // eslint-disable-line
            } else if (x.type === 3) {
              x.type = '토론'; // eslint-disable-line
            } else if (x.type === 4) {
              x.type = '자료'; // eslint-disable-line
            }
          });
          vm.nowItemTable = vm.itemTable[vm.activeNum];
          const paramsi = {
            lecture_id: vm.lectureId,
            group_id: vm.groupIdList[vm.activeNum],
          };
          vm.$socket.emit('LECTURE_GROUP_ACTIVATION', JSON.stringify(paramsi));
          vm.nowGroup = vm.groupIdList[vm.activeNum];
          break;
        }
        // 아이템 내리기
        case 'HIDE_ITEM': {
          if (vm.activeNum % 1 === 0.5 || vm.activeNum === -0.5) {
            // 내릴 아이템이 없음
            vm.$notify({
              title: '알림',
              message: '내릴 아이템이 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.activeNum += 0.5;
          vm.nowItemTable = [];
          const paramsi = {
            lecture_id: vm.lectureId,
            group_id: vm.nowGroup,
          };
          vm.$socket.emit('LECTURE_GROUP_DEACTIVATION', JSON.stringify(paramsi));
          vm.nowGroup = -1;
          vm.tabShow = false;
          vm.activeTab = 'select';
          break;
        }
        // 전체 아이템 - 임시
        case 'FULL_ITEM': {
          window.open('itemList');
          break;
        }
        // 아이템 보이기
        case 'SHOW': {
          if (vm.currentLectureItemId.length !== 0) {
            vm.$notify({
              title: '알림',
              message: '다른 아이템을 보이려면 기존 아이템을 내려주세요.',
              type: 'warning',
            });
            break;
          }
          const groupId = data.groupId;
          const grp = await lectureItemService.showGroup({
            lectureId: vm.lectureId,
          });
          const seq = await lectureItemService.showConnection({
            lectureId: vm.lectureId,
          });
          const paramsi = {
            lecture_id: vm.lectureId,
            group_id: groupId,
          };
          grp.data.list.forEach((x) => {
            if (x.group_id === groupId) {
              x.list_ids.forEach((y) => {
                seq.data.forEach((z) => {
                  if (z.lecture_item_list_id === parseInt(y, 10)) {
                    if (z.linked_list.includes('<$!<>') === true) {
                      // 연결 아이템이 여러개라면
                      const splitz = z.linked_list.split('<$!<>');
                      splitz.forEach((w) => {
                        /* const parami = {
                          lecture_id: vm.lectureId,
                          opened: 1,
                          lecture_item_id: w,
                          group_id: groupId,
                        }; */
                        vm.currentLectureItemId.push(w);
                        // paramsi.push(parami);
                      });
                    } else {
                      const splitz = z.linked_list;
                      /* const parami = {
                        lecture_id: vm.lectureId,
                        opened: 1,
                        lecture_item_id: splitz,
                        group_id: groupId,
                      }; */
                      vm.currentLectureItemId.push(splitz);
                      // paramsi.push(parami);
                    }
                  }
                });
              });
            }
          });
          vm.nowGroup = groupId;
          vm.$socket.emit('LECTURE_GROUP_ACTIVATION', JSON.stringify(paramsi));
          // vm.$socket.emit('LECTURE_ITEMS_ACTIVATION', JSON.stringify(paramsi));
          for (let i = 0; i < vm.currentLectureItemId.length; i += 1) {
            const x = vm.currentLectureItemId[i];
            /*
            const loadItem = await lectureItemService.getLectureItem({ // eslint-disable-line
              lectureItemId: x,
            }); */
            const tmp = {};
            // 이거 수정 tmp.id = x;
            tmp.name = x;
            /*
            tmp.name = loadItem.data.name;
            if (loadItem.data.type === 0) {
              tmp.type = '문항';
            } else if (loadItem.data.type === 1) {
              tmp.type = '설문';
            } else if (loadItem.data.type === 2) {
              tmp.type = '실습';
            } else if (loadItem.data.type === 3) {
              tmp.type = '토론';
            } else if (loadItem.data.type === 4) {
              tmp.type = '자료';
            } */
            vm.nowItemTable.push(tmp);
          }
          vm.ifShowItem = true;
          break;
        }
        case 'HIDE': {
          // 아이템 일괄 내리기
          if (vm.currentLectureItemId.length === 0) {
            vm.$notify({
              title: '알림',
              message: '내릴 아이템이 없습니다.',
              type: 'warning',
            });
            break;
          }
          /*
          const paramsi = [];
          vm.currentLectureItemId.forEach((x) => {
            const parami = {
              lecture_id: vm.lectureId,
              opened: 0,
              lecture_item_id: x,
            };
            paramsi.push(parami);
            // const itemIndex = vm.currentLectureItemId.findIndex(id => id === x);
            // vm.currentLectureItemId.splice(itemIndex, 1);
            // vm.tableItemIndex.splice(itemIndex, 1);
          });
          */
          const paramsi = {
            lecture_id: vm.lectureId,
            group_id: vm.nowGroup,
          };
          vm.$socket.emit('LECTURE_GROUP_DEACTIVATION', JSON.stringify(paramsi));
          vm.nowGroup = -1;
          vm.currentLectureItemId = [];
          vm.nowItemTable = [];
          vm.ifShowItem = false;
          vm.tableItemIndex = [];
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
    // 아이템별 분석
    itemCurrentState() {
      const vm = this;
      vm.tabShow = true;
      vm.selectStatus = [];
      vm.submitStatus = [];
      vm.notyetStatus = '학생1, 학생2, 학생3, 학생4';
      vm.selectStatus = [
        {
          answer: 'HTTP',
          num: '17 / 50 (34%)',
          correct: true,
        }, {
          answer: 'SMTP',
          num: '3 / 50 (6%)',
          correct: false,
        }, {
          answer: 'TCP',
          num: '21 / 50 (42%)',
          correct: true,
        }, {
          answer: 'UDP',
          num: '6 / 50 (12%)',
          correct: false,
        }, {
          answer: 'IP',
          num: '1 / 50 (2%)',
          correct: false,
        },
      ];
      vm.submitStatus = [
        {
          submit: '1회',
          num: '25 / 50 (50%)',
        }, {
          submit: '2회',
          num: '13 / 50 (26%)',
        }, {
          submit: '3회',
          num: '7 / 50 (14%)',
        }, {
          submit: '4회 이상',
          num: '3 / 50 (6%)',
        },
      ];
    },
    beforeLeave() {
      const vm = this;

      // 강사가 강의 화면에서 나가는 경우, 열려있는 아이템을 모두 닫는 동작
      if (vm.nowGroup !== -1) {
        const paramsi = {
          lecture_id: vm.lid,
          group_id: vm.nowGroup,
        };
        vm.$socket.emit('LECTURE_GROUP_DEACTIVATION', JSON.stringify(paramsi));
        vm.nowGroup = -1;
      }
      const param = {
        lecture_id: vm.lid,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('LEAVE_LECTURE', JSON.stringify(param));

      // 화면 떠나기 전 등록한 Listener 해제. 이 코드가 없으면 리스너가 중복 등록되어 버그가 발생함
      window.removeEventListener('beforeunload', vm.beforeLeave);
    },
    // 답안 선택 현황에서 정답 보기에 색 표시
    tRCName({ row }) {
      if (row.correct === true) {
        return 'right';
      }
      return '';
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.beforeLeave();
    vm.$socket.close();
    // clearInterval(vm.sOnStudentCount);
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
#table_design {
  border-collapse: collapse;
  text-align: center;
  line-height: 1.5;
  border-top: 1px solid #321;
  border-bottom: 1px solid #321;
  border-block-end: 1px solid #321;
}
#table_design thead {
  width: 150px;
  padding: 10px;
  vertical-align: top;
  color: #111;
  font-size: 14px;
  background: rgb(160, 213, 250);
}
#table_design tbody td {
  width: 350px;
  padding: 10px;
  font-size: 14px;
  color: #333;
}
.el-table .right {
  background: moccasin;
}
</style>
