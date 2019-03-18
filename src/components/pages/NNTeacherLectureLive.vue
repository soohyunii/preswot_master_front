<template>
  <div id="teacher_lecture_live_wrapper" class="bt-container" style="height: 1000px;">
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
          <br>{{ nowStudent }}명 / {{ totalStudent }}명
        </el-col>
        <el-col id="unde" :span="6" style="text-align: center;">
          이해도 {{ understandingChange }}<br><br>
          <el-progress type="circle" :percentage="understanding" color="cornflowerblue"></el-progress>
        </el-col>
        <el-col id="part" :span="6" style="text-align: center;">
          참여도 {{ participationChange }}<br><br>
          <el-progress type="circle" :percentage="participation" color="orange"></el-progress>
        </el-col>
        <el-col id="conc" :span="6" style="text-align: center;">
          집중도 {{ concentrationChange }}<br><br>
          <el-progress type="circle" :percentage="concentration" color="darkseagreen"></el-progress>
        </el-col>
      </el-row>
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
        <el-popover v-if="lectureType === 0" trigger="hover" placement="top">
          <div style="width: 720px;">
            <el-table :data="ipList" border="true" height="400px" size="medium">
              <el-table-column label="" prop="num" width="30px" />
              <el-table-column label="이름" prop="name" />
              <el-table-column label="이메일" prop="email" />
              <el-table-column label="현재 접속 여부" prop="current" />
              <!--el-table-column label="IP count" prop="ip" /-->
              <el-table-column label="재접속 허용" width="120px">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="entrancePermit(scope.row)">
                    허용
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="height: 5px;" />
            <div style="float: right;">
              <el-button size="small" type="primary" @click="onClick('ATTENDANCE_CHECK')">출석 확인</el-button>
              <el-button size="small" @click="onClick('PERMIT_ALL')">전체 학생 재접속 허용</el-button>
            </div>
          </div>
          <el-button size="small" slot="reference">학생 접속 정보</el-button>
        </el-popover>
        <el-button size="small" @click="onClick('ABSENT')">결석자 명단</el-button>
        <el-button v-if="lectureType === 0" v-show="!showGraph" size="small" type="primary" @click="onClick('SHOWGRAPH')">실시간 그래프 보이기</el-button>
        <div style="float: right;">
          <el-popover v-if="lectureType === 0" placement="bottom" trigger="hover">
            <div style="background-color: #EBEEF5; width: 1200px;">
              <el-row :gutter="20" style="height: 350px;">
                <el-col span="11">
                  <h2>현재 출제 목록</h2>
                  <el-table :data="nowItemTable" height="250px" style="width: 450px;" id="dyTable">
                    <el-table-column label="타입" prop="type" width="50px;" />
                    <el-table-column label="이름" prop="name" />
                    <el-table-column label="제출 현황" width="100px;">
                      <template slot-scope="scope" v-if="scope.row.type === '문항' || scope.row.type === '설문'">
                        {{ scope.row.submit }} / {{ nowStudent }}
                      </template>
                    </el-table-column>
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
                      <el-table :data="selectStatus" height="250px" style="width: 400px;" :row-class-name="tRCName">
                        <el-table-column label="답안" prop="answer" />
                        <el-table-column label="학생 수" prop="num" width="130px" />
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="미제출자 목록" name="notyet">
                      {{ notyetStatus }}
                    </el-tab-pane>
                    <el-tab-pane label="학생별 제출 횟수" name="submitNum">
                      <el-table :data="submitStatus" height="250px" style="width: 400px;">
                        <el-table-column label="제출 횟수" prop="submit" />
                        <el-table-column label="학생 수" prop="num" width="130px" />
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
              </el-row>
            </div>
            <el-button size="small" type="primary" @click="onClick('NEXT_ITEM')" slot="reference">다음 아이템 보이기</el-button>
          </el-popover>
          <el-popover v-if="lectureType === 1" placement="bottom" trigger="hover">
            <div style="background-color: #EBEEF5; width: 1200px;">
              <el-row :gutter="20" style="height: 400px;">
                <el-col span="11">
                  <h2>현재 출제 목록</h2>
                  <el-table :data="nowItemTable" height="300px" style="width: 450px;" id="dyTable">
                    <el-table-column label="타입" prop="type" width="50px;" />
                    <el-table-column label="이름" prop="name" />
                    <el-table-column label="제출 현황" width="100px;">
                      <template slot-scope="scope" v-if="scope.row.type === '문항' || scope.row.type === '설문'">
                        {{ scope.row.submit }} / {{ nowStudent }}
                      </template>
                    </el-table-column>
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
            <el-button size="small" type="primary" slot="reference">아이템 현황 보기</el-button>
          </el-popover>
          <el-button v-if="lectureType === 0" size="small" @click="onClick('HIDE_ITEM')">아이템 숨기기</el-button>
          <el-button size="small" @click="onClick('FULL_ITEM')">전체 아이템 확인</el-button>
        </div>
        <div v-show="showGraph">
          <line-chart :chartCategories = "chartCategories" :chartData = "chartData" />
          <el-button size="small" type="primary" @click="onClick('SHOWGRAPH')">실시간 그래프 닫기</el-button>
        </div>
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
      <div class="statusbar" v-bind:class="{ activeInfo: isInfoVisible }">
        <div class="statusbar_for_click" @click="onClick('TOGGLE_STATUS_INFO')"></div>
        <teacher-lecture-live-summary :lectureId= "lectureId"/>
      </div> -->
    </template>
  </div>
