<template>
  <div id="student_submit_manage">
    <!-- 학생 문제 출제 관리 -->
    <div v-if="ifOpen" style="margin-left: 30px;">
      <el-row>
        <el-col :span="12">
          <h3>현재 상태 - 과제 등록</h3>
          <br />
          <div style="width: 350px">
            <el-form>
              <el-form-item>
                출제 시작 시간
                <el-date-picker v-model="homeworkStart" type="datetime" placeholder="출제 시작 시간" readonly="true">
                  출제 시작 시간
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                출제 마감 시간
                <el-date-picker v-model="homeworkEnd" type="datetime" placeholder="출제 마감 시간" readonly="true">
                  출제 마감 시간
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                평가 시작 시간
                <el-date-picker v-model="scoringStart" type="datetime" placeholder="평가 시작 시간" readonly="true">
                  평가 시작 시간
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                평가 마감 시간
                <el-date-picker v-model="scoringEnd" type="datetime" placeholder="평가 마감 시간" readonly="true">
                  평가 마감 시간
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-button type="primary" style="float: right;" @click="onClick('DEL_SS')">과제 삭제</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <el-tabs>
            <el-tab-pane label="과제 미제출 학생 명단">
              <el-table :data="notSubmitStudentList" height="330px">
                <el-table-column label="이름" prop="name" />
                <el-table-column label="이메일" prop="email" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="평가 미수행 학생 명단">
              <el-table :data="notScoringStudentList" height="330px">
                <el-table-column label="이름" prop="name" />
                <el-table-column label="이메일" prop="email" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div style="height: 50px;" />
      <el-table :data="studentQuestion">
        <el-table-column label="이름" prop="name" width="150px" />
        <el-table-column label="이메일" prop="email" width="250px" />
        <el-table-column label="문제 이름" prop="title" />
        <el-table-column label="평가 점수" prop="score" width="100px" />
        <el-table-column width="200px">
          <template slot-scope="scope">
            <el-button @click="questionShow(scope.row)">미리보기</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog
        title="미리 보기"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        center
        width="30%">
        <lecture-live-item
          :data="lectureItem"
          :onClick="onClick"
          :answerSubmitted="isSubmitted"
          type="TEACHER"/>
        <br />
        <br />
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">닫기</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 과제 미등록 -->
    <div v-else style="margin-left: 30px;">
      <h3>현재 상태 - 과제 미등록</h3>
      <br />
      <el-switch v-model="ifMake" inactive-text="과제 미등록" active-text="과제 등록"/>
      <div style="height: 30px;" />
      <div v-if="ifMake" style="width: 350px">
        <el-form>
          <el-form-item>
            출제 시작 시간
            <el-date-picker v-model="homeworkStart" type="datetime" placeholder="출제 시작 시간">
              출제 시작 시간
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            출제 마감 시간
            <el-date-picker v-model="homeworkEnd" type="datetime" placeholder="출제 마감 시간">
              출제 마감 시간
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            평가 시작 시간
            <el-date-picker v-model="scoringStart" type="datetime" placeholder="평가 시작 시간">
              평가 시작 시간
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            평가 마감 시간
            <el-date-picker v-model="scoringEnd" type="datetime" placeholder="평가 마감 시간">
              평가 마감 시간
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="float: right;" @click="onClick('NEW_SS')">과제 등록</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import lectureService from '../../services/lectureService';
import LectureLiveItem from '../partials/LectureLiveItem';


