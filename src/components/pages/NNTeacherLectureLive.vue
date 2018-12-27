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
      <el-steps :active="-1" align-center>
        <el-step v-for="item in stepData" :title="item.title" :icon="item.icon" :key="item"></el-step>
      </el-steps>
      <el-row style="background-color: skyblue; height: 500px;">
        <el-col :span="7" style="margin: 0;">
          <!--
          <el-button type="primary" size="small" @click="onClick('SHOWALL', questionItemIdList)">
            문항 모두 보이기
          </el-button>
          <el-button type="primary" size="small" @click="onClick('SHOWALL', surveyItemIdList)">
            설문 모두 보이기
          </el-button>
          -->
          <h2 style="color: white;">문제 목록</h2>
          <teacher-lecture-live-item-list
            v-if="isTableItemListLoaded"
            :dataList="tableItemList"
            :onClick="onClick"
            :isAuto="isAuto"
          />
          <br>
          <!--
          <el-tag v-for="(k, index) in selectItemList" :key="index" closable @close="deleteSelectedItem(index)">{{ k.name }}</el-tag>
          <el-button type="primary" size="small" @click="onClick('SHOWALL', selectItemIdList)">
            선택한 아이템 보이기
          </el-button>-->
        </el-col>
        <el-col :span="6" style="margin-left: 20px;">
          <h2 style="color: white;">출제 목록</h2>
          <el-table :data="nowItemTable" v-if="ifShowItem" max-height="350">
            <el-table-column label="타입" prop="type" width="50" />
            <el-table-column label="이름" prop="name" />
            <el-table-column label="" width="70" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="itemCurrentState(scope.row)">
                  현황
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="float:right; margin-top: 10px;" type="primary" @click="onClick('HIDE')">아이템 일괄 내리기</el-button>
        </el-col>
        <el-col :span="10" style="margin-left: 20px;">
          <h4>전체 제출현황</h4>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="20" color="orange"></el-progress>
          <h4> 제출현황</h4>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="60" color="green"></el-progress>
          <h4>미제출 학생</h4>
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
      <el-row>
        <el-col :span="3"><strong>현재 강의를 듣고있는 인원</strong></el-col>
        <el-col :span="7"> {{ onStudentCount - 1 }} 명 </el-col>
      </el-row>
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
//   does not match the recipient window's origin ('<URL>'). 에러 해결
import { getIdFromURL } from 'vue-youtube-embed';
import deepCopy from 'deep-copy';
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
    if (res.data.video_link !== null) {
      vm.videolink = res.data.video_link;
    }
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
      onStudentCount: 1,
      sOnStudentCount: undefined,
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
      stepData: [{
        title: '문항 1',
        icon: 'el-icon-edit',
      }, {
        title: '자료',
        icon: 'el-icon-picture',
      }, {
        title: '문항 2',
        icon: 'el-icon-edit',
      }, {
        title: '설문',
        icon: 'el-icon-edit-outline',
      }, {
        title: '토론',
        icon: 'el-icon-service',
      }, {
        title: '강의 관련 설문',
        icon: 'el-icon-edit-outline',
      }, {
        title: '예시 실습',
        icon: 'el-icon-document',
      }, {
        title: '8번째',
        icon: 'el-icon-edit',
      },],
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
        // 보일 아이템 선택
        case 'APPEND': {
          // 이미 리스트에 존재한다면
          if (vm.selectItemList.includes(data) === true) {
            vm.$notify({
              title: '알림',
              message: '이미 선택된 아이템입니다.',
              type: 'warning',
            });
            break;
          }
          vm.selectItemList.push(data);
          vm.selectItemIdList.push(data.lecture_item_id);
          break;
        }
        /* 모두 보이기 (문항 or 설문) or 선택한 아이템 일괄 보이기 - 사라진 기능
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
          data.forEach((x) => {
            if (vm.mainquestion.includes(x) === true) {
              const ind = vm.mainquestion.indexOf(x);
              vm.subquestion[ind].forEach((y) => {
                vm.currentLectureItemId.push(y);
              });
            }
          });
          const params = [];
          vm.currentLectureItemId.forEach((item) => {
            vm.tableItemIndex.push(
              vm.tableItemList.findIndex(tableItem =>
                tableItem.lecture_item_id === item),
            );
            const param = {
              lecture_id: vm.lectureId,
              opened: 1,
              lecture_item_id: item,
            };
            params.push(param);
          });
          vm.$socket.emit('LECTURE_ITEMS_ACTIVATION', JSON.stringify(params));
          // 선택한 리스트가 있다면 초기화
          vm.selectItemList = [];
          vm.selectItemIdList = [];
          break;
        } */
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
          for(let i = 0; i < vm.currentLectureItemId.length; i += 1) {
            const x = vm.currentLectureItemId[i];
            const loadItem = await lectureItemService.getLectureItem({
              lectureItemId: x,
            });
            const tmp = {};
            tmp.id = x;
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
            }
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
    // 아이템 제출 현황
    itemCurrentState(data) {
      const vm = this;
      console.log(data);
      // vm.$socket.emit('CHECK_USER_LECTURE');
      const param = {
        lecture_id: vm.lectureId,
        item_id: data.id,
      };
      // vm.$socket.emit('CHECK_ANSWER_LECTURE')
    },
    // 선택된 아이템 삭제
    deleteSelectedItem(index) {
      const vm = this;
      vm.selectItemList.splice(index, 1);
      vm.selectItemIdList.splice(index, 1);
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
  },
  beforeDestroy() {
    const vm = this;
    vm.beforeLeave();
    vm.$socket.close();
    clearInterval(vm.sOnStudentCount);
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