</template>

<script>
// FIXME : Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('<URL>')
// does not match the recipient window's origin ('<URL>'). 에러 해결
import { getIdFromURL } from 'vue-youtube-embed';
import { setTimeout } from 'timers';
import deepCopy from 'deep-copy';
import lectureService from '../../services/lectureService';
import classService from '../../services/classService';
import authService from '../../services/authService';
import TeacherLectureLiveItemList from '../partials/TeacherLectureLiveItemList';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';
import TeacherLectureLiveChat from '../partials/TeacherLectureLiveChat';
import TeacherLectureLiveSummary from '../partials/NNTeacherLectureLiveSummary';
import LectureQuestionResult from '../partials/LectureQuestionResult';
import LectureSurveyResult from '../partials/LectureSurveyResult';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';
import LineChart from '../partials/NNLineChart';
import { EventBus } from '../../event-bus';

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
    // lectureType : 0 (유인 강의), 1(무인 단체 강의), 2(무인 개인 강의)
    vm.lectureType = res.data.type;
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

    // 처음 접속시 전체 수강생 명단 불러오기
    vm.absentStudentList = [];
    const wholeStudent = await lectureService.getWholeStudents({
      id: vm.lectureId,
    });
    vm.totalStudent = wholeStudent.data.length; // 총 수강인원
    vm.ipList = []; // ipList 초기화
    wholeStudent.data.forEach((x, index) => {
      // 전체 수강생 리스트
      const stud = {};
      stud.name = x.name;
      stud.user_id = x.user_id;
      stud.email_id = x.email_id;
      stud.understanding = 0;
      stud.participation = 0;
      stud.concentration = 0;
      stud.partic = 0;  // 참여한 문항+설문의 수
      stud.partis = 0;  // 출석 중 강사가 제출한 문항+설문의 수
      stud.concec = 0;  // 집중도의 합
      stud.conces = 0;  // 참여한 문항+설문+자료의 수
      vm.absentStudentList.push(stud.name);
      vm.totalStudentList.push(stud);

      // 학생 접속 정보 팝업
      const tmp = {};
      tmp.num = index + 1;
      tmp.name = x.name;
      tmp.email = x.email_id;
      tmp.id = x.user_id;
      tmp.current = '미출석';
      vm.ipList.push(tmp);
    });

    // 무인 단체
    if (vm.lectureType === 1) {
      vm.joinTime = Date.now();
      vm.timer = [];
      const res4 = await lectureService.getLecture({
        lectureId: vm.lectureId,
      });
      const lectureStart = new Date(res4.data.start_time);
      const lectureStartTime = lectureStart.getTime() / 1000; // 강의 시작 시간
      const enterTime = Math.floor(vm.joinTime / 1000);  // 접속 시간
      const enterTimeAbs = enterTime - lectureStartTime; // 강의 시작 이후로 몇 초 뒤에 접속했는지
      const grps = await lectureItemService.showGroup({
        lectureId: vm.lectureId,
      });
      const grpOrder = deepCopy(grps.data.list);

      let activeN = 0;
      vm.nowItemTable = [];

      /* 강사 접속시 기존 학생들의 출석 정보 불러와야 함
      const attend = await automaticLectureService.pastAttendanceData({
        lectureId: vm.lectureId,
      });
      // 그래프용 배열 만들기
      const timeHistory = [];
      for (let i = 0; i < Math.floor(enterTimeAbs / 60) + 1; i += 1) {
        const his = {};
        his.att = 0; // 해당 시점 출석자
        timeHistory.push(his);
      }
      console.log(timeHistory);
      console.log(attend);
      // 시간대별 출석률 계산
      attend.data.forEach((x) => {
        const ti1 = new Date(x.createdAt);
        const ti2 = ti1.getTime() / 1000;
        const ti3 = Math.floor((ti2 - lectureStartTime) / 60);
        if (x.type === 0) {
          timeHistory[ti3].att += 1;
        } else if (x.type === 1) {
          timeHistory[ti3].att -= 1;
        }
      });
      let timeAt = 0;
      // 실시간 그래프 그리기
      timeHistory.forEach((x) => {
        timeAt += x.att;
        const tempPresentRate = ((timeAt / vm.totalStudent) * 100).toFixed(1);
        const minute = vm.chartCategories.length;
        vm.chartCategories.push(`${minute}분`);
        vm.chartData[0].push(0);
        vm.chartData[1].push(0);
        vm.chartData[2].push(0);
        vm.chartData[3].push(tempPresentRate);
      }); */

      grpOrder.sort((a, b) => {
        const aItem = Number(a.start);
        const bItem = Number(b.start);
        return aItem - bItem;
      });
      // 접속 시간 기준으로 이미 종료된 아이템들은 필요 없음
      let delItemNum = 0;
      grpOrder.forEach((x) => {
        if (x.end <= enterTimeAbs) {
          delItemNum += 1;
          vm.stepData[delItemNum - 1].status = 'success';
          vm.activeN += 1;
        }
      });
      grpOrder.splice(0, delItemNum);

      // 그룹 리스트 하나씩 분리
      const groupSchedule = [];
      grpOrder.forEach((x) => {
        const gs = {};
        gs.time = x.start;
        gs.type = 'start';
        gs.list_ids = x.list_ids;
        groupSchedule.push(gs);
        const gs1 = {};
        gs1.time = x.end;
        gs1.type = 'end';
        gs1.list_ids = x.list_ids;
        groupSchedule.push(gs1);
      });
      // 실시간 분석
      vm.realTimeAnalysis();
      vm.automaticLectureAnalysis();

      // 입장과 동시에 기존에 보던 아이템 보여주고 있어야 할 경우
      if (groupSchedule.length !== 0) {
        if (groupSchedule[0].time <= enterTimeAbs) {
          groupSchedule[0].time = 0;
          vm.stepData[delItemNum].status = 'process';

          vm.itemTable[activeN].forEach((x) => {
            if (x.type === 0) {
              x.type = '문항'; // eslint-disable-line
              x.submit = 0; // eslint-disable-line
            } else if (x.type === 1) {
              x.type = '설문'; // eslint-disable-line
              x.submit = 0; // eslint-disable-line
            } else if (x.type === 2) {
              x.type = '실습'; // eslint-disable-line
            } else if (x.type === 3) {
              x.type = '토론'; // eslint-disable-line
            } else if (x.type === 4) {
              x.type = '자료'; // eslint-disable-line
            }
          });
          vm.nowItemTable = vm.itemTable[activeN];
        }
      }

      // 타이머 설정해서 아이템 보여주고 숨리기
      groupSchedule.forEach((x) => {
        vm.timer.push(setTimeout(() => {
          if (x.type === 'start') {
            vm.stepData[delItemNum].status = 'process';
            vm.itemTable[activeN].forEach((y) => {
              if (y.type === 0) {
                y.type = '문항'; // eslint-disable-line
                y.submit = 0; // eslint-disable-line
              } else if (y.type === 1) {
                y.type = '설문'; // eslint-disable-line
                y.submit = 0; // eslint-disable-line
              } else if (y.type === 2) {
                y.type = '실습'; // eslint-disable-line
              } else if (y.type === 3) {
                y.type = '토론'; // eslint-disable-line
              } else if (y.type === 4) {
                y.type = '자료'; // eslint-disable-line
              }
            });
            vm.nowItemTable = vm.itemTable[activeN];
          } else if (x.type === 'end') {
            vm.stepData[delItemNum].status = 'success';
            delItemNum += 1;
            activeN += 1;
            vm.nowItemTable = [];
            // 아이템 내려갈 시간에 실시간 분석
            vm.realTimeAnalysis();
            vm.automaticLectureAnalysis();
          }
        }, (x.time - enterTimeAbs) * 1000));
      });
    } // 무인 단체 설정 끝

    // 실시간 출석 인증
    vm.$socket.on('RECV_AUTHENTICATION', (msg) => {
      const jsonMSG = JSON.parse(msg);
      console.log(jsonMSG);
    });

    // 출석 변동 있는 경우 - 실시간 출석률 변화
    vm.$socket.on('CHECK_STUDENT_LIST', (msg) => {
      const jsonMSG = JSON.parse(msg);
      // 현재 출석자, 한번이상 출석자, 결석자 명단 초기화
      vm.presentStudent = 0;
      vm.nowStudent = 0;
      vm.absentStudentList = [];
      vm.nowStudentList = [];
      vm.nowStudentIdList = [];
      vm.ipList = [];
      // 출석자, 결석자 명단 갱신
      jsonMSG.forEach((x, index) => {
        if (x.current === 1) { // 현재 출석중
          vm.nowStudent += 1;
          // 현재 출석자 명단
          vm.nowStudentList.push(`${x.name} (${x.email_id})`);
          vm.nowStudentIdList.push(x.user_id);
        }
        if (x.in_cnt > 0) { // 한번이라도 출석
          vm.presentStudent += 1;
        } else { // 결석자 명단
          vm.absentStudentList.push(x.name);
        }
        // 학생 접속 정보 팝업
        const tmp = {};
        tmp.num = index + 1;
        tmp.name = x.name;
        tmp.email = x.email_id;
        tmp.id = x.user_id;
        if (x.current === 1) { // 현재 출석중
          tmp.current = '출석 중';
        } else if (x.in_cnt > 0) { // 출석했지만 나감
          tmp.current = '출석 후 이탈';
        } else {
          tmp.current = '미출석';
        }
        vm.ipList.push(tmp);
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
      vm.nowItemTable.forEach((z) => {
        vm.itemNumberList.forEach((v, index) => {
          if (z.lecture_item_id === v) {
            z.submit = vm.answerList[index].length; // eslint-disable-line
          }
        });
      });
      // 실시간 반영 위해서 넣은 의미 없는 코드
      const trash = vm.nowStudent;
      vm.nowStudent = 0;
      vm.nowStudent = trash;
    });

    // 60초마다 주기적으로 대시보드 출석률, 이해도, 참여도, 집중도 갱신
    vm.timeInterval = window.setInterval(() => {
      // 1분 단위 출석률 변화 계산
      const dis = vm.presentRate - vm.presentRate1;
      if (dis === 0) {
        vm.presentRateChange = '';
      } else if (dis > 0) {
        vm.presentRateChange = `+${(dis).toFixed(1)}%`;
      } else if (dis < 0) {
        vm.presentRateChange = `${(dis).toFixed(1)}%`;
      }
      // 출석률 변화에 따라 색상 변화
      const pres = document.getElementById('pres');
      if (dis >= 25) { // 25% 이상 증가
        pres.style.color = 'blue';
      } else if (dis >= 10) { // 10~25% 증가
        pres.style.color = 'green';
      } else if (dis >= -5) { // -5~10%
        pres.style.color = 'black';
      } else if (dis >= -20) { // -5%~20% 감소
        pres.style.color = 'orange';
      } else { // 20% 이상 감소
        pres.style.color = 'red';
      }
      vm.presentRate1 = vm.presentRate;
      // 그래프 그리기
      const minute = vm.chartCategories.length;
      vm.chartCategories.push(`${minute}분`);
      vm.chartData[0].push(vm.understanding);
      vm.chartData[1].push(vm.participation);
      vm.chartData[2].push(vm.concentration);
      vm.chartData[3].push(vm.presentRate);
      // 1분 단위 참여도 변화 계산
      const dis1 = vm.participation - vm.participationPast;
      if (dis1 === 0) {
        vm.participationChange = '';
      } else if (dis1 > 0) {
        vm.participationChange = `+${(dis1).toFixed(1)}%`;
      } else if (dis1 < 0) {
        vm.participationChange = `${(dis1).toFixed(1)}%`;
      }
      // 참여도 변화에 따라 색상 변화
      const part = document.getElementById('part');
      if (dis1 >= 25) { // 25% 이상 증가
        part.style.color = 'blue';
      } else if (dis1 >= 10) { // 10~25% 증가
        part.style.color = 'green';
      } else if (dis1 >= -5) { // -5~10%
        part.style.color = 'black';
      } else if (dis1 >= -20) { // -5%~20% 감소
        part.style.color = 'orange';
      } else { // 20% 이상 감소
        part.style.color = 'red';
      }
      // 1분 단위 이해도 변화 계산
      const dis2 = vm.understanding - vm.understandingPast;
      if (dis2 === 0) {
        vm.understandingChange = '';
      } else if (dis2 > 0) {
        vm.understandingChange = `+${(dis2).toFixed(1)}%`;
      } else if (dis2 < 0) {
        vm.understandingChange = `${(dis2).toFixed(1)}%`;
      }
      // 이해도 변화에 따라 색상 변화
      const unde = document.getElementById('unde');
      if (dis2 >= 25) { // 25% 이상 증가
        unde.style.color = 'blue';
      } else if (dis2 >= 10) { // 10~25% 증가
        unde.style.color = 'green';
      } else if (dis2 >= -5) { // -5~10%
        unde.style.color = 'black';
      } else if (dis2 >= -20) { // -5%~20% 감소
        unde.style.color = 'orange';
      } else { // 20% 이상 감소
        unde.style.color = 'red';
      }
      // 1분 단위 집중도 변화 계산
      const dis3 = vm.concentration - vm.concentrationPast;
      if (dis3 === 0) {
        vm.concentrationChange = '';
      } else if (dis3 > 0) {
        vm.concentrationChange = `+${(dis3).toFixed(1)}%`;
      } else if (dis3 < 0) {
        vm.concentrationChange = `${(dis3).toFixed(1)}%`;
      }
      // 집중도 변화에 따라 색상 변화
      const conc = document.getElementById('conc');
      if (dis3 >= 25) { // 25% 이상 증가
        conc.style.color = 'blue';
      } else if (dis3 >= 10) { // 10~25% 증가
        conc.style.color = 'green';
      } else if (dis3 >= -5) { // -5~10%
        conc.style.color = 'black';
      } else if (dis3 >= -20) { // -5%~20% 감소
        conc.style.color = 'orange';
      } else { // 20% 이상 감소
        conc.style.color = 'red';
      }
      // 현재 값 따로 저장
      vm.participationPast = vm.participation;
      vm.concentrationPast = vm.concentration;
      vm.understandingPast = vm.understanding;
    }, 60000);
  },
  mounted() {
    const vm = this;
    // eslint-disable-next-line
    window.onbeforeunload = function () {
      // 강사가 강의 화면에서 나가는 경우, 열려있는 아이템을 모두 닫는 동작
      if (vm.nowGroup !== -1) {
        const paramsi = {
          lecture_id: vm.lid,
          group_id: vm.nowGroup,
        };
        vm.$socket.emit('LECTURE_GROUP_DEACTIVATION', JSON.stringify(paramsi));
      }
      const param = {
        lecture_id: vm.lectureId,
        user_id: utils.getUserIdFromJwt(),
      };
      vm.$socket.emit('LEAVE_LECTURE', JSON.stringify(param));
      clearInterval(vm.timeInterval);
      EventBus.$off('makeSummary');
      // 소켓 닫기 전에 callback 함수들 해제해줘야 함
      // 해제하지 않으면 재접속시 callback함수가 또 만들어져 중복으로 돌아감
      vm.$socket._callbacks = null; // eslint-disable-line
      vm.$socket.close();
    };
  },
  data() {
    return {
      tableItemList: [],
      tableItemIndex: [],
      localLectureId: '', // beforeDestory에서 vm.$route.params.lectureId 를 못읽는 문제가 발생하여 임시 저장
      currentLectureItemId: [],
      path: '',
      isAuto: false,
      isInfoVisible: false,
      focusFlag: false,
      videolink: '',
      className: '',
      lectureName: '',
      lectureType: '',
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
      nowStudentList: [], // 현재 출석자 명단
      nowStudentIdList: [], // 현재 출석자 ID 명단
      absentStudentList: [], // 결석자 명단
      presentRate: 0, // 현재 출석률
      presentRate1: 0, // 1분마다 변경되는 출석률
      concentration: 0, // 현재 집중도
      participation: 0, // 현재 참여도
      understanding: 0, // 현재 이해도
      concentrationPast: 0, // 이전 집중도
      participationPast: 0, // 이전 참여도
      understandingPast: 0, // 이전 이해도
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
      chartCategories: ['시작'],
      chartData: [['이해도', 0], ['참여도', 0], ['집중도', 0], ['출석률', 0]],
      timeInterval: '', // timeInterval 위한 변수
      answerList: [], // 학생들의 문항 제출 결과
      showGraph: false, // 실시간 그래프 보일지
      questionAnswerFix: false, // 고정된 답안이 있는지 - 객관식만 해당
      totalStudentList: [], // 전체 학생의 이해도-참여도-집중도 현재값 리스트
      joinTime: undefined, // 강사가 강의에 입장한 시간 - 무인 단체
      timer: [], // 무인 단체에서 타이머
      ipList: [], // ip 카운트 및 학생 재접속 허용 관리
      attendanceNumber: '', // 출석 인증번호
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
              x.submit = 0; // eslint-disable-line
            } else if (x.type === 1) {
              x.type = '설문'; // eslint-disable-line
              x.submit = 0; // eslint-disable-line
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
        // 아이템 숨리기
        case 'HIDE_ITEM': {
          if (vm.activeNum % 1 === 0.5 || vm.activeNum === -0.5) {
            // 내릴 아이템이 없음
            vm.$notify({
              title: '알림',
              message: '숨길 아이템이 없습니다.',
              type: 'warning',
            });
            break;
          }
          // 미제출자 명단 띄우기 & 내릴지 재확인
          let notSubmit = '';
          const notSubmitList = [];
          vm.nowItemTable.forEach((x) => {
            const tmpSubmitList = [];
            if (x.typein === '문항' || x.typein === '설문') {
              // 문항이나 설문이라면
              if (vm.itemNumberList.includes(x.lecture_item_id) === true) {
                // 한 명이라도 제출을 했다면 answerlist 존재
                const ln = vm.itemNumberList.indexOf(x.lecture_item_id);
                vm.answerList[ln].forEach((y) => {
                  const namePlusId = `${y.name} (${y.email_id})`;
                  tmpSubmitList.push(namePlusId);
                });
                // 제출 현황 모두 보고나서 안 낸 사람 체크
                vm.nowStudentList.forEach((z) => {
                  if (tmpSubmitList.includes(z) === false) {
                    // 안 냈다면
                    if (notSubmitList.includes(z) === false) {
                      // 안 낸 사람 리스트에 없다면 추가
                      notSubmitList.push(z);
                    }
                  }
                });
              } else {
                // 한 명도 제출 안한 아이템이 있다면
                notSubmit = '아직 한 명도 제출하지 않은 아이템이 있습니다.';
              }
            }
          });
          // 미제출자 명단 만들기
          if (notSubmit === '') {
            notSubmitList.forEach((x) => {
              if (notSubmit === '') {
                notSubmit = `미제출자 명단: ${x}`;
              } else {
                notSubmit = notSubmit.concat(`, ${x}`);
              }
            });
          }
          vm.$confirm(notSubmit, '아이템 숨기기', {
            confirmButtonText: '숨기기',
            cancelButtonText: '취소',
            type: 'warning',
          }).then(() => {
            // 아이템 숨기기
            vm.stepData[vm.activeNum].status = 'success';
            vm.activeNum += 0.5;
            const paramsi = {
              lecture_id: vm.lectureId,
              group_id: vm.nowGroup,
            };
            vm.$socket.emit('LECTURE_GROUP_DEACTIVATION', JSON.stringify(paramsi));
            vm.nowGroup = -1;
            vm.tabShow = false;
            vm.activeTab = 'select';
            // 서버에 값 요청해서 집중도, 이해도 계산
            vm.realTimeAnalysis();

            // 현재 아이템 제출 결과들로 참여도 구하기
            // 학생별로 참여한 아이템 수 계산
            let questionN = 0;
            vm.nowItemTable.forEach((x) => {
              vm.itemNumberList.forEach((y, index) => {
                if (x.lecture_item_id === y) {
                  vm.answerList[index].forEach((z) => {
                    vm.totalStudentList.forEach((w) => {
                      if (w.user_id === z.user_id) { // 제출했다면
                        w.partic += 1; // eslint-disable-line
                      }
                    });
                  });
                  questionN += 1;
                }
              });
            });
            // 학생별로 전체 아이템 수 계산
            vm.nowStudentIdList.forEach((x) => {
              vm.totalStudentList.forEach((y) => {
                if (x === y.user_id) {
                  y.partis += questionN; // eslint-disable-line
                }
              });
            });
            // 개별 학생 누적 참여도 계산
            let partiN = 0;
            let wholeN = 0;
            vm.totalStudentList.forEach((x) => {
              partiN += x.partic;
              wholeN += x.partis;
              if (x.partis === 0) { // 하나도 참여 안했으면 0
                x.participation = 0; // eslint-disable-line
              } else { // 참여도 계산
                x.participation = ((x.partic / x.partis) * 100).toFixed(1); // eslint-disable-line
              }
              // 참여 후 나간 경우
              if (x.participation > 100) {
                x.participation = 100.0; // eslint-disable-line
              }
            });
            // 전체 학생 누적 참여도 계산
            let participate = ((partiN / wholeN) * 100).toFixed(1);
            if (participate > 100) {
              // 문제를 풀고 이탈한 학생이 있을 경우, 참여도가 100%보다 큰 값으로 나올 수 있음
              // 이 경우 참여도 100%로 조정
              participate = 100.0; // eslint-disable-line
            }
            if (partiN === 0) { // NaN인 경우
              participate = 0; // eslint-disable-line
            }
            vm.participation = participate;
            const pp = ['pp', vm.participation];
            EventBus.$emit('makeSummary', pp);
            vm.nowItemTable = [];
            return; // eslint-disable-line
          }).catch(() => { // eslint-disable-line
            return; // eslint-disable-line
          });
          break;
        }
        // 전체 아이템 확인
        case 'FULL_ITEM': {
          window.open('itemList');
          break;
        }
        // 전체 학생 접속 허용
        case 'PERMIT_ALL': {
          vm.totalStudentList.forEach((x) => {
            const paramsi = {
              user_id: x.user_id,
              lecture_id: vm.lectureId,
            };
            vm.$socket.emit('STUDENT_JOIN_ALLOW', JSON.stringify(paramsi));
          });
          vm.$notify({
            title: '알림',
            message: '모든 학생의 강의 재접속이 허용되었습니다.',
            type: 'success',
          });
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
        // 제출현황은 실시간으로 바뀌어야 함
        // 결석자 명단 확인
        case 'ABSENT': {
          let whoIsAbsent = '';
          vm.absentStudentList.forEach((x) => {
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
        }
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
        // 출석 인증번호 보내기 - 유인강의 전용
        case 'ATTENDANCE_CHECK': {
          vm.$prompt('출석 인증번호 숫자 4자리를 입력해주세요.', '출석 체크', {
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            inputPattern: /^[0-9]{4}$/,
            inputErrorMessage: '숫자 4자리를 입력해주세요.'
          }).then(({ value }) => {
            vm.attendanceNumber = value;
            const paramsi = {
              lecture_id: vm.lectureId,
              message: vm.attendanceNumber,
            };
            vm.$socket.emit('START_AUTHENTICATION', JSON.stringify(paramsi));
          }).catch(() => {
            return; // eslint-disable-line
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    // 학생 재접속 허가
    async entrancePermit(data) {
      const vm = this;
      const paramsi = {
        user_id: data.id,
        lecture_id: vm.lectureId,
      };
      vm.$socket.emit('STUDENT_JOIN_ALLOW', JSON.stringify(paramsi));
      vm.$notify({
        title: '알림',
        message: `${data.name} 학생의 강의 재접속이 허용되었습니다.`,
        type: 'success',
      });
    },
    // 아이템별 분석
    itemCurrentState(data) {
      const vm = this;
      vm.tabShow = true;
      // 결과 리스트들 초기화
      vm.selectStatus = [];
      vm.submitStatus = [];
      vm.notyetStatus = '';
      // 아직 제출 현황이 없다면
      if (vm.itemNumberList.includes(parseInt(data.lecture_item_id, 10)) === false) {
        vm.notyetStatus = '아직 제출한 학생이 없습니다.';
        vm.questionAnswerFix = false;
        return;
      }
      vm.questionAnswerFix = true;
      // answerList의 몇번째 인덱스에 해당하는지
      const ln = vm.itemNumberList.indexOf(parseInt(data.lecture_item_id, 10));

      // 미제출자 고려 - 문항 전부 / 설문 전부
      const tmpNowStudent = deepCopy(vm.nowStudentList);
      const tmpNowStudentId = deepCopy(vm.nowStudentIdList);
      vm.answerList[ln].forEach((x) => {
        // 제출 목록에 이름이 있는 학생들 제외하고
        if (tmpNowStudentId.includes(x.user_id) === true) {
          const lm = tmpNowStudentId.indexOf(x.user_id);
          tmpNowStudentId.splice(lm, 1);
          tmpNowStudent.splice(lm, 1);
        }
      });
      // 남은 학생을 미제출자로
      tmpNowStudent.forEach((x) => {
        if (vm.notyetStatus === '') {
          vm.notyetStatus = x;
        } else {
          vm.notyetStatus = vm.notyetStatus.concat(`, ${x}`);
        }
      });

      // 답안 제출 현황 - 문항 & 설문 - 객관만 고려
      if (data.typein === '문항') { // 문항 - 객관
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
      } else if (data.typein === '설문') { // 설문 - 객관
        lectureItemService.getLectureItem({
          lectureItemId: data.lecture_item_id,
        }).then((res) => {
          if (res.data.surveys[0].type === 0) {
            // 객관식 설문이라면
            vm.questionAnswerFix = true;
            const totNum = vm.answerList[ln].length;
            res.data.surveys[0].choice.forEach((x, index) => {
              const ans = {}; // 결과 데이터
              ans.answer = x;
              let ansNum = 0;
              // 몇 명이 선택했나 계산
              vm.answerList[ln].forEach((y) => {
                if (y.answer.includes(index) === true) {
                  // 해당 답을 선택했다면
                  ansNum += 1;
                }
              });
              const percent = ((ansNum / totNum) * 100).toFixed(1);
              ans.num = `${ansNum} / ${totNum} (${percent}%)`;
              vm.selectStatus.push(ans);
            });
          } else {
            // 객관식이 아니라면
            vm.questionAnswerFix = false;
          }
        });
      }

      // 몇번 제출 - 전부
      const howManySubmit = [0, 0, 0, 0];
      vm.answerList[ln].forEach((x) => {
        if (x.count === 0) {
          howManySubmit[0] += 1;
        } else if (x.count === 1) {
          howManySubmit[1] += 1;
        } else if (x.count === 2) {
          howManySubmit[2] += 1;
        } else {
          howManySubmit[3] += 1;
        }
      });
      const totNum = howManySubmit[0] + howManySubmit[1] + howManySubmit[2] + howManySubmit[3];
      howManySubmit.forEach((y, index) => {
        const sub = {};
        sub.submit = `${index + 1}회`;
        const per = ((y / totNum) * 100).toFixed(1);
        sub.num = `${y} / ${totNum} (${per}%)`;
        vm.submitStatus.push(sub);
      });
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
      // timeInterval 초기화
      clearInterval(vm.timeInterval);
      EventBus.$off('makeSummary');

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
    // 실시간 이해도, 집중도 구하는 함수
    realTimeAnalysis() {
      const vm = this;
      const para = {
        lecture_id: vm.lectureId,
      };
      vm.$socket.emit('REAL_TIME_INFO', JSON.stringify(para));
      vm.$socket.on('REAL_TIME_INFO', (msg) => {
        const realUnder = JSON.parse(msg).understanding;
        // 전체 학생 이해도 구하기
        let totalUnd = 0; // 이해도 합산
        let totalAns = 0; // 답안 수
        realUnder.forEach((x) => {
          if (x.type === 0) { // 문항에 대해서만
            totalUnd += x.ratio;
            totalAns += 1;
          }
        });
        if (totalAns === 0) { // 답안이 없는 경우 - NaN
          vm.understanding = 0;
        } else {
          vm.understanding = ((totalUnd / totalAns) * 100).toFixed(1);
        }
        // 개별 학생 이해도 구하기
        vm.totalStudentList.forEach((y) => {
          let ratioSum = 0;
          let itemSum = 0;
          realUnder.forEach((z) => {
            if (y.user_id === z.student_id) {
              ratioSum += z.ratio;
              itemSum += 1;
            }
          });
          if (itemSum === 0) { // NaN 예외 처리
            y.understanding = 0; // eslint-disable-line
          } else {
            y.understanding = ((ratioSum / itemSum) * 100).toFixed(1); // eslint-disable-line
          }
        });

        // 전체 학생 집중도 구하기
        const response = JSON.parse(msg).response_time;
        // 반응시간 아이템별로 분류
        const totalResponse = [];
        let itemResponse = [];
        let itId = -1;
        response.forEach((x) => {
          if (x.item_id !== itId) { // 새로운 item id
            if (itemResponse.length !== 0) { // itemResponse를 넣어줌
              totalResponse.push(itemResponse);
            }
            itemResponse = []; // 초기화
            itId = x.item_id;
          }
          itemResponse.push(x); // 아이템별 배열에 넣어줌
        });
        if (itemResponse.length !== 0) {
          totalResponse.push(itemResponse); // 다 끝났다면 마지막 아이템 전체에 넣어줌
        }
        // 개별 학생 집중도 초기화
        vm.totalStudentList.forEach((x) => {
          x.concec = 0; // eslint-disable-line
          x.conces = 0; // eslint-disable-line
        });
        // 아이템 하나씩 보면서 학생의 아이템별 집중도 계산
        totalResponse.forEach((x) => {
          if (x[0].type === 0 || x[0].type === 1) { // 문항일 경우 본 시간이 짧을수록 집중도 높음
            let timeSum = 0;
            let itemNum = 0;
            let min = -1;
            x.forEach((y) => {
              timeSum += y.time_sum;
              itemNum += 1;
              if (min === -1 || min > y.time_sum) { // 처음 값이거나 min보다 time sum이 작을 경우
                min = y.time_sum; // 최솟값 재지정
              }
            });
            const avg = timeSum / itemNum;
            const avg2 = (avg + min) / 2;
            x.forEach((y) => {
              vm.totalStudentList.forEach((z) => {
                if (y.student_id === z.user_id) {
                  let ratio = (avg2 / y.time_sum) * 100;
                  if (ratio > 100) { // 집중도 최댓값 100으로 조정
                    ratio = 100;
                  }
                  // 학생마다 집중도값 추가
                  z.concec += ratio; // eslint-disable-line
                  z.conces += 1; // eslint-disable-line
                }
              });
            });
          } else if (x[0].type === 4) { // 자료일 경우 본 시간이 길수록 집중도 높음
            let timeSum = 0;
            let itemNum = 0;
            let min = -1;
            x.forEach((y) => {
              timeSum += y.time_sum;
              itemNum += 1;
              if (min === -1 || min > y.time_sum) { // 처음 값이거나 min보다 time sum이 작을 경우
                min = y.time_sum; // 최솟값 재지정
              }
            });
            const avg = timeSum / itemNum;
            const avg2 = (avg + min) / 2;
            x.forEach((y) => {
              vm.totalStudentList.forEach((z) => {
                if (y.student_id === z.user_id) {
                  let ratio = (y.time_sum / avg2) * 100;
                  if (ratio > 100) { // 집중도 최댓값 100으로 조정
                    ratio = 100;
                  }
                  // 학생마다 집중도값 추가
                  z.concec += ratio; // eslint-disable-line
                  z.conces += 1; // eslint-disable-line
                }
              });
            });
          }
        });
        // 학생별 집중도 계산
        let totalConcen = 0;
        let conceN = 0;
        vm.totalStudentList.forEach((x) => {
          if (x.conces === 0) {
            x.concentration = 0; // eslint-disable-line
          } else {
            x.concentration = (x.concec / x.conces).toFixed(1); // eslint-disable-line
            totalConcen += (x.concec / x.conces);
            conceN += 1;
          }
        });
        // 전체 학생 집중도
        if (conceN === 0) {
          vm.concentration = 0;
        } else {
          vm.concentration = (totalConcen / conceN).toFixed(1);
        }
        // eventBus로 summary에 전달
        const ud = ['ud', vm.understanding];
        EventBus.$emit('makeSummary', ud);
        const cc = ['cc', vm.concentration];
        EventBus.$emit('makeSummary', cc);
      });
    },
    // 무인강의에서 참여도 계산
    automaticLectureAnalysis() {
      const vm = this;
      const para = {
        lecture_id: vm.lectureId,
      };
      vm.$socket.emit('REAL_TIME_INFO', JSON.stringify(para));
      vm.$socket.on('REAL_TIME_INFO', (msg) => {
        const response = JSON.parse(msg).response_time;
        // 누적 아이템 제출 결과로 참여도 구하기
        // 학생별로 참여한 아이템 수 계산
        const autoItem = [];
        let itemN = -1;
        response.forEach((x) => {
          if (x.item_id !== itemN) {
            autoItem.push(x.item_id);
            itemN = x.item_id;
          }
        });
        const questionNoteN = autoItem.length;
        // 학생별 전체 아이템 수 계산
        vm.nowStudentIdList.forEach((x) => {
          vm.totalStudentList.forEach((y) => {
            if (x === y.user_id) {
              y.partis = questionNoteN; // eslint-disable-line
            }
          });
        });
        vm.totalStudentList.forEach((x) => {
          x.partic = 0; // eslint-disable-line
          response.forEach((y) => {
            if (x.user_id === y.student_id) {
              x.partic += 1; // eslint-disable-line
            }
          });
        });
        // 개별 학생 누적 참여도 계산
        let partiN = 0;
        let wholeN = 0;
        vm.totalStudentList.forEach((x) => {
          if (x.partic > x.partis) {
            x.partis = x.partic; // eslint-disable-line
          }
          partiN += x.partic;
          wholeN += x.partis;

          if (x.partis === 0) { // 하나도 참여 안했으면 0
            x.participation = 0; // eslint-disable-line
          } else { // 참여도 계산
            x.participation = ((x.partic / x.partis) * 100).toFixed(1); // eslint-disable-line
          }
          // 참여 후 나간 경우
          if (x.participation > 100) {
            x.participation = 100.0; // eslint-disable-line
          }
        });

        // 전체 학생 누적 참여도 계산
        let participate = ((partiN / wholeN) * 100).toFixed(1);
        if (participate > 100) {
          // 문제를 풀고 이탈한 학생이 있을 경우, 참여도가 100%보다 큰 값으로 나올 수 있음
          // 이 경우 참여도 100%로 조정
          participate = 100.0; // eslint-disable-line
        }
        if (partiN === 0) { // NaN인 경우
          participate = 0; // eslint-disable-line
        }
        vm.participation = participate;
        const pp = ['pp', vm.participation];
        EventBus.$emit('makeSummary', pp);
      });
    },
  },
  beforeDestroy() {
    const vm = this;
    vm.beforeLeave();
    // 소켓 닫기 전에 callback 함수들 해제해줘야 함
    // 해제하지 않으면 재접속시 callback함수가 또 만들어져 중복으로 돌아감
    vm.$socket._callbacks = null; // eslint-disable-line
    vm.$socket.close();
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
#table_designs {
  border-collapse: collapse;
  text-align: center;
  line-height: 1.5;
  border-top: 1px solid #321;
  border-bottom: 1px solid #321;
  border-block-end: 1px solid #321;
}
#table_designs tbody td {
  border-block-start: 1px solid #321;
  border-left: 1px solid #321;
  border-right: 1px solid #321;
  color: #333;
}
.el-table .right {
  background: moccasin;
}
</style>
