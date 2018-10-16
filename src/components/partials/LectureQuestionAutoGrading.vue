<template>
  <div>
    <div v-if="page === 0">
      <h5>학생 최소 지지도 비율 (0~1 사이 실수를 입력해주세요.)</h5>
      <div style="display: inline-block; width: 200px">
        <el-input type="number" v-model="ratioStudent"></el-input>
      </div>
      <el-button type="primary" @click="onClick('EXTRACT_ANSWER')">채점용 답안 추출</el-button>
    </div>
    <div v-if="page === 1">
      <h3>잠시만 기다려주세요...</h3>
      <i style="font-size: 30px" class="fas el-icon-loading"></i>
    </div>
    <div v-if="page === 2">
      <el-row :gutter="30">
        <el-col :span="12">
          <h5>강사 답안 기준 자동채점</h5>
          <el-table :data="teacherSideList">
            <el-table-column label="단어">
              <template slot-scope="scope">
                <div v-if="teacherSideWordInputFlag[scope.$index] === true">
                  <div style="display:inline-block; width: 100px">
                    <el-input v-model="teacherSideTemporalWord[scope.$index]"/>
                  </div>
                  <el-button size="mini" @click="onClick('finishEditingTeacherWord', scope.$index)">확인</el-button>
                </div>
                <div v-else>
                  {{ scope.row.word }}<i class="el-icon-edit" @click="onClick('startEditingTeacherWord', scope.$index)" />
                </div>                
              </template>
            </el-table-column>
            <el-table-column label="중요도">
              <template slot-scope="scope">
                <div v-if="teacherSideScoreInputFlag[scope.$index] === true">
                  <div style="display:inline-block; width: 100px">
                    <el-input v-model="teacherSideTemporalScore[scope.$index]"/>
                  </div>
                  <el-button size="mini" @click="onClick('finishEditingTeacherScore', scope.$index)">확인</el-button>
                </div>
                <div v-else>
                  {{ scope.row.score }}<i class="el-icon-edit" @click="onClick('startEditingTeacherScore', scope.$index)" />
                </div>                
              </template>
            </el-table-column>
            <el-table-column label="-">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onClick('deleteTeacherSideWordAndScore', scope.$index)">삭제</el-button>
              </template>
            </el-table-column>
            <!-- TODO 불용어 추가 : 어디서 관리(삭제, 열람)할지?
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button type="danger">불용어 추가</el-button>
              </template>
            </el-table-column>
            -->
          </el-table>
          <div style="display: inline-block; width: 200px">
            <el-input placeholder="단어" v-model="teacherSideAdditionalWord"></el-input>
          </div>
          <div style="display: inline-block; width: 100px">
            <el-input type="number" placeholder="중요도" v-model="teacherSideAdditionalScore"></el-input>
          </div>
          <el-button size="mini" type="primary" @click="onClick('addTeacherSideWordAndScore')">추가</el-button>
        </el-col>

        <el-col :span="12">
          <h5>학생 답안 기준 자동채점</h5>
          <el-table :data="studentSideList">
            <el-table-column label="단어">
              <template slot-scope="scope">
                <div v-if="studentSideWordInputFlag[scope.$index] === true">
                  <div style="display:inline-block; width: 100px">
                    <el-input v-model="studentSideTemporalWord[scope.$index]"/>
                  </div>
                  <el-button size="mini" @click="onClick('finishEditingStudentWord', scope.$index)">확인</el-button>
                </div>
                <div v-else>
                  {{ scope.row.word }}<i class="el-icon-edit" @click="onClick('startEditingStudentWord', scope.$index)" />
                </div>                
              </template>
            </el-table-column>
            <el-table-column label="중요도">
              <template slot-scope="scope">
                <div v-if="studentSideScoreInputFlag[scope.$index] === true">
                  <div style="display:inline-block; width: 100px">
                    <el-input v-model="studentSideTemporalScore[scope.$index]"/>
                  </div>
                  <el-button size="mini" @click="onClick('finishEditingStudentScore', scope.$index)">확인</el-button>
                </div>
                <div v-else>
                  {{ scope.row.score }}<i class="el-icon-edit" @click="onClick('startEditingStudentScore', scope.$index)" />
                </div>                
              </template>
            </el-table-column>
            <el-table-column label="-">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onClick('deleteStudentSideWordAndScore', scope.$index)">삭제</el-button>
              </template>
            </el-table-column>
            <!-- TODO 불용어 추가 : 어디서 관리(삭제, 열람)할지?
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button type="danger">불용어 추가</el-button>
              </template>
            </el-table-column>
            -->
          </el-table>
          <div style="display: inline-block; width: 200px">
            <el-input placeholder="단어" v-model="studentSideAdditionalWord"></el-input>
          </div>
          <div style="display: inline-block; width: 100px">
            <el-input type="number" placeholder="중요도" v-model="studentSideAdditionalScore"></el-input>
          </div>
          <el-button size="mini" type="primary" @click="onClick('addStudentSideWordAndScore')">추가</el-button>
        </el-col>
      </el-row>
      
      <br/>
      <el-button type="primary" @click="onClick('GRADE')">채점하기</el-button>
    </div>
    <div v-if="page === 4">
      <h3>잠시만 기다려주세요...</h3>
      <i style="font-size: 30px" class="fas el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