export default {
  name: 'StudentSubmitManage',
  components: {
    LectureLiveItem,
  },
  data() {
    return {
      ifOpen: '', // true면 데이터 있음 - 삭제만 가능, false면 데이터 없음 - 생성만 가능
      ifMake: false, // true면 출제 허용하기
      homeworkStart: '',
      homeworkEnd: '',
      scoringStart: '',
      scoringEnd: '',
      studentQuestion: [], // 학생이 만든 문제들
      notSubmitStudentList: [], // 아직 숙제 내지 않은 학생들 명단
      notScoringStudentList: [], // 아직 평가하지 않은 학생들 명단
      dialogVisible: false,
      lectureItem: undefined,
      isSubmitted: false,
    };
  },
  // 페이지 로딩시 강의자료와 키워드들 불러오기
  async mounted() {
    const vm = this;
    const res1 = await lectureService.loadStudentSubmit({
      lectureId: vm.$route.params.lectureId,
    });
    vm.ifOpen = res1.data.success; // 데이터가 있는지 없는지
    if (vm.ifOpen === true) {
      // 데이터가 있다면
      vm.homeworkStart = res1.data.result.homeworkStartAt;
      vm.homeworkEnd = res1.data.result.homeworkEndAt;
      vm.scoringStart = res1.data.result.scoringStartAt;
      vm.scoringEnd = res1.data.result.scoringEndAt;

      // 과제 제출 안 한 학생들 리스트 만들기
      const res2 = await lectureService.notSubmitHomework({
        lectureId: vm.$route.params.lectureId,
      });
      res2.data.forEach((x) => {
        if (x.type === 0) { // 학생인 경우에만
          const tmp = {};
          tmp.name = x.name;
          tmp.email = x.email_id;
          vm.notSubmitStudentList.push(tmp);
        }
      });

      // 평가 안 한 학생들 리스트 만들기
      const res3 = await lectureService.notScoringHomework({
        lectureId: vm.$route.params.lectureId,
      });
      res3.data.forEach((x) => {
        if (x.type === 0) { // 학생인 경우에만
          const tmp = {};
          tmp.name = x.name;
          tmp.email = x.email_id;
          vm.notScoringStudentList.push(tmp);
        }
      });

      // 학생이 제출한 문제 리스트
      const res4 = await lectureService.loadStudentSubmitResult({
        lectureId: vm.$route.params.lectureId,
      });
      for (let i = 0; i < res4.data.length; i += 1) {
        const x = res4.data[i];
        const tmp = {};
        tmp.name = x.name;
        tmp.email = x.email_id;
        const res5 = await lectureService.studentQuestion({ // eslint-disable-line
          lectureId: vm.$route.params.lectureId,
          questionId: x.student_question_id,
        });
        tmp.title = res5.data.name;
        tmp.data = res5.data;
        if (res5.data.scoring_avg === 0 || res5.data.scoring_avg === null) {
          tmp.score = '평가 없음';
        } else {
          tmp.score = res5.data.scoring_avg;
        }
        vm.studentQuestion.push(tmp);
      }
    }
  },
  methods: {
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'NEW_SS': {
          if (vm.homeworkStart === '' || vm.homeworkEnd === '' || vm.scoringStart === '' || vm.scoringEnd === '') {
            // 비어있는 시간이 있을 경우
            vm.$notify({
              title: '시간 지정 오류',
              message: '4가지 시간 항목을 모두 채워주세요.',
              type: 'warning',
            });
            break;
          }
          if (vm.homeworkStart >= vm.homeworkEnd) {
            vm.$notify({
              title: '시간 지정 오류',
              message: '출제 마감 시간은 출제 시작 시간보다 늦게 설정되어야 합니다.',
              type: 'warning',
            });
            break;
          }
          if (vm.homeworkEnd >= vm.scoringStart) {
            vm.$notify({
              title: '시간 지정 오류',
              message: '평가 시작 시간은 출제 마감 시간보다 늦게 설정되어야 합니다.',
              type: 'warning',
            });
            break;
          }
          if (vm.scoringStart >= vm.scoringEnd) {
            vm.$notify({
              title: '시간 지정 오류',
              message: '평가 마감 시간은 평가 시작 시간보다 늦게 설정되어야 합니다.',
              type: 'warning',
            });
            break;
          }
          const hs = new Date(vm.homeworkStart).toISOString();
          const he = new Date(vm.homeworkEnd).toISOString();
          const ss = new Date(vm.scoringStart).toISOString();
          const se = new Date(vm.scoringEnd).toISOString();
          await lectureService.registerStudentSubmit({
            lectureId: vm.$route.params.lectureId,
            homeworkStartAt: hs,
            homeworkEndAt: he,
            scoringStartAt: ss,
            scoringEndAt: se,
          });
          vm.$notify({
            title: '과제 등록',
            message: '문제 출제 과제가 등록되었습니다.',
            type: 'success',
          });
          vm.ifOpen = true;
          break;
        }
        case 'DEL_SS': {
          // 출제 허용 초기화
          lectureService.deleteStudentSubmit({
            lectureId: vm.$route.params.lectureId,
          });
          vm.$notify({
            title: '과제 삭제',
            message: '문제 출제 과제가 삭제되었습니다.',
            type: 'success',
          });
          vm.homeworkStart = '';
          vm.homeworkEnd = '';
          vm.scoringStart = '';
          vm.scoringEnd = '';
          vm.ifOpen = false;
          vm.ifMake = false;
          vm.notSubmitStudentList = [];
          vm.notScoringStudentList = [];
          vm.studentQuestion = [];
          break;
        }
        default : {
          break;
        }
      }
    },
    handleClose() {
      const vm = this;
      vm.dialogVisible = false;
      vm.lectureItem = undefined;
    },
    async questionShow(data) {
      const vm = this;
      // 해당 문항을 deepCopy로 가져옴
      const ddl = deepCopy(data);
      const thisItem = {};
      thisItem.questions = [];
      thisItem.questions.push(ddl.data);
      thisItem.questions[0].student_answer_logs = [];
      if (ddl.data.choice.length > 0) {
        const splitChoice = ddl.data.choice.split('<$!<>');
        thisItem.questions[0].choice = splitChoice;
      }
      thisItem.type = 0; // 문항

      vm.lectureItem = thisItem;
      vm.dialogVisible = true;
    },
  },
};
</script>