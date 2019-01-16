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
            <br>
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
        <el-col id="pres" :span="6" style="text-align: center;">
          출석률 {{ presentRateChange }}<br><br>
          <el-progress type="circle" :percentage="presentRate" color="red"></el-progress>
        </el-col>
        <el-col id="unde" :span="6" style="text-align: center;">
          이해도<br><br>
          <el-progress type="circle" :percentage="understanding" color="cornflowerblue"></el-progress>
        </el-col>
        <el-col id="part" :span="6" style="text-align: center;">
          참여도<br><br>
          <el-progress type="circle" :percentage="participation" color="orange"></el-progress>
        </el-col>
        <el-col id="conc" :span="6" style="text-align: center;">
          집중도<br><br>
          <el-progress type="circle" :percentage="concentration" color="darkseagreen"></el-progress>
        </el-col>
        <!-- 테이블 사라짐. 디자인 심플하게
        <el-col :span="4">
          <table id="table_design">
            <tbody>
              <tr>
                <td>전체 출석 현황</td>
                <td>{{ presentStudent }} 명 / {{ totalStudent }} 명</td>
              </tr>
              <tr>
                <td>현재 출석 현황</td>
                <td>{{ nowStudent }} 명 / {{ totalStudent }} 명</td>
              </tr>
              <tr>
                <td>결석자 명단</td>
                <td>
                  <el-button size="mini" @click="onClick('Absent')">보기</el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <table id="table_design">
            <thead>
              <th></th>
              <th>이해도</th>
              <th>참여도</th>
              <th>집중도</th>
            </thead>
            <tbody>
              <tr>
                <td>Max</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Min</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </el-col> -->
      </el-row>
      <!-- 실시간 이해도 참여도 집중도 출석률 그래프 -->
      <el-button v-show="!showGraph" size="small" type="primary" @click="onClick('SHOWGRAPH')">실시간 그래프 보이기</el-button>
      <div v-show="showGraph">
        <line-chart :chartCategories = "chartCategories" :chartData = "chartData" />
        <el-button size="small" @click="onClick('GRAPH')">임시 그래프 그리기</el-button>
        <el-button size="small" type="primary" @click="onClick('SHOWGRAPH')">실시간 그래프 닫기</el-button>
      </div>
      <div style="height: 30px;" />

      <!--총 아이템이 5개 이상일 경우 stepData 내비게이션 사용-->
      <div v-if="stepData.length >= 5" style="z-index: -9;">
        <table style="width: 100%">
          <tbody>
            <tr>
              <td style="width: 60px;">
                <el-button @click="leftStep()" icon="el-icon-arrow-left" />
              </td>
              <td>
                <el-steps align-center="true">
                  <el-step v-for="item in stepDataNav" :title="item.title" :icon="item.icon" :description="item.description" :key="item" :status="item.status">
                  </el-step>
                </el-steps>
              </td>
              <td style="width: 60px;">
                <el-button @click="rightStep()" icon="el-icon-arrow-right" />
              </td>
            </tr>
            <tr>
              <td style="width: 60px;">{{ leftStepNav }} 아이템</td>
              <td>
                <div style="text-align: center;">
                  <el-popover title="아이템 이름" trigger="hover" style="margin-left: 74px; margin-right: 74px;">
                    <el-table :data="itemTable[leftStepNav]">
                      <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                      <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
                    </el-table>
                    <el-button size="small" slot="reference">목록</el-button>
                  </el-popover>
                  <el-popover title="아이템 이름" trigger="hover" style="margin-left: 74px; margin-right: 74px;">
                    <el-table :data="itemTable[1 + leftStepNav]">
                      <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                      <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
                    </el-table>
                    <el-button size="small" slot="reference">목록</el-button>
                  </el-popover>
                  <el-popover title="아이템 이름" trigger="hover" style="margin-left: 74px; margin-right: 74px;">
                    <el-table :data="itemTable[2 + leftStepNav]">
                      <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                      <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
                    </el-table>
                    <el-button size="small" slot="reference">목록</el-button>
                  </el-popover>
                  <el-popover title="아이템 이름" trigger="hover" style="margin-left: 74px; margin-right: 74px;">
                    <el-table :data="itemTable[3 + leftStepNav]">
                      <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                      <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
                    </el-table>
                    <el-button size="small" slot="reference">목록</el-button>
                  </el-popover>
                  <el-popover title="아이템 이름" trigger="hover" style="margin-left: 74px; margin-right: 74px;">
                    <el-table :data="itemTable[4 + leftStepNav]">
                      <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                      <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
                    </el-table>
                    <el-button size="small" slot="reference">목록</el-button>
                  </el-popover>
                </div>
              </td>
              <td style="width: 60px;">{{ rightStepNav }} 아이템</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--총 아이템이 5개 미만인 경우 stepData만 보여주면 됨. 내비게이션 필요 X-->
      <div v-else style="text-align: center;">
        <div style="margin-left: 200px; margin-right: 200px;">
          <el-steps align-center="true">
            <el-step v-for="item in stepData" :title="item.title" :icon="item.icon" :description="item.description" :key="item" :status="item.status">
            </el-step>
          </el-steps>
          <!--총 아이템 그룹이 4개인 경우-->
          <div style="text-align: center;" v-if="stepData.length === 4">
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 66px; margin-right: 66px;">
              <el-table :data="itemTable[0]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 66px; margin-right: 66px;">
              <el-table :data="itemTable[1]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 66px; margin-right: 66px;">
              <el-table :data="itemTable[2]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 66px; margin-right: 66px;">
              <el-table :data="itemTable[3]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
          </div>
          <!--총 아이템 그룹이 3개인 경우-->
          <div style="text-align: center;" v-if="stepData.length === 3">
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 99px; margin-right: 99px;">
              <el-table :data="itemTable[0]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 99px; margin-right: 99px;">
              <el-table :data="itemTable[1]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 99px; margin-right: 99px;">
              <el-table :data="itemTable[2]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
          </div>
          <!--총 아이템 그룹이 2개인 경우-->
          <div style="text-align: center;" v-if="stepData.length === 2">
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 163px; margin-right: 163px;">
              <el-table :data="itemTable[0]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
            <el-popover title="아이템 이름" trigger="hover" style="margin-left: 163px; margin-right: 163px;">
              <el-table :data="itemTable[1]">
                <el-table-column width="50" prop="typein" label="타입"></el-table-column>
                <el-table-column width="250" prop="name" label="아이템 명"></el-table-column>
              </el-table>
              <el-button size="small" slot="reference">목록</el-button>
            </el-popover>
          </div>
        </div>
      </div>

      <el-row>
        <div style="height: 20px;" />
        <div style="float: right;">
          <el-popover placement="top" trigger="hover">
            <div style="background-color: #EBEEF5; width: 1200px;">
              <el-row :gutter="20" style="height: 400px;">
                <el-col span="11">
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
                </el-col>
                <el-col span="9" style="margin-left: 20px;">
                  <el-tabs v-model="activeTab" type="border-card" style="margin-top: 20px; height: 345px;" v-if="tabShow">
                    <el-tab-pane label="답안 선택 현황" name="select" v-if="questionAnswerFix">
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
                </el-col>
              </el-row>
              <!-- 강사 화면에서 학생과 동일하게 아이템이 보여지던 기존 UI
              <div v-for="id in currentLectureItemId" :key="id">
                <teacher-lecture-live-item
                  :lectureItemId="id"
                  :onClick="onClick"
                  :isAuto="isAuto"
                />
              </div>-->
            </div>
            <el-button size="small" type="primary" @click="onClick('NEXT_ITEM')" slot="reference">다음 아이템 보이기</el-button>
          </el-popover>
          <el-button size="small" @click="onClick('HIDE_ITEM')">아이템 내리기</el-button>
          <el-button size="small" @click="onClick('FULL_ITEM')">전체 아이템 확인</el-button>
        </div>
      </el-row>

      <!-- 강의 대시보드에서 아이템이 나올 때 겹쳐서 보여줄 영역-->

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
import LineChart from '../partials/NNLineChart';

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
          if (w.type === 0) {
            w.typein = '문항'; // eslint-disable-line
          } else if (w.type === 1) {
            w.typein = '설문'; // eslint-disable-line
          } else if (w.type === 2) {
            w.typein = '실습'; // eslint-disable-line
          } else if (w.type === 3) {
            w.typein = '토론'; // eslint-disable-line
          } else if (w.type === 4) {
            w.typein = '자료'; // eslint-disable-line
          }
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
      itemProg.status = 'wait';
      itemProg.description = `${x.length} 아이템`;
      if (x[0].type === 0) { // 문항
        itemProg.icon = 'el-icon-edit';
      } else if (x[0].type === 1) { // 설문
        itemProg.icon = 'el-icon-edit-outline';
      } else if (x[0].type === 2) { // 실습
        itemProg.icon = 'el-icon-document';
      } else if (x[0].type === 3) { // 토론
        itemProg.icon = 'el-icon-service';
      } else if (x[0].type === 4) { // 자료
        itemProg.icon = 'el-icon-picture';
      }
      vm.stepData.push(itemProg);
    });

    // 프로그레스 바 갯수 5개 이상이면
    if (vm.stepData.length >= 5) {
      vm.leftStepNav = 0;
      vm.rightStepNav = vm.stepData.length - 5;
      vm.stepDataNav = [];
      vm.stepDataNav.push(vm.stepData[0]);
      vm.stepDataNav.push(vm.stepData[1]);
      vm.stepDataNav.push(vm.stepData[2]);
      vm.stepDataNav.push(vm.stepData[3]);
      vm.stepDataNav.push(vm.stepData[4]);
    }

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
    /*
    vm.sUpdateTimelineLogIntervalId = setInterval(() => {
      vm.$socket.emit('UPDATE_TIMELINE_LOG', JSON.stringify(params));
    }, 18000); */

    // 출석 변동 있는 경우 - 실시간 출석률 변화
    vm.$socket.on('CHECK_STUDENT_LIST', (msg) => {
      const jsonMSG = JSON.parse(msg);
      vm.totalStudent = jsonMSG.length; // 총 수강인원
      // 현재 출석자, 한번이상 출석자, 결석자 명단 초기화
      vm.presentStudent = 0;
      vm.nowStudent = 0;
      vm.absentStudent = [];
      // 출석자, 결석자 명단 갱신
      jsonMSG.forEach((x) => {
        if (x.current === 1) { // 현재 출석중
          vm.nowStudent += 1;
        }
        if (x.in_cnt > 0) { // 한번이라도 출석
          vm.presentStudent += 1;
        } else { // 결석자 명단
          vm.absentStudent.push(x.name);
        }
      });
      // 실시간 출석률
      vm.presentRate = ((vm.nowStudent / vm.totalStudent) * 100).toFixed(1);
    });

    // 실시간 문제 제출 현황 들어오면 저장
    vm.$socket.on('CHECK_ANSWER_LECTURE', (msg) => {
      const jsonMSG = JSON.parse(msg);
      vm.itemNumberList = [];
      vm.answerList = [];
      jsonMSG.forEach((x) => {
        if (vm.itemNumberList.includes(x.item_id) === false) {
          // 포함 안 된 id
          vm.itemNumberList.push(x.item_id);
        }
      });
      vm.itemNumberList.forEach((y) => {
        const itemRes = [];
        jsonMSG.forEach((z) => {
          if (y === z.item_id) {
            itemRes.push(z);
          }
        });
        vm.answerList.push(itemRes);
      });
    });

    // 60초마다 주기적으로 대시보드 학생의 정보 받아옴
    vm.timeInterval = window.setInterval(() => {
      // console.log('60초');
      // 1분 단위 출석률 변화 계산
      const dis = vm.presentRate - vm.presentRate1;
      if (dis === 0) {
        vm.presentRateChange = '';
      } else if (dis > 0) {
        vm.presentRateChange = `+${dis}%`;
      } else if (dis < 0) {
        vm.presentRateChange = `${dis}%`;
      }
      // 출석률 변화에 따라 색상 변화
      const pres = document.getElementById('pres');
      if (dis > 30) { // 30% 이상 증가
        pres.style.color = 'blue';
      } else if (dis > 10) { // 10~30% 증가
        pres.style.color = 'green';
      } else if (dis > -10) { // -10~10%
        pres.style.color = 'black';
      } else if (dis > -20) { // 10%~20% 감소
        pres.style.color = 'orange';
      } else { // 20% 이상 감소
        pres.style.color = 'red';
      }
      vm.presentRate1 = vm.presentRate;
    }, 60000);
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
      mainquestion: [], // 대표문항 리스트
      subquestion: [], // 딸린문항 리스트
      nowGroup: -1, // 현재 그룹 번호
      lid: '', // 강의 종료시 필요한 아이템 아이디
      nowItemTable: [], // 현재 출제 중인 아이템 테이블
      ifShowItem: false, // 아이템 출제 중인지
      stepData: [], // 아이템 프로그레스 바
      totalStudent: 0, // 총 수강인원
      presentStudent: 0, // 출석인원
      nowStudent: 0, // 현재 인원
      absentStudent: [], // 결석자 명단
      presentRate: 0, // 현재 출석률
      presentRate1: 0, // 1분마다 변경되는 출석률
      concentration: 75, // 현재 집중도
      participation: 92, // 현재 참여도
      understanding: 66, // 현재 이해도
      presentRateChange: '', // 출석률 변화
      concentrationChange: '', // 집중도 변화
      participationChange: '', // 참여도 변화
      understandingChange: '', // 이해도 변화
      itemTable: [], // 아이템 테이블 - 최종
      totalGroupNum: '', // 전체 아이템 수
      activeNum: -0.5, // 현재 아이템 진행 번호
      groupIdList: [], // 그룹 id의 리스트
      tabShow: false, // 아이템 분석을 누를 경우 활성화
      activeTab: 'select', // 출제 아이템 분석의 탭
      itemNumberList: [], // 아이템 id 리스트 - 제출 정보 확인용
      selectStatus: [], // 특정 아이템 - 학생들의 답안 선택 현황
      notyetStatus: '', // 특정 아이템 - 미제출 학생들 명단
      submitStatus: [], // 특정 아이템 - 학생별 제출 횟수 현황
      leftStepNav: 0, // 스텝 네비게이션에서 왼쪽의 남은 아이템
      rightStepNav: 0, // 스텝 네비게이션에서 오른쪽의 남은 아이템
      stepDataNav: [], // 아이템이 5개 이상일 경우, 나눠서 보여줘야 함
      chartCategories: ['1분'],
      chartData: [['이해도', 75], ['참여도', 92], ['집중도', 66], ['출석률', 80]],
      timeInterval: '', // timeInterval 위한 변수
      answerList: [], // 학생들의 문항 제출 결과
      showGraph: false, // 실시간 그래프 보일지
      questionAnswerFix: false, // 고정된 답안이 있는지 - 객관식만 해당
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
    LineChart,
  },
  methods: {
    async onClick(type) {
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
          vm.stepData[vm.activeNum].status = 'process';
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
          vm.stepData[vm.activeNum].status = 'success';
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
        // 전체 아이템 확인
        case 'FULL_ITEM': {
          window.open('itemList');
          break;
        }
        // 강사의 아이템 미리보기 화면 - 제출 버튼 무효화
        case 'SUBMIT': {
          vm.$notify({
            title: '알림',
            message: '이 버튼은 현재 수강중인 학생만 이용할 수 있습니다.',
            type: 'warning',
          });
          break;
        }
        // 임시 그래프 그리기 - 삭제 예정
        case 'GRAPH': {
          const len = vm.chartCategories.length;
          // ..그 아래에
          vm.chartCategories.push(`${len + 1}분`);
          vm.chartData.forEach((x) => {
            const rn = Math.floor(Math.random() * 20) - 9;
            let rm = x[x.length - 1] + rn;
            if (rm > 100) {
              rm = 100;
            } else if (rm < 0) {
              rm = 0;
            }
            x.push(rm);
          });
          break;
        }
        // 제출현황은 실시간으로 바뀌어야 함
        // ㅇㅇ ㅂㅆㄷ ㅇㅇ ㅍㅈ ㅇㅇ ㅊ ㅇㅇ ㅈㅇㅋ ㅇㅇ ㅇ ㅇㅇ ㅍㅋ ㅇㅇ ㅅㅌㅇㅂㅇㄷㅂ ㅇㅇ ㅅ ㅇㅇ ㅈ
        // 결석자 명단 확인
        case 'ABSENT': {
          let whoIsAbsent = '';
          vm.absentStudent.forEach((x) => {
            if (whoIsAbsent === '') {
              whoIsAbsent = x;
            } else {
              whoIsAbsent = whoIsAbsent.concat(`, ${x}`);
            }
          });
          // 결석자 명단 알림 메시지로 띄움
          vm.$alert(whoIsAbsent, '결석자 명단', {
            confirmButtonText: '확인',
          }).catch(() => { // eslint-disable-line
            return; // eslint-disable-line
          });
          break;
        } // ㅇㅍㅋㄹ
        // 어떻게 해결법을 찾을지가 관건
        // 실시간 그래프 보일지
        case 'SHOWGRAPH': {
          if (vm.showGraph === true) {
            vm.showGraph = false;
          } else {
            vm.showGraph = true;
          }
          break;
        }
        case 'TOGGLE_STATUS_INFO': {
          vm.isInfoVisible = !vm.isInfoVisible;
          break;
        }
        // 강의 영상 숨길지 보여줄지 여부
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
    itemCurrentState(data) {
      const vm = this;
      vm.tabShow = true;
      // 결과 리스트들 초기화
      vm.selectStatus = [];
      vm.submitStatus = [];
      vm.notyetStatus = '';
      if (vm.itemNumberList.includes(parseInt(data.lecture_item_id, 10)) === false) {
        // 아직 제출 현황이 없다면
        return;
      }
      const ln = vm.itemNumberList.indexOf(parseInt(data.lecture_item_id, 10));
      // console.log(data);
      // console.log(vm.answerList[ln]);
      // 미제출자 고려 - 전부
      // vm.notyetStatus

      // 답안 제출 현황 - 문항 - 객관, 단답 / 설문 - 객관만 고려
      if (data.typein === '문항') {
        lectureItemService.getLectureItem({
          lectureItemId: data.lecture_item_id,
        }).then((res) => {
          if (res.data.questions[0].type === 0) {
            // 객관식 문항이라면
            vm.questionAnswerFix = true;
            const totNum = vm.answerList[ln].length;
            res.data.questions[0].choice.forEach((x, index) => {
              const ans = {}; // 결과 데이터
              ans.answer = x;
              let ansNum = 0;
              // 몇 명이 선택했나 계산
              vm.answerList[ln].forEach((y) => {
                if (y.answer.includes(index + 1) === true) {
                  // 해당 답을 선택했다면
                  ansNum += 1;
                }
              });
              const percent = ((ansNum / totNum) * 100).toFixed(1);
              ans.num = `${ansNum} / ${totNum} (${percent}%)`;
              if (res.data.questions[0].answer.includes((index + 1).toString())) { // 정답이라면
                ans.correct = true;
              } else { // 오답이라면
                ans.correct = false;
              }
              vm.selectStatus.push(ans);
            });
          } else {
            // 객관식이 아니라면
            vm.questionAnswerFix = false;
          }
        });
      }

      // vm.selectStatus

      // 몇번 제출 - 전부
      // vm.submitStatus

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
    // 스텝 네비게이션 왼쪽 이동
    leftStep() {
      const vm = this;
      // 더 왼쪽으로 갈 수 없다면
      if (vm.leftStepNav === 0) {
        vm.$notify({
          title: '알림',
          message: '더 이상 왼쪽으로 이동할 수 없습니다.',
          type: 'warning',
        });
        return;
      }
      // 값 변경
      vm.leftStepNav -= 1;
      vm.rightStepNav += 1;
      // 왼쪽 이동
      vm.stepDataNav = [];
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 1]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 2]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 3]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 4]);
    },
    // 스텝 네비게이션 오른쪽 이동
    rightStep() {
      const vm = this;
      // 더 오른쪽으로 갈 수 없다면
      if (vm.rightStepNav === 0) {
        vm.$notify({
          title: '알림',
          message: '더 이상 오른쪽으로 이동할 수 없습니다.',
          type: 'warning',
        });
        return;
      }
      // 값 변경
      vm.leftStepNav += 1;
      vm.rightStepNav -= 1;
      // 오른쪽 이동
      vm.stepDataNav = [];
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 1]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 2]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 3]);
      vm.stepDataNav.push(vm.stepData[vm.leftStepNav + 4]);
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.beforeLeave();
    // 소켓 닫기 전에 callback 함수들 해제해줘야 함
    // 해제하지 않으면 재접속시 callback함수가 또 만들어져 중복으로 돌아감
    vm.$socket._callbacks = null; // eslint-disable-line
    vm.$socket.close();
    // 1분마다 주기적으로 보내서 확인하는 timeInterval
    clearInterval(vm.timeInterval);
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
  width: 200px;
}
#table_design tbody td {
  border-block-start: 1px solid #321;
  border-left: 1px solid #321;
  border-right: 1px solid #321;

  color: #333;
}
.el-table .right {
  background: moccasin;
}
</style>
