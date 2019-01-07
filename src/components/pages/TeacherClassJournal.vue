<template>
  <div class="bt-container">
    <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
      <el-breadcrumb-item :to="{ path: '/a/teacher/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
      <el-breadcrumb-item><a @click="onClick('CLASS_ANALYSIS')">{{ className }} 저널링</a></el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode !== '과목 저널링' && mode !== '학생 분석'">{{ lectureName }} {{ mode }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode === '학생 분석'">'{{ selectedStudentEmail }}' {{ mode }}</el-breadcrumb-item>
    </el-breadcrumb>

    <teacher-class-journal-keyword :lectureId="lectureId" v-if="mode === '키워드 상세 통계'" />

    <!-- <teacher-class-journal-student :classId="classId" v-if="mode === '학생 분석'" /> -->
    <el-select v-if="mode === '학생 선택' || mode === '학생 분석'" v-model="selectedStudentId" placeholder="학생을 선택하세요." @change="onClick('SELECT_STUDENT')">
      <el-option
        v-for="(item, index) in classStudentList"
        :key="index"
        :label="item.email_id"
        :value="item.user_id">
      </el-option>
    </el-select>

    <template v-if="mode === '과목 저널링' || mode === '강의 상세 통계' || mode === '학생 분석'">
      <!-- <el-button v-if="!isInDepthAnalize" type="primary" @click="isInDepthAnalize = true">심화분석</el-button> -->
      <el-button v-if="mode !== '학생 선택' && mode !== '학생 분석'" type="primary" @click="onClick('STUDENT_ANALYSIS')">학생분석</el-button>
      <template v-if="isInDepthAnalize">
        <el-cascader
          placeholder="선택하세요."
          :options="journalOption"
          v-model="selectedOption"
          expand-trigger="hover"
          @change="newOption()">
        </el-cascader>
        <el-button type="primary" @click="onClick('SEARCH')">조회하기</el-button>
        <el-tag v-for="(x, index) in nowOption" :key="index" closable @close="delOption(index)">{{ x[0] + " / " + x[1]  + " / " + x[2] }}</el-tag>
      </template>

      <line-chart v-if="dataIsPrepared" :chartCategories = "chartCategories" :chartData = "chartData"/>

      <!--
      <el-button v-if="mode !== '과목 저널링'" type="primary" size="small" @click="onClick('CLASS_ANALYSIS')">
        과목 레벨로 돌아가기
      </el-button>
      -->

          <el-table
            :data="tableData"
            style="width: 100%">
            
            <el-table-column
              :label="category"
              width="150"
              prop="name"
              align="center">
            </el-table-column>

            <template v-for="(x, index) in copyedNowOption">
              <el-table-column
                v-if="dataIsPrepared"
                :key="(index * 2) + 1"
                :label="compOptionName(x[0], x[1], x[2])"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.value[index] }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                v-if="dataIsPrepared"
                :key="index * 2"
                :label="compOptionName(x[0], x[1], x[2]) + ' 편차'"
                align="center">
                <template slot-scope="scope">
                  {{ scope.row.deviation[index] }}
                </template>
              </el-table-column> -->
            </template>

            <el-table-column
              v-if="mode==='과목 저널링'"
              label="-"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="onClick('KEYWORD_ANALYSIS', scope.row.lectureId, scope.row.name)">
                  키워드 상세 통계
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              v-if="mode==='과목 저널링'"
              label="-"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="onClick('LECTURE_ANALYSIS', scope.row.lectureId, scope.row.name)">
                  강의 상세 통계
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <teacher-class-journal-detail @childs-close-event="closeStatusBar()" :propDataSet = "studentDataSet" v-if = "isActiveInfo"/>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.classTitle {
  margin-bottom: 15px;
}
  .slider_div{
    position: relative;
  }
  .emptyDiv{
    width:100%;
    height:1px;
  }
  .slider_label{
    width: 100%;
    top: 0px;
    height: 100%;
    border-radius: 50%;

  }
  .slider_label_q{
    float: left;
    height: 100%;
    display: -webkit-box;
    -webkit-box-align: center;
    font-size: 10px;
    width: 22%;
  }
  .slider_label_qq{
    position: absolute;
    width: 15px;
    height: 15px;
    top: 25px;
  }
  .slider_label_qq.q2 {
    left:24%;
  }
  .slider_label_qq.q3 {
    left:48%;
  }
  .slider_label_qq.q4 {
    left:72%;
  }
  .slider_label_qq.q5 {
    left:94%;
  }