import questionService from '../../services/questionService';
import { EventBus } from '../../event-bus';

export default {
  name: 'LectureQuestionAutoGrading',
  data() {
    return {
      // 강사
      teacherSideList: [], // 실제로 저장된 단어, 중요도 쌍
      teacherSideWordInputFlag: [], // 입력 플래그 - 단어
      teacherSideScoreInputFlag: [], // 입력 플래그 - 중요도
      teacherSideTemporalWord: [], // 단어 수정
      teacherSideTemporalScore: [], // 중요도 수정
      teacherSideAdditionalWord: '', // 단어 추가
      teacherSideAdditionalScore: '', // 중요도 추가

      // 학생
      studentSideList: [], // 실제로 저장된 단어, 중요도 쌍
      studentSideWordInputFlag: [], // 입력 플래그 - 단어
      studentSideScoreInputFlag: [], // 입력 플래그 - 중요도
      studentSideTemporalWord: [], // 단어 수정
      studentSideTemporalScore: [], // 중요도 수정
      studentSideAdditionalWord: '', // 단어 추가
      studentSideAdditionalScore: '', // 중요도 추가

      page: 0,
      ratioStudent: 1,
    };
  },
  methods: {
    async onClick(type, payload) {
      const vm = this;
      switch (type) {
        case 'EXTRACT_ANSWER': {
          // 유효성 검사
          if (vm.ratioStudent === '') {
            vm.$notify({
              title: 'Empty',
              message: '지지도는 반드시 입력해야 합니다.',
              type: 'warning',
            });
            return;
          }
          if (Number(vm.ratioStudent) < 0 || Number(vm.ratioStudent) > 1) {
            vm.$notify({
              title: 'Invalid',
              message: '지지도는 0보다 크거나 같고, 1보다 작거나 같아야합니다.',
              type: 'warning',
            });
            return;
          }
          vm.page = 1;
          const res = await questionService.extractAnswer({
            lectureItemId: vm.$route.params.itemId,
            ratioStudent: vm.ratioStudent,
          });
          vm.teacherSideList = res.data.lecturer;
          vm.studentSideList = res.data.student;
          vm.page = 2;

          break;
        }
        case 'GRADE': {
          vm.page = 4;
          const res = await questionService.autoGradeDescription({
            lectureItemId: vm.$route.params.itemId,
            teacherSideList: vm.teacherSideList,
            studentSideList: vm.studentSideList,
          });
          // console.log('questionService.autoGradeDescription res.data =  ', res.data);
          EventBus.$emit('autoGradingComplete', res.data);
          break;
        }
        case 'addTeacherSideWordAndScore': {
          // 유효성 검사
          if (vm.teacherSideAdditionalWord === '') {
            vm.$notify({
              title: 'Empty',
              message: '단어는 반드시 입력해야 합니다.',
              type: 'warning',
            });
            return;
          }
          if (vm.teacherSideAdditionalScore === '') {
            vm.$notify({
              title: 'Empty',
              message: '중요도는 반드시 입력해야 합니다.',
              type: 'warning',
            });
            return;
          }

          vm.teacherSideList.push({
            word: vm.teacherSideAdditionalWord,
            score: vm.teacherSideAdditionalScore,
          });
          vm.teacherSideAdditionalWord = '';
          vm.teacherSideAdditionalScore = '';
          break;
        }
        case 'deleteTeacherSideWordAndScore': {
          vm.teacherSideList.splice(payload, 1);
          break;
        }
        case 'startEditingTeacherWord': {
          vm.teacherSideTemporalWord[payload] = vm.teacherSideList[payload].word;
          vm.teacherSideWordInputFlag[payload] = null;
          vm.teacherSideWordInputFlag.splice(payload, 1, true);
          break;
        }
        case 'finishEditingTeacherWord': {
          vm.teacherSideList[payload].word = vm.teacherSideTemporalWord[payload];
          vm.teacherSideWordInputFlag.splice(payload, 1, false);
          break;
        }
        case 'startEditingTeacherScore': {
          vm.teacherSideTemporalScore[payload] = vm.teacherSideList[payload].score;
          vm.teacherSideScoreInputFlag[payload] = null;
          vm.teacherSideScoreInputFlag.splice(payload, 1, true);
          break;
        }
        case 'finishEditingTeacherScore': {
          vm.teacherSideList[payload].score = vm.teacherSideTemporalScore[payload];
          vm.teacherSideScoreInputFlag.splice(payload, 1, false);
          break;
        }

        case 'addStudentSideWordAndScore': {
          // 유효성 검사
          if (vm.studentSideAdditionalWord === '') {
            vm.$notify({
              title: 'Empty',
              message: '단어는 반드시 입력해야 합니다.',
              type: 'warning',
            });
            return;
          }
          if (vm.studentSideAdditionalScore === '') {
            vm.$notify({
              title: 'Empty',
              message: '중요도는 반드시 입력해야 합니다.',
              type: 'warning',
            });
            return;
          }

          vm.studentSideList.push({
            word: vm.studentSideAdditionalWord,
            score: vm.studentSideAdditionalScore,
          });
          vm.studentSideAdditionalWord = '';
          vm.studentSideAdditionalScore = '';
          break;
        }
        case 'deleteStudentSideWordAndScore': {
          vm.studentSideList.splice(payload, 1);
          break;
        }
        case 'startEditingStudentWord': {
          vm.studentSideTemporalWord[payload] = vm.studentSideList[payload].word;
          vm.studentSideWordInputFlag[payload] = null;
          vm.studentSideWordInputFlag.splice(payload, 1, true);
          break;
        }
        case 'finishEditingStudentWord': {
          vm.studentSideList[payload].word = vm.studentSideTemporalWord[payload];
          vm.studentSideWordInputFlag.splice(payload, 1, false);
          break;
        }
        case 'startEditingStudentScore': {
          vm.studentSideTemporalScore[payload] = vm.studentSideList[payload].score;
          vm.studentSideScoreInputFlag[payload] = null;
          vm.studentSideScoreInputFlag.splice(payload, 1, true);
          break;
        }
        case 'finishEditingStudentScore': {
          vm.studentSideList[payload].score = vm.studentSideTemporalScore[payload];
          vm.studentSideScoreInputFlag.splice(payload, 1, false);
          break;
        }


        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

<style>

</style>