</style>

<style lang="scss">
  .el-slider__button-wrapper{
    display:none !important;
  }
  .el-slider__runway{
    cursor: auto;
  }
  .el-progress-bar__outer{
    background-color:#ffffff;
  }
  .el-slider__runway.disabled .el-slider__bar{
    background-color:#41355e;
  }

</style>

<script>
  import LineChart from '../partials/NNLineChart';
  import TeacherClassJournalDetail from '../partials/NNTeacherClassJournalDetail';
  import WordCloud from '../partials/WordCloud';
  import analysisService from '../../services/analysisService';
  import classService from '../../services/classService';
  import lectureService from '../../services/lectureService';
  import TeacherClassJournalKeyword from '../partials/TeacherClassJournalKeyword';
  import TeacherClassJournalStudent from '../partials/TeacherClassJournalStudent';

  export default {
    name: 'TeacherClassJournal',
    components: {
      LineChart,
      TeacherClassJournalDetail,
      WordCloud,
      TeacherClassJournalKeyword,
      TeacherClassJournalStudent,
    },
    data() {
      return {
        className: '',
        lectureId: '',
        lectureName: '',
        defaultValue: 0,
        isStudent: false,
        activeTab: 'basic',
        isActiveInfo: false,
        studentDataSet: [],
        chartData: [],
        chartCategories: [],
        tableData: [],
        dataIsPrepared: false,
        copyedNowOption: [], // 테이블에 보여줄 추가된 옵션
        isInDepthAnalize: false,
        mode: '과목 저널링', // 과목 저널링, 강의 상세 통계, 키워드 상세 통계
        category: '강의명',
        classStudentList: '', // 학생 분석시, 학생 목록 저장 배열
        selectedStudentId: '', // 학생 분석시, 선택된 학생 id 저장
        selectedStudentEmail: '', // 학생 분석시, 선택된 학생 email 저장

        // nowOption: [['전체', '전체', '집중도'], ['전체', '전체', '이해도'], ['전체', '전체', '참여도']], // 추가된 옵션
        nowOption: [['전체', '전체', '집중도'], ['전체', '전체', '참여도']], // 추가된 옵션
        selectedOption: [], // 추가할 옵션
        journalOption: [{
          value: '전체',
          label: '전체',
          children: [{
            value: '전체',
            label: '전체',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '예습',
            label: '예습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '본강',
            label: '본강',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '복습',
            label: '복습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }],
        }, {
          value: '문항',
          label: '문항',
          children: [{
            value: '전체',
            label: '전체',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '예습',
            label: '예습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '본강',
            label: '본강',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '복습',
            label: '복습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }],
        }, {
          value: '설문',
          label: '설문',
          children: [{
            value: '전체',
            label: '전체',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '예습',
            label: '예습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '본강',
            label: '본강',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }, {
            value: '복습',
            label: '복습',
            children: [{
              value: '전체',
              label: '전체',
            }, {
              value: '집중도',
              label: '집중도',
            }, {
              value: '이해도',
              label: '이해도',
            }, {
              value: '참여도',
              label: '참여도',
            }],
          }],
        }],

        allData: {
          classInfo: {},
          participation: [],
          understanding: [],
          concentration: [],
        },
      };
    },
    async beforeMount() {
      const vm = this;
      const res = await classService.getClass({ id: vm.classId });
      vm.className = res.data.name;

      // 테스트 서버 값 오류 대응 (시작)
      res.data.lectures = res.data.lectures.filter((value) => {
        if (value.lecture_id === 1 || value.lecture_id === 6) {
          return true;
        }
        return false;
      });
      // 테스트 서버 값 오류 대응 (끝)

      vm.allData.classInfo = res.data;
      console.log('@teacherClassJournal/getClass res.data = ', res.data);


      // 강의 번호 목록
      const lectureIdList = res.data.lectures.map(element => (element.lecture_id));
      console.log('lectureIdList = ', lectureIdList);

      for (let index = 0; index < lectureIdList.length; index += 1) {
        // 참여도 가져오기 / allData에 넣기
        const res1 = await analysisService.getParticipation({ lectureId: lectureIdList[index] }); // eslint-disable-line
        vm.allData.participation[index] = {
          ...res1.data,
          lectureId: lectureIdList[index],
        };
        // 이해도 가져오기 / allData에 넣기
        const res2 = await analysisService.getUnderstanding({ lectureId: lectureIdList[index] }); // eslint-disable-line
        vm.allData.understanding[index] = {
          ...res2.data,
          lectureId: lectureIdList[index],
        };
        // 집중도 가져오기 / allData에 넣기
        const res3 = await analysisService.getConcentration({ lectureId: lectureIdList[index] }); // eslint-disable-line
        vm.allData.concentration[index] = {
          ...res3.data,
          lectureId: lectureIdList[index],
        };
      }
      console.log('vm.allData = ', vm.allData);
      this.onClick('CLASS_ANALYSIS');
    },
    methods: {
      async onClick(type, payload, payload2) {
        const vm = this;
        switch (type) {
          case 'SEARCH': {
            if (vm.nowOption.length === 0) {
              vm.$notify({
                title: '항목 없음',
                message: '검색할 항목을 추가해주세요.',
                type: 'error',
                duration: 5000,
              });
              return;
            }
            vm.copyedNowOption = vm.nowOption.slice();
            vm.dataIsPrepared = true;
            break;
          }
          case 'STUDENT_STAT': {
            vm.studentDataSet = vm.allData.students[payload];
            vm.isActiveInfo = true;
            break;
          }
          case 'CLASS_ANALYSIS': {
            console.log('@click CLASS_ANALYSIS');
            vm.mode = '과목 저널링';
            vm.category = '강의 이름';

            // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop();
            while (vm.chartData.length > 0)vm.chartData.pop();
            vm.tableData = [];
            vm.dataIsPrepared = false;

            // 값 연산 - 자료는 서버 수정중이라 우선 문항에 대해서만
            const result = [];
            for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
              result[index] = [];
              // lecture를 들은 학생의 수
              const studentCnt = vm.allData.participation[index].lession.question.students.length;
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                // 우선, '문항 / 전체 / '에 대해서만 계산
                if (vm.nowOption[index2][2] === '집중도') {
                  // 아이템별 집중력을 저장할 2차원 배열
                  const concentrations = [];
                  const concentrationAverages = [];
                  const spendedTimeArr = []; // 디버깅용 - 개발후 삭제
                  for (let index3 = 0; index3 < vm.allData.concentration[index].lession.question.items.length; index3 += 1) {
                    concentrations[index3] = [];
                    spendedTimeArr[index3] = []; // 디버깅용 - 개발후 삭제
                    vm.allData.concentration[index].lession.question.items[index3].list.forEach((element) => {
                      const fixedStartTime = new Date(element.start_time);
                      const fixedEndTime = new Date(element.end_time);
                      const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                      const standard = vm.allData.concentration[index].lession.question.items[index3].response_time;
                      spendedTimeArr[index3].push(spendedTimes); // 디버깅용 - 개발후 삭제
                      concentrations[index3].push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                    });
                    let sum = 0.0;
                    concentrations[index3].forEach((element) => {
                      sum += element;
                    });
                    // 아이템별 평균 집중도 : 전체 학생수로 나눈 값을 사용
                    concentrationAverages.push(sum / studentCnt);
                  }
                  console.log('spendedTimeArr = ', spendedTimeArr);
                  // 강의별 평균 집중도
                  let sum = 0.0;
                  concentrationAverages.forEach((element) => {
                    sum += element;
                  });
                  const concentrationAverage = sum / concentrationAverages.length;
                  result[index].push((concentrationAverage * 100).toFixed(2));
                } else if (vm.nowOption[index2][2] === '이해도') {
                  result[index].push(5);
                } else if (vm.nowOption[index2][2] === '참여도') {
                  // lecture에 question이 몇개 포함되어 있는가
                  const questionCnt = Object.keys(vm.allData.participation[index].lession.question.items).length;
                  // 학생들이 제출한 question 갯수의 합
                  let submitCnt = 0;
                  vm.allData.participation[index].lession.question.students.forEach((element) => {
                    submitCnt += element.list.length;
                  });
                  // 학생들이 제출한 question 갯수의 합 / question 갯수 * 학생수
                  const participationAverage = submitCnt / (questionCnt * studentCnt);
                  // console.log('participationAverage * 100 = ', participationAverage * 100);
                  result[index].push((participationAverage * 100).toFixed(2));
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
                // result[index].push((index * index2 * 10) + 20);
              }
            }
            // console.log('vm.allData = ', vm.allData);
            // const start_time = vm.allData.concentration[0].lession.question.items[0].list[0].start_time;
            // console.log('start_time = ', start_time);
            // console.log('start_time instanceof Date = ', start_time instanceof Date);
            // const new_start_time = new Date(start_time);
            // console.log('new_start_time = ', new_start_time);
            // const end_time = vm.allData.concentration[0].lession.question.items[0].list[0].end_time;
            // console.log('end_time = ', end_time);
            // const new_end_time = new Date(end_time);
            // console.log(' new_end_time - new_start_time = ', new_end_time - new_start_time);

            // 값 출력
            Array.prototype.push.apply(vm.chartCategories, vm.allData.classInfo.lectures.map(x => x.name));
            for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
              const data = [];
              for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
                data.push(result[index][index2]);
              }
              vm.chartData[index2] = [vm.compOptionName(vm.nowOption[index2][0], vm.nowOption[index2][1], vm.nowOption[index2][2]), ...data];
            }
            vm.tableData = vm.allData.classInfo.lectures.map((x, index) => ({
              lectureId: x.lecture_id,
              name: x.name,
              value: result[index],
              deviation: [],
            }));
            vm.copyedNowOption = vm.nowOption.slice();
            vm.dataIsPrepared = true;
            break;
          }
          case 'LECTURE_ANALYSIS': {
            vm.mode = '강의 상세 통계';
            vm.dataIsPrepared = false;
            vm.category = '아이템 이름';
            vm.lectureId = payload;
            vm.lectureName = payload2;

            const res = await lectureService.getLecture({ lectureId: payload });
            while (vm.chartData.length > 0)vm.chartData.pop(); // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop(); // 초기화
            vm.tableData = [];

            // 값 연산 - 자료는 서버 수정중이라 우선 문항에 대해서만
            const filteredParticipation = vm.allData.participation.filter(x => x.lectureId === payload)[0];
            const filteredConcentration = vm.allData.concentration.filter(x => x.lectureId === payload)[0];
            const filteredUnderstanding = vm.allData.understanding.filter(x => x.lectureId === payload)[0];
            const result = [];
            const keys = Object.keys(filteredParticipation.lession.question.items);
            const names = [];
            keys.forEach((element) => {
              names.push(res.data.lecture_items.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
              // names.push(res.data.lecture_items.filter(x => x.lecture_item_id == element)[0].name);
            });

            // 강의 아이템 순회
            for (let index = 0; index < keys.length; index += 1) {
              result[index] = [];
              // 학생의 수 (공통 사용)
              const studentCnt = filteredParticipation.lession.question.students.length;
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                // 우선, '문항 / 전체 / '에 대해서만 계산
                if (vm.nowOption[index2][2] === '집중도') {
                  const concentrations = [];
                  filteredConcentration.lession.question.items[index].list.forEach((element) => {
                    const fixedStartTime = new Date(element.start_time);
                    const fixedEndTime = new Date(element.end_time);
                    const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                    const standard = filteredConcentration.lession.question.items[index].response_time;
                    concentrations.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                  });
                  let sum = 0.0;
                  concentrations.forEach((element) => {
                    sum += element;
                  });
                  // 아이템별 평균 집중도 : 전체 학생수로 나눈 값을 사용
                  const concentrationAverage = sum / studentCnt;
                  result[index].push((concentrationAverage * 100).toFixed(2));
                } else if (vm.nowOption[index2][2] === '이해도') {
                  result[index].push(5);
                } else if (vm.nowOption[index2][2] === '참여도') {
                  // 문항별 제출 수
                  const submitCnt = filteredParticipation.lession.question.items[keys[index]].length;
                  // 문항별 제출자의 수 / 학생의 수
                  const participationAverage = submitCnt / studentCnt;
                  result[index].push((participationAverage * 100)).toFixed(2);
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
                // result[index].push((index * index2 * 10) + 20);
              }
            }

            // 값 출력
            Array.prototype.push.apply(vm.chartCategories, names);
            for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
              const data = [];
              for (let index = 0; index < keys.length; index += 1) {
                data.push(result[index][index2]);
              }
              vm.chartData[index2] = [vm.compOptionName(vm.nowOption[index2][0], vm.nowOption[index2][1], vm.nowOption[index2][2]), ...data];
            }
            vm.tableData = names.map((x, index) => ({
              name: x,
              value: result[index],
              deviation: [],
            }));

            vm.dataIsPrepared = true;
            break;
          }
          case 'KEYWORD_ANALYSIS' : {
            vm.mode = '키워드 상세 통계';
            vm.lectureId = payload;
            vm.lectureName = payload2;
            break;
          }
          case 'STUDENT_ANALYSIS' : {
            const res = await analysisService.getLectureStudents({ classId: vm.classId });
            vm.classStudentList = res.data;
            vm.selectedStudentId = '';
            // console.log('@STUDENT_ANALYSIS, res.data = ', res.data);
            vm.mode = '학생 선택';
            break;
          }
          case 'SELECT_STUDENT' : {
            vm.category = '강의 이름';
            vm.mode = '학생 분석';
            // console.log('vm.selectedStudentId = ', vm.selectedStudentId);
            vm.selectedStudentEmail = vm.classStudentList.filter(x => x.user_id === vm.selectedStudentId)[0].email_id;

            // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop();
            while (vm.chartData.length > 0)vm.chartData.pop();
            vm.tableData = [];
            vm.dataIsPrepared = false;

            // 값 연산 - 자료는 서버 수정중이라 우선 문항에 대해서만
            const result = [];
            // 강의 순회
            for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
              result[index] = [];
              // 옵션 순회
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                // 우선, '문항 / 전체 / '에 대해서만 계산
                if (vm.nowOption[index2][2] === '집중도') {
                  // 아이템별 집중력을 저장할 2차원 배열
                  // console.log('index = ', index);
                  const concentrations = [];
                  for (let index3 = 0; index3 < vm.allData.concentration[index].lession.question.items.length; index3 += 1) {
                    vm.allData.concentration[index].lession.question.items[index3].list.forEach((element) => {
                      if (element.student_id === vm.selectedStudentId) {
                        const fixedStartTime = new Date(element.start_time);
                        const fixedEndTime = new Date(element.end_time);
                        const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                        // console.log('spendedTimes = ', spendedTimes);
                        const standard = vm.allData.concentration[index].lession.question.items[index3].response_time;
                        // console.log('standard = ', standard);
                        concentrations.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                      }
                    });
                  }
                  // console.log('concentrations = ', concentrations);
                  let sum = 0.0;
                  concentrations.forEach((element) => {
                    sum += element;
                  });
                  // 아이템별 평균 집중도 : 전체 학생수로 나눈 값을 사용
                  const concentrationAverages = (sum / vm.allData.concentration[index].lession.question.items.length);
                  result[index].push((concentrationAverages * 100).toFixed(2));
                } else if (vm.nowOption[index2][2] === '이해도') {
                  result[index].push(5);
                } else if (vm.nowOption[index2][2] === '참여도') {
                  // 강의에 아이템이 몇개 있는가 (우선 문항만)
                  const keys = Object.keys(vm.allData.participation[index].lession.question.items);
                  const itemCnt = keys.length;
                  // 해당 학생이 제출하였는가
                  let submitCnt = 0;
                  for (let index3 = 0; index3 < keys.length; index3 += 1) {
                    vm.allData.participation[index].lession.question.items[keys[index3]].forEach((element) => {
                      if (element.student_id === vm.selectedStudentId) submitCnt += 1;
                    });
                  }
                  const participation = submitCnt / itemCnt;
                  result[index].push((participation * 100).toFixed(2));
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
                // result[index].push((index * index2 * 10) + 20);
              }
            }

            // 값 출력
            Array.prototype.push.apply(vm.chartCategories, vm.allData.classInfo.lectures.map(x => x.name));
            for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
              const data = [];
              for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
                data.push(result[index][index2]);
              }
              vm.chartData[index2] = [vm.compOptionName(vm.nowOption[index2][0], vm.nowOption[index2][1], vm.nowOption[index2][2]), ...data];
            }
            vm.tableData = vm.allData.classInfo.lectures.map((x, index) => ({
              lectureId: x.lecture_id,
              name: x.name,
              value: result[index],
              deviation: [],
            }));
            vm.copyedNowOption = vm.nowOption.slice();
            vm.dataIsPrepared = true;
            break;
          }
          default: {
            throw new Error('not defined type', type);
          }
        }
      },
      closeStatusBar() {
        const vm = this;
        vm.isActiveInfo = false;
      },
      // 저널링 옵션 추가
      newOption() {
        const vm = this;
        let check = true;
        if (vm.selectedOption.length !== 3) {
          vm.$notify({
            title: '알림',
            message: '검색 옵션을 선택해주세요.',
            type: 'warning',
          });
          check = false;
        }
        vm.nowOption.forEach((x) => {
          if (x[0] === vm.selectedOption[0] && x[1] === vm.selectedOption[1] &&
              x[2] === vm.selectedOption[2]) {
            vm.$notify({
              title: '알림',
              message: '이미 추가된 옵션입니다.',
              type: 'warning',
            });
            vm.selectedOption = [];
            check = false;
          }
        });
        if (check === true) {
          vm.nowOption.push(vm.selectedOption);
          vm.selectedOption = [];
        }
      },
      // 저널링 옵션 삭제
      delOption(index) {
        this.nowOption.splice(index, 1);
      },
      compOptionName(type1, type2, type3) {
        let result = '';
        if (type1 !== '전체') {
          result += `${type1} / `;
        }
        if (type2 !== '전체') {
          result += `${type2} / `;
        }
        if (type3 !== '전체') {
          result += `${type3} `;
        }
        if (result === '') {
          return '전체';
        }
        return result;
      },
    },
    computed: {
      classId() {
        return this.$route.params.classId;
      },
    },
  };
</script>
