<template>
  <div class="bt-container">
    <!-- <el-button style="float: right" v-if="!isInDepthAnalize" type="primary" @click="isInDepthAnalize = true">심화 분석</el-button> -->
    <el-button style="float: right" v-if="isInDepthAnalize" @click="turnOffInDepthAnalize()" plain>기초 분석</el-button>
    <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
      <el-breadcrumb-item :to="{ path: '/a/teacher/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
      <el-breadcrumb-item><a @click="onClick('CLASS_ANALYSIS')">{{ className }} 저널링</a></el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode !== '과목 저널링' && mode !== '학생별 분석'  && mode !== '학생 선택'">{{ lectureName }} {{ mode }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode === '학생 선택'">{{ mode }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode === '학생별 분석'">'{{ selectedStudentEmail }}' {{ mode }}</el-breadcrumb-item>
    </el-breadcrumb>

    <teacher-class-journal-keyword :lectureId="lectureId" v-if="mode === '키워드 상세 통계'" />

    <!-- <teacher-class-journal-student :classId="classId" v-if="mode === '학생별 분석'" /> -->
    <el-select v-if="mode === '학생 선택' || mode === '학생별 분석'" v-model="selectedStudentId" placeholder="학생을 선택하세요." @change="onClick('SELECT_STUDENT')">
      <el-option
        v-for="(item, index) in lectureStudentList"
        :key="index"
        :label="item.email_id"
        :value="item.user_id">
      </el-option>
    </el-select>

    <template v-if="mode === '과목 저널링' || mode === '강의 상세 통계' || mode === '학생별 분석' || mode === '학생 상세 통계'">
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

      <line-chart v-if="dataIsPrepared && mode === '과목 저널링'" :chartCategories = "chartCategories" :chartData = "chartData"/>

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
          width="140"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="onClick('KEYWORD_DETAILED_ANALYSIS', scope.row.lectureId, scope.row.name)">
              키워드 상세 통계
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-if="mode==='과목 저널링'"
          label="-"
          width="140"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="onClick('LECTURE_DETAILED_ANALYSIS', scope.row.lectureId, scope.row.name)">
              강의 상세 통계
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-if="mode==='과목 저널링'"
          label="-"
          width="140"
          align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="onClick('STUDENT_DETAILED_ANALYSIS', scope.row.lectureId, scope.row.name)">
              학생 상세 통계
            </el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-button style="float: right; margin-top: 10px; margin-right: 15px;" v-if="mode === '과목 저널링'" size="small" type="primary" @click="onClick('STUDENT_ANALYSIS')">학생별 분석</el-button>
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
/* https://docs.google.com/document/d/1k8ywrL7H2yKblhqdgimhtlxM8CAHFJ7L0cjVNFPzQTA/ 인수인계서/저널링 문서 참조 */
/* eslint-disable max-len, no-loop-func */
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
        classStudentCount: 0,
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
        lectureStudentList: '', // 학생별 분석시, 학생 목록 저장 배열
        selectedStudentId: '', // 학생별 분석시, 선택된 학생 id 저장
        selectedStudentEmail: '', // 학생별 분석시, 선택된 학생 email 저장

        nowOption: [['전체', '전체', '이해도'], ['전체', '전체', '참여도'], ['전체', '전체', '집중도']], // 추가된 옵션
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
      try {
        const res = await classService.getClass({ id: vm.classId });
        vm.className = res.data.name;
        vm.allData.classInfo = res.data;

        const res2 = await classService.getClassUser({ id: vm.classId });
        vm.classStudentCount = res2.data.length;

        // 강의 번호 목록
        const lectureIdList = res.data.lectures.map(element => (element.lecture_id));

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
        this.onClick('CLASS_ANALYSIS');
      } catch (error) {
        vm.$notify({
          title: '데이터 수신 실패',
          message: '관리자에게 문의해주세요.',
          type: 'error',
          duration: 5000,
        });
        throw error;
      }
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
            vm.mode = '과목 저널링';
            vm.category = '강의 이름';

            // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop();
            while (vm.chartData.length > 0)vm.chartData.pop();
            vm.tableData = [];
            vm.dataIsPrepared = false;

            // console.log('vm.allData = ', vm.allData);

            const result = [];
            for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
              result[index] = [];

              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                if (vm.nowOption[index2][2] === '집중도') {
                  // lession 객체가 있고,
                  if (vm.allData.concentration[index].lession !== undefined) {
                    const concentrations = []; // 강의 안에 아이템별 집중력을 저장할 2차원 배열
                    const concentrationAverages = []; // 강의별 집중력의 평균을 저장할 1차원 배열
                    // lession 객체 안에 question(.items)이 있으면
                    if (vm.allData.concentration[index].lession.question.items !== undefined) {
                      for (let index3 = 0; index3 < vm.allData.concentration[index].lession.question.items.length; index3 += 1) { // 강의 안에 문항 아이템 순회
                        concentrations[index3] = [];
                        vm.allData.concentration[index].lession.question.items[index3].list.forEach((element) => {
                          const fixedStartTime = new Date(element.start_time);
                          const fixedEndTime = new Date(element.end_time);
                          const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                          const standard = vm.allData.concentration[index].lession.question.items[index3].response_time;
                          concentrations[index3].push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                        });
                        let sum = 0.0;
                        concentrations[index3].forEach((element) => {
                          sum += element;
                        });
                        // 아이템별 평균 집중도
                        concentrationAverages.push(sum / vm.classStudentCount);
                      }
                      // console.log('spendedTimeArr = ', spendedTimeArr);
                    }
                    // lession 객체 안에 survey(.items)이 있으면
                    if (vm.allData.concentration[index].lession.survey.items !== undefined) {
                      for (let index3 = 0; index3 < vm.allData.concentration[index].lession.survey.items.length; index3 += 1) { // 강의 안에 문항 아이템 순회
                        concentrations[index3] = [];
                        vm.allData.concentration[index].lession.survey.items[index3].list.forEach((element) => {
                          const fixedStartTime = new Date(element.start_time);
                          const fixedEndTime = new Date(element.end_time);
                          const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                          const standard = vm.allData.concentration[index].lession.survey.items[index3].response_time;
                          concentrations[index3].push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                        });
                        let sum = 0.0;
                        concentrations[index3].forEach((element) => {
                          sum += element;
                        });
                        // 아이템별 평균 집중도
                        concentrationAverages.push(sum / vm.classStudentCount);
                      }
                    }
                    if (concentrationAverages.length !== 0) { // 아이템 순회 결과가 있으면
                      // 강의별 평균 집중도
                      let sum = 0.0;
                      concentrationAverages.forEach((element) => {
                        sum += element;
                      });
                      const concentrationAverage = sum / concentrationAverages.length;
                      result[index].push((concentrationAverage * 100).toFixed(2));
                    } else { // 아이템 순회 결과가 없으면
                      result[index].push(0);
                    }
                  } else { // 강의가 없으면
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '이해도') {
                  if (vm.allData.understanding[index].lession !== undefined &&
                    vm.allData.understanding[index].lession.question !== undefined &&
                    vm.allData.understanding[index].lession.question.items !== undefined) {
                    let lectureUnderstanding = 0;
                    let lectureUnderstandingSum = 0;
                    const itemUnderstanding = [];
                    const itemUnderstandingSum = [];

                    // items 객체 순회
                    const keys = Object.keys(vm.allData.understanding[index].lession.question.items);
                    const itemsObjectLength = keys.length;
                    for (let index3 = 0; index3 < itemsObjectLength; index3 += 1) {
                      itemUnderstandingSum[index3] = 0;
                      vm.allData.understanding[index].lession.question.items[keys[index3]].forEach((element) => {
                        itemUnderstandingSum[index3] += element.ratio;
                      });
                      const itemLength = vm.allData.understanding[index].lession.question.items[keys[index3]].length;
                      itemUnderstanding[index3] = itemLength !== 0 ? (itemUnderstandingSum[index3] / itemLength) : 0;
                    }
                    itemUnderstanding.forEach((element) => {
                      lectureUnderstandingSum += element;
                    });
                    lectureUnderstanding = lectureUnderstandingSum / itemsObjectLength;
                    result[index].push((lectureUnderstanding * 100).toFixed(2));
                  } else {
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '참여도') {
                  if (vm.allData.participation[index].lession !== undefined) {
                    let itemCnt = 0;
                    let submitCnt = 0;
                    // lecture에 note 포함되어 있는가
                    if (vm.allData.participation[index].lession.note !== undefined &&
                      vm.allData.participation[index].lession.note.items !== undefined) {
                      // 아이템 갯수
                      itemCnt += Object.keys(vm.allData.participation[index].lession.note.items).length;
                      // 제출 갯수
                      vm.allData.participation[index].lession.note.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                    }
                    // lecture에 practice 포함되어 있는가
                    if (vm.allData.participation[index].lession.practice !== undefined &&
                      vm.allData.participation[index].lession.practice.items !== undefined) {
                      itemCnt += Object.keys(vm.allData.participation[index].lession.practice.items).length;
                      // 제출 갯수
                      vm.allData.participation[index].lession.practice.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                    }
                    // lecture에 question 포함되어 있는가
                    if (vm.allData.participation[index].lession.question !== undefined &&
                      vm.allData.participation[index].lession.question.items !== undefined) {
                      itemCnt += Object.keys(vm.allData.participation[index].lession.question.items).length;
                      // 제출 갯수
                      vm.allData.participation[index].lession.question.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                    }
                    // lecture에 survey 포함되어 있는가
                    if (vm.allData.participation[index].lession.survey !== undefined &&
                      vm.allData.participation[index].lession.survey.items !== undefined) {
                      itemCnt += Object.keys(vm.allData.participation[index].lession.survey.items).length;
                      // 제출 갯수
                      vm.allData.participation[index].lession.survey.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                    }
                    // 학생들이 제출한 갯수의 합 / item 갯수 * 학생수
                    const participationAverage = submitCnt / (itemCnt * vm.classStudentCount);
                    result[index].push((participationAverage * 100).toFixed(2));
                  } else {
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
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
          case 'LECTURE_DETAILED_ANALYSIS': {
            vm.mode = '강의 상세 통계';
            vm.dataIsPrepared = false;
            vm.category = '아이템 이름';
            vm.lectureId = payload;
            vm.lectureName = payload2;

            const res = await lectureService.getLecture({ lectureId: payload });
            console.log('res.data = ', res.data);
            const lectureItems = res.data.lecture_items;
            console.log('lectureItems = ', lectureItems);
            while (vm.chartData.length > 0)vm.chartData.pop(); // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop(); // 초기화
            vm.tableData = [];

            const result = []; // 최종 결과 출력할 2차원 배열
            const filteredParticipation = vm.allData.participation.filter(x => x.lectureId === payload)[0];
            const filteredConcentration = vm.allData.concentration.filter(x => x.lectureId === payload)[0];
            const filteredUnderstanding = vm.allData.understanding.filter(x => x.lectureId === payload)[0];
            const names = lectureItems.map(x => x.name);
            for (let index = 0; index < names.length; index += 1) {
              result[index] = [];
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                result[index].push(0); // 0으로 초기화
              }
            }

            // nowOption(선택한 옵션목록) 순회
            for (let index = 0; index < vm.nowOption.length; index += 1) {
              // 집중도이면
              if (vm.nowOption[index][2] === '집중도') {
                // 집중도.lession 있는지 확인
                if (filteredConcentration.lession !== undefined) { // 있으면 하나씩 계산해서 result에 값 push
                  // 자료
                  if (filteredConcentration.lession.note !== undefined &&
                    filteredConcentration.lession.note.items !== undefined) {
                    // 자료 item 순회
                    for (let index2 = 0; index2 < filteredConcentration.lession.note.items.length; index2 += 1) {
                      // 자료의 집중도는 현재 미구현
                    }
                  }
                  // 실습
                  if (filteredConcentration.lession.practice !== undefined &&
                    filteredConcentration.lession.practice.items !== undefined) {
                    // 실습 item 순회
                    for (let index2 = 0; index2 < filteredConcentration.lession.practice.items.length; index2 += 1) {
                      // 실습의 집중도는 현재 미구현
                    }
                  }
                  // 문항
                  if (filteredConcentration.lession.question !== undefined &&
                    filteredConcentration.lession.question.items !== undefined) {
                    // 문항 items 순회 (각 문항 아이템별로 제출한 기록을 몰아놓은 객체)
                    for (let index2 = 0; index2 < filteredConcentration.lession.question.items.length; index2 += 1) {
                      let singleItemConcentrationSum = 0; // 단일 문항 아이템 집중도 계산결과
                      // - 계산식 -
                      // 문항 items의 list 순회 ( 각 문항 아이템별로 제출한 기록을 하나 하나 순회)
                      const responseTime = filteredConcentration.lession.question.items[index2].response_time;
                      filteredConcentration.lession.question.items[index2].list.forEach((element) => {
                        // 제출 결과들의 집중도를 모두 더한다.
                        const fixedStartTime = new Date(element.start_time);
                        const fixedEndTime = new Date(element.end_time);
                        const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                        const standard = responseTime;
                        singleItemConcentrationSum += ((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                      });
                      // 모두 더한 값을 학생 수로 나누어 알맞은 위치에 넣는다.
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredConcentration.lession.question.items[index2].item_id));
                      result[index3][index] = ((singleItemConcentrationSum / vm.classStudentCount) * 100).toFixed(2);
                    }
                  }
                  // 설문
                  if (filteredConcentration.lession.survey !== undefined &&
                    filteredConcentration.lession.survey.items !== undefined) {
                    // item 순회
                    // 설문 items 순회 (각 설문 아이템별로 제출한 기록을 몰아놓은 객체)
                    for (let index2 = 0; index2 < filteredConcentration.lession.survey.items.length; index2 += 1) {
                      let singleItemConcentrationSum = 0; // 단일 설문 아이템 집중도 계산결과
                      // - 계산식 -
                      // 설문 items의 list 순회 ( 각 설문 아이템별로 제출한 기록을 하나 하나 순회)
                      const responseTime = filteredConcentration.lession.survey.items[index2].response_time;
                      filteredConcentration.lession.survey.items[index2].list.forEach((element) => {
                        // 제출 결과들의 집중도를 모두 더한다.
                        const fixedStartTime = new Date(element.start_time);
                        const fixedEndTime = new Date(element.end_time);
                        const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                        const standard = responseTime;
                        singleItemConcentrationSum += ((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                      });
                      // 모두 더한 값을 학생 수로 나누어 알맞은 위치에 넣는다.
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredConcentration.lession.survey.items[index2].item_id));
                      result[index3][index] = ((singleItemConcentrationSum / vm.classStudentCount) * 100).toFixed(2);
                    }
                  }
                }
              }
              // 이해도이면
              if (vm.nowOption[index][2] === '이해도') {
                // 이해도.lession 있는지 확인
                if (filteredUnderstanding.lession !== undefined) { // 있으면 하나씩 계산해서 result에 값 push
                  // 문항
                  if (filteredUnderstanding.lession.question !== undefined &&
                    filteredUnderstanding.lession.question.items !== undefined) {
                    // TODO 이해도 지금 하나도 안들어와서 작업해야합니다.
                  }
                }
              }
              // 참여도이면
              if (vm.nowOption[index][2] === '참여도') {
                // 참여도.lession 있는지 확인
                if (filteredParticipation.lession !== undefined) { // 있으면 하나씩 계산해서 result에 값 push
                  // 자료
                  if (filteredParticipation.lession.note !== undefined &&
                    filteredParticipation.lession.note.items !== undefined) {
                    // items key 추출
                    const keys = Object.keys(filteredParticipation.lession.note.items);
                    // items 배열 순회
                    for (let index2 = 0; index2 < keys.length; index2 += 1) {
                      // 해당 아이템 참여도 = 열람갯수 / 전체 학생수
                      const singleItemParticipation = filteredParticipation.lession.note.items[keys[index2]].length / vm.classStudentCount;
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredParticipation.lession.note.items[keys[index2]][0].item_id));
                      result[index3][index] = (singleItemParticipation * 100).toFixed(2);
                    }
                  }

                  // 실습
                  if (filteredParticipation.lession.practice !== undefined &&
                    filteredParticipation.lession.practice.items !== undefined) {
                    // items key 추출
                    const keys = Object.keys(filteredParticipation.lession.practice.items);
                    // items 배열 순회
                    for (let index2 = 0; index2 < keys.length; index2 += 1) {
                      // 해당 아이템 참여도 = 열람갯수 / 전체 학생수
                      const singleItemParticipation = filteredParticipation.lession.practice.items[keys[index2]].length / vm.classStudentCount;
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredParticipation.lession.practice.items[keys[index2]][0].item_id));
                      result[index3][index] = (singleItemParticipation * 100).toFixed(2);
                    }
                  }

                  // 문항
                  if (filteredParticipation.lession.question !== undefined &&
                    filteredParticipation.lession.question.items !== undefined) {
                    // items key 추출
                    const keys = Object.keys(filteredParticipation.lession.question.items);
                    // items 배열 순회
                    for (let index2 = 0; index2 < keys.length; index2 += 1) {
                      // 해당 아이템 참여도 = 열람갯수 / 전체 학생수
                      const singleItemParticipation = filteredParticipation.lession.question.items[keys[index2]].length / vm.classStudentCount;
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredParticipation.lession.question.items[keys[index2]][0].item_id));
                      result[index3][index] = (singleItemParticipation * 100).toFixed(2);
                    }
                  }

                  // 설문
                  if (filteredParticipation.lession.survey !== undefined &&
                    filteredParticipation.lession.survey.items !== undefined) {
                    // items key 추출
                    const keys = Object.keys(filteredParticipation.lession.survey.items);
                    // items 배열 순회
                    for (let index2 = 0; index2 < keys.length; index2 += 1) {
                      // 해당 아이템 참여도 = 열람갯수 / 전체 학생수
                      const singleItemParticipation = filteredParticipation.lession.survey.items[keys[index2]].length / vm.classStudentCount;
                      const index3 = lectureItems.findIndex(element =>
                        (element.lecture_item_id === filteredParticipation.lession.survey.items[keys[index2]][0].item_id));
                      result[index3][index] = (singleItemParticipation * 100).toFixed(2);
                    }
                  }

/*                   for (let index2 = 0; index2 < names.length; index2 += 1) {
                    result[index2][index] = 1;
                  } */
                }
              }
            }

            /*
             // 집중도
            if (filteredConcentration.lession !== undefined) {
              // 자료
              if (filteredConcentration.lession.note.items !== undefined) {
                // 키값이 객체의 프로퍼티로 넘어와서 추출
                const keys = Object.keys(filteredConcentration.lession.note.items);
                keys.forEach((element) => {
                  // 항목명 추출
                  names.push(lectureItems.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
                });
              }
              // 실습
              if (filteredConcentration.lession.practice.items !== undefined) {

              }
              // 문항
              if (filteredConcentration.lession.question.items !== undefined) {

              }
              // 설문
              if (filteredConcentration.lession.survey.items !== undefined) {

              }
            } else {
              for (let index = 0; index < names.length; index += 1 ) {

              }
            }

            // 이해도
            if (filteredUnderstanding.lession !== undefined) {
              // 자료
              // 실습
              // 문항
              // 설문
            }

            // 참여도
            if (filteredParticipation.lession !== undefined) {
              // 자료
              // 실습
              // 문항
              // 설문
            } */



            /* // lession 객체 유무 체크
            if (filteredConcentration.lession !== undefined) {
              if (filteredConcentration.lession.note.items !== undefined) { // 자료
                // 키값이 객체의 프로퍼티로 넘어와서 추출
                const keys = Object.keys(filteredConcentration.lession.note.items);
                keys.forEach((element) => {
                  // 항목명 추출
                  names.push(lectureItems.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
                });
                // 강의 아이템 순회
                for (let index = 0; index < keys.length; index += 1) {
                  result[itemIndex] = [];
                  for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                    if (vm.nowOption[index2][2] === '집중도') {
                      result[itemIndex].push(0);
                    } else if (vm.nowOption[index2][2] === '이해도') {
                      result[itemIndex].push(0);
                    } else if (vm.nowOption[index2][2] === '참여도') {
                      let itemCnt = 0;
                      let submitCnt = 0;
                      // 아이템 갯수
                      itemCnt += Object.keys(filteredParticipation.lession.note.items).length;
                      // 제출 갯수
                      filteredParticipation.lession.note.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                      // 학생들이 제출한 갯수의 합 / item 갯수 * 학생수
                      const participationAverage = submitCnt / (itemCnt * vm.classStudentCount);
                      result[itemIndex].push((participationAverage * 100).toFixed(2));
                    }
                  }
                  itemIndex += 1;
                }
              }
              if (filteredConcentration.lession.practice.items !== undefined) { // 실습
                const keys = Object.keys(filteredConcentration.lession.practice.items);
                keys.forEach((element) => {
                  names.push(lectureItems.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
                });
                // 강의 아이템 순회
                for (let index = 0; index < keys.length; index += 1) {
                  result[itemIndex] = [];
                  for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                    if (vm.nowOption[index2][2] === '집중도') {
                      result[itemIndex].push(0);
                    } else if (vm.nowOption[index2][2] === '이해도') {
                      result[itemIndex].push(0);
                    } else if (vm.nowOption[index2][2] === '참여도') {
                      let itemCnt = 0;
                      let submitCnt = 0;
                      // 아이템 갯수
                      itemCnt += Object.keys(filteredParticipation.lession.practice.items).length;
                      // 제출 갯수
                      filteredParticipation.lession.practice.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                      // 학생들이 제출한 갯수의 합 / item 갯수 * 학생수
                      const participationAverage = submitCnt / (itemCnt * vm.classStudentCount);
                      result[itemIndex].push((participationAverage * 100).toFixed(2));
                    }
                  }
                  itemIndex += 1;
                }
              }
              if (filteredConcentration.lession.question.items !== undefined) { // 문항
                const keys = Object.keys(filteredConcentration.lession.question.items);
                keys.forEach((element) => {
                  names.push(lectureItems.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
                });
                // 강의 아이템 순회
                for (let index = 0; index < keys.length; index += 1) {
                  result[itemIndex] = [];
                  for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
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
                      // 아이템 평균 집중도
                      const concentrationAverage = sum / concentrations.length;
                      result[itemIndex].push((concentrationAverage * 100).toFixed(2));
                    } else if (vm.nowOption[index2][2] === '이해도') {
                      let itemUnderstandingSum = 0;
                      filteredUnderstanding.lession.question.items[keys[index]].forEach((element) => {
                        itemUnderstandingSum += element.ratio;
                      });
                      const itemLength = filteredUnderstanding.lession.question.items[keys[index]].length;
                      const lectureUnderstanding = itemUnderstandingSum / itemLength;
                      result[itemIndex].push((lectureUnderstanding * 100).toFixed(2));
                    } else if (vm.nowOption[index2][2] === '참여도') {
                      let itemCnt = 0;
                      let submitCnt = 0;
                      // 아이템 갯수
                      itemCnt += Object.keys(filteredParticipation.lession.question.items).length;
                      // 제출 갯수
                      filteredParticipation.lession.question.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                      // 학생들이 제출한 갯수의 합 / item 갯수 * 학생수
                      const participationAverage = submitCnt / (itemCnt * vm.classStudentCount);
                      result[itemIndex].push((participationAverage * 100).toFixed(2));
                    }
                  }
                  itemIndex += 1;
                }
              }
              if (filteredConcentration.lession.survey.items !== undefined) { // 설문
                const keys = Object.keys(filteredConcentration.lession.survey.items);
                keys.forEach((element) => {
                  names.push(lectureItems.filter(x => x.lecture_item_id === parseInt(element, 10))[0].name);
                });
                // 강의 아이템 순회
                for (let index = 0; index < keys.length; index += 1) {
                  result[itemIndex] = [];
                  for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                    if (vm.nowOption[index2][2] === '집중도') {
                      const concentrations = [];
                      filteredConcentration.lession.survey.items[index].list.forEach((element) => {
                        const fixedStartTime = new Date(element.start_time);
                        const fixedEndTime = new Date(element.end_time);
                        const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                        const standard = filteredConcentration.lession.survey.items[index].response_time;
                        concentrations.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                      });
                      let sum = 0.0;
                      concentrations.forEach((element) => {
                        sum += element;
                      });
                      // 아이템 평균 집중도
                      const concentrationAverage = sum / concentrations.length;
                      result[itemIndex].push((concentrationAverage * 100).toFixed(2));
                    } else if (vm.nowOption[index2][2] === '이해도') {
                      result[itemIndex].push(0);
                    } else if (vm.nowOption[index2][2] === '참여도') {
                      let itemCnt = 0;
                      let submitCnt = 0;
                      // 아이템 갯수
                      itemCnt += Object.keys(filteredParticipation.lession.survey.items).length;
                      // 제출 갯수
                      filteredParticipation.lession.survey.students.forEach((element) => {
                        submitCnt += element.list.length;
                      });
                      // 학생들이 제출한 갯수의 합 / item 갯수 * 학생수
                      const participationAverage = submitCnt / (itemCnt * vm.classStudentCount);
                      result[itemIndex].push((participationAverage * 100).toFixed(2));
                    }
                  }
                  itemIndex += 1;
                }
              } */

              /* // 강의 아이템 순회
              for (let index = 0; index < keys.length; index += 1) {
                result[index] = [];
                for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
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
                    let understandingSum = 0;
                    filteredUnderstanding.lession.question.items[keys[index]].forEach((element) => {
                      understandingSum += element.ratio;
                    });
                    const singleItemLength = filteredUnderstanding.lession.question.items[keys[index]].length;
                    const understanding = understandingSum / singleItemLength;
                    result[index].push((understanding * 100).toFixed(2));
                  } else if (vm.nowOption[index2][2] === '참여도') {
                    // 문항별 제출 수
                    const submitCnt = filteredParticipation.lession.question.items[keys[index]].length;
                    // 문항별 제출자의 수 / 학생의 수
                    const participationAverage = submitCnt / studentCnt;
                    result[index].push((participationAverage * 100).toFixed(2));
                  } else if (vm.nowOption[index2][2] === '전체') {
                    result[index].push(5);
                  }
                }
              } */


            // 값 출력
            Array.prototype.push.apply(vm.chartCategories, names);
           /*  for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
              const data = [];
              for (let index = 0; index < names.length; index += 1) {
                data.push(result[index][index2]);
              }
              vm.chartData[index2] = [vm.compOptionName(vm.nowOption[index2][0], vm.nowOption[index2][1], vm.nowOption[index2][2]), ...data];
            } */
            vm.tableData = names.map((x, index) => ({
              name: x,
              value: result[index],
              deviation: [],
            }));

            /* for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
              const data = [];
              for (let index = 0; index < names.length; index += 1) {
                data.push(result[index][index2]);
              }
              vm.chartData[index2] = [vm.compOptionName(vm.nowOption[index2][0], vm.nowOption[index2][1], vm.nowOption[index2][2]), ...data];
            }
            vm.tableData = names.map((x, index) => ({
              name: x,
              value: result[index],
              deviation: [],
            })); */

            // }
            vm.dataIsPrepared = true;
            break;
          }
          case 'KEYWORD_DETAILED_ANALYSIS' : {
            vm.lectureId = payload;
            vm.lectureName = payload2;
            vm.mode = '키워드 상세 통계';
            break;
          }
          case 'STUDENT_DETAILED_ANALYSIS' : {
            vm.mode = '학생 상세 통계';
            vm.dataIsPrepared = false;
            vm.category = '학생 이름';
            vm.lectureId = payload;
            vm.lectureName = payload2;

            const res = await analysisService.getLectureStudents({ classId: vm.classId });
            vm.lectureStudentList = res.data;
            // const res2 = await lectureService.getLecture({ lectureId: payload });
            while (vm.chartData.length > 0)vm.chartData.pop(); // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop(); // 초기화
            vm.tableData = [];

            const filteredParticipation = vm.allData.participation.filter(x => x.lectureId === payload)[0];
            const filteredConcentration = vm.allData.concentration.filter(x => x.lectureId === payload)[0];
            const filteredUnderstanding = vm.allData.understanding.filter(x => x.lectureId === payload)[0];
            const result = []; // 최종 결과 입력할 2차원 배열

            // 아이템 키 정보 (일부 아이템 id를 키로 가지고 배열로 넘어오기 때문)
            // const keys = Object.keys(filteredParticipation.lession.question.items);

            // 학생 순회
            for (let index = 0; index < vm.lectureStudentList.length; index += 1) {
              result[index] = [];
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                if (vm.nowOption[index2][2] === '집중도') {
                  let itemCnt = 0;
                  if (filteredConcentration.lession !== undefined) {
                    // 한 학생의 아이템별 집중도를 저장할 배열
                    const singleStudentConcentrationArray = [];
                    // 한 학생의 아이템별 집중도를 모두 합한 값을 저장할 변수
                    let SingleStudentConcentrationSum = 0;
                    if (filteredConcentration.lession.note !== undefined &&
                      filteredConcentration.lession.note.items !== undefined) { // 자료
                      // 키값이 객체의 프로퍼티로 넘어와서 추출
                      const keys = Object.keys(filteredParticipation.lession.note.items);
                      itemCnt += keys.length;
                    }
                    if (filteredConcentration.lession.practice !== undefined &&
                      filteredConcentration.lession.practice.items !== undefined) { // 실습
                      const keys = Object.keys(filteredParticipation.lession.practice.items);
                      itemCnt += keys.length;
                    }
                    if (filteredConcentration.lession.question !== undefined &&
                      filteredConcentration.lession.question.items !== undefined) { // 문항
                      const keys = Object.keys(filteredParticipation.lession.question.items);
                      itemCnt += keys.length;
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredConcentration.lession.question.items[index3];
                        const targetItemTargetLog = targetItemSubmitLogs.list.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          singleStudentConcentrationArray.push(0);
                        } else {
                          const fixedStartTime = new Date(targetItemTargetLog.start_time);
                          const fixedEndTime = new Date(targetItemTargetLog.end_time);
                          const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                          const standard = targetItemSubmitLogs.response_time;
                          singleStudentConcentrationArray.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                        }
                      }
                    }
                    if (filteredConcentration.lession.survey !== undefined &&
                      filteredConcentration.lession.survey.items !== undefined) { // 설문
                      const keys = Object.keys(filteredParticipation.lession.survey.items);
                      itemCnt += keys.length;
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredConcentration.lession.survey.items[index3];
                        const targetItemTargetLog = targetItemSubmitLogs.list.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          singleStudentConcentrationArray.push(0);
                        } else {
                          const fixedStartTime = new Date(targetItemTargetLog.start_time);
                          const fixedEndTime = new Date(targetItemTargetLog.end_time);
                          const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                          const standard = targetItemSubmitLogs.response_time;
                          singleStudentConcentrationArray.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                        }
                      }
                    }
                    if (itemCnt === 0) { // 아이템이 하나도 없어도 0
                      result[index].push(0);
                    } else {
                      // 저장된 값을 모두 더함
                      singleStudentConcentrationArray.forEach((element) => {
                        SingleStudentConcentrationSum += element;
                      });
                      // 더한 값을 item 길이로 나눠서 평균을 구함
                      const concentration = SingleStudentConcentrationSum / itemCnt;
                      result[index].push((concentration * 100).toFixed(2));
                    }
                  } else { // 포함된 lession 객체가 없으면 0 입력
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '이해도') {
                  if (filteredUnderstanding.lession !== undefined &&
                    filteredUnderstanding.lession.question !== undefined &&
                    filteredUnderstanding.lession.question.items !== undefined) { // 문항
                    // 한 학생의 아이템별 이해도를 저장할 배열
                    const singleStudentUnderstandingArray = [];
                    // 한 학생의 아이템별 이해도를 모두 합한 값을 저장할 변수
                    let SingleStudentUnderstandingSum = 0;

                    const keys = Object.keys(filteredUnderstanding.lession.question.items);
                    // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 이해도를 구해서 singleStudentUnderstandingArray 배열에 저장
                    for (let index3 = 0; index3 < keys.length; index3 += 1) {
                      const targetItemSubmitLogs = filteredUnderstanding.lession.question.items[keys[index3]];
                      const targetItemTargetLog = targetItemSubmitLogs.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                      if (targetItemTargetLog === undefined) {
                        singleStudentUnderstandingArray.push(0);
                      } else {
                        singleStudentUnderstandingArray.push(targetItemTargetLog.ratio);
                      }
                    }
                    // 저장된 값을 모두 더함
                    singleStudentUnderstandingArray.forEach((element) => {
                      SingleStudentUnderstandingSum += element;
                    });
                    // 더한 값을 item 길이로 나눠서 평균을 구함
                    const understanding = SingleStudentUnderstandingSum / keys.length;
                    result[index].push((understanding * 100).toFixed(2));
                  } else { // 과목에 강의가 없으면 0
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '참여도') {
                  if (filteredParticipation.lession !== undefined) {
                    // 한 학생의 아이템별 참여도를 저장할 배열
                    const singleStudentParticipationArray = [];
                    // 한 학생의 아이템별 참여도를 모두 합한 값을 저장할 변수
                    let SingleStudenttParticipationSum = 0;

                    if (filteredParticipation.lession.note !== undefined &&
                      filteredParticipation.lession.note.items !== undefined) { // 자료
                      const keys = Object.keys(filteredParticipation.lession.note.items);
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredParticipation.lession.note.items[keys[index3]];
                        const targetItemTargetLog = targetItemSubmitLogs.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          if (index === 2) {
                            console.log('push(0), index3 = ', index3);
                          }
                          singleStudentParticipationArray.push(0);
                        } else {
                          if (index === 2) {
                            console.log('push(1), index3 = ', index3);
                          }
                          singleStudentParticipationArray.push(1);
                        }
                      }
                    }
                    if (filteredParticipation.lession.practice !== undefined &&
                      filteredParticipation.lession.practice.items !== undefined) { // 실습
                      const keys = Object.keys(filteredParticipation.lession.practice.items);
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredParticipation.lession.practice.items[[keys[index3]]];
                        const targetItemTargetLog = targetItemSubmitLogs.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          singleStudentParticipationArray.push(0);
                        } else {
                          singleStudentParticipationArray.push(1);
                        }
                      }
                    }
                    if (filteredParticipation.lession.question !== undefined &&
                      filteredParticipation.lession.question.items !== undefined) { // 문항
                      const keys = Object.keys(filteredParticipation.lession.question.items);
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredParticipation.lession.question.items[keys[index3]];
                        const targetItemTargetLog = targetItemSubmitLogs.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          singleStudentParticipationArray.push(0);
                        } else {
                          singleStudentParticipationArray.push(1);
                        }
                      }
                    }
                    if (filteredParticipation.lession.survey !== undefined &&
                      filteredParticipation.lession.survey.items !== undefined) { // 설문
                      const keys = Object.keys(filteredParticipation.lession.survey.items);
                      // 아이템 순회 - 아이템을 돌며, 한 학생의 아이템별 집중도를 구해서 singleStudentConcentrationArray 배열에 저장
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        const targetItemSubmitLogs = filteredParticipation.lession.survey.items[keys[index3]];
                        const targetItemTargetLog = targetItemSubmitLogs.filter(x => x.student_id === vm.lectureStudentList[index].user_id)[0];
                        if (targetItemTargetLog === undefined) {
                          singleStudentParticipationArray.push(0);
                        } else {
                          singleStudentParticipationArray.push(1);
                        }
                      }
                    }
                    // 저장된 값을 모두 더함
                    singleStudentParticipationArray.forEach((element) => {
                      SingleStudenttParticipationSum += element;
                    });
                    // 더한 값을 item 길이로 나눠서 평균을 구함
                    const participation = SingleStudenttParticipationSum / singleStudentParticipationArray.length;
                    result[index].push((participation * 100).toFixed(2));
                  } else {
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
              }
            }
            vm.tableData = vm.lectureStudentList.map((x, index) => ({
              name: x.name,
              value: result[index],
            }));

            vm.dataIsPrepared = true;
            break;
          }
          case 'STUDENT_ANALYSIS' : {
            const res = await analysisService.getLectureStudents({ classId: vm.classId });
            vm.lectureStudentList = res.data;
            vm.selectedStudentId = '';
            vm.mode = '학생 선택';
            break;
          }
          case 'SELECT_STUDENT' : {
            vm.category = '강의 이름';
            vm.mode = '학생별 분석';
            // console.log('vm.selectedStudentId = ', vm.selectedStudentId);
            vm.selectedStudentEmail = vm.lectureStudentList.filter(x => x.user_id === vm.selectedStudentId)[0].email_id;

            // 초기화
            while (vm.chartCategories.length > 0)vm.chartCategories.pop();
            while (vm.chartData.length > 0)vm.chartData.pop();
            vm.tableData = [];
            vm.dataIsPrepared = false;
            const result = [];
            // 강의 순회
            for (let index = 0; index < vm.allData.classInfo.lectures.length; index += 1) {
              result[index] = [];
              // 옵션 순회
              for (let index2 = 0; index2 < vm.nowOption.length; index2 += 1) {
                if (vm.nowOption[index2][2] === '집중도') {
                  if (vm.allData.concentration[index].lession !== undefined) {
                    // 아이템별 집중력을 저장할 2차원 배열
                    const concentrations = [];

                    if (vm.allData.concentration[index].lession.note !== undefined &&
                      vm.allData.concentration[index].lession.note.items !== undefined) {
                      // 서버 스펙 미구현
                    }
                    if (vm.allData.concentration[index].lession.practice !== undefined &&
                      vm.allData.concentration[index].lession.practice.items !== undefined) {
                      // 서버 스펙 미구현
                    }
                    if (vm.allData.concentration[index].lession.question !== undefined &&
                      vm.allData.concentration[index].lession.question.items !== undefined) {
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
                    }
                    if (vm.allData.concentration[index].lession.survey !== undefined &&
                      vm.allData.concentration[index].lession.survey.items !== undefined) {
                      for (let index3 = 0; index3 < vm.allData.concentration[index].lession.survey.items.length; index3 += 1) {
                        vm.allData.concentration[index].lession.survey.items[index3].list.forEach((element) => {
                          if (element.student_id === vm.selectedStudentId) {
                            const fixedStartTime = new Date(element.start_time);
                            const fixedEndTime = new Date(element.end_time);
                            const spendedTimes = ((fixedEndTime - fixedStartTime) / 1000);
                            // console.log('spendedTimes = ', spendedTimes);
                            const standard = vm.allData.concentration[index].lession.survey.items[index3].response_time;
                            // console.log('standard = ', standard);
                            concentrations.push((standard / spendedTimes) < 1 ? standard / spendedTimes : 1); // 1보다 크면 1 처리 : 서버 요구사항
                          }
                        });
                      }
                    }
                    if (concentrations.length !== 0) {
                      let sum = 0.0;
                      concentrations.forEach((element) => {
                        sum += element;
                      });
                      // 아이템별 평균 집중도 : 전체 학생수로 나눈 값을 사용
                      const concentrationAverages = (sum / concentrations.length);
                      result[index].push((concentrationAverages * 100).toFixed(2));
                    } else { // 집중도 계산할 아이템이 없으면
                      result[index].push(0);
                    }
                  } else { // lession 객체가 없으면 0
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '이해도') {
                  if (vm.allData.understanding[index].lession !== undefined &&
                    vm.allData.understanding[index].lession.question !== undefined &&
                    vm.allData.understanding[index].lession.question.items !== undefined) {
                    // 단일 학생의 강의 아이템별 이해도를 저장할 배열
                    const singleStudentUnderstandingForItemsArray = [];
                    // 단일 학생의 강의 아이템별 이해도의 합계를 저장할 변수
                    let singleStudentUnderstandingForItemsSum = 0;

                    const keys = Object.keys(vm.allData.understanding[index].lession.question.items);
                    for (let index3 = 0; index3 < keys.length; index3 += 1) {
                      const targetItemLog = vm.allData.understanding[index].lession.question.items[keys[index3]].filter(element => element.student_id === vm.selectedStudentId)[0];
                      if (targetItemLog === undefined) {
                        singleStudentUnderstandingForItemsArray.push(0);
                      } else {
                        singleStudentUnderstandingForItemsArray.push(targetItemLog.ratio);
                      }
                    }
                    // 이해도 합을 구함
                    singleStudentUnderstandingForItemsArray.forEach((element) => {
                      singleStudentUnderstandingForItemsSum += element;
                    });
                    // 이해도 평균을 구함
                    const understanding = singleStudentUnderstandingForItemsSum / keys.length;
                    result[index].push((understanding * 100).toFixed(2));
                  } else {
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '참여도') {
                  if (vm.allData.participation[index].lession !== undefined) {
                    let itemCnt = 0;
                    let submitCnt = 0;
                    // lecture에 note 포함되어 있는가
                    if (vm.allData.participation[index].lession.note.items !== undefined) {
                      const keys = Object.keys(vm.allData.participation[index].lession.note.items);
                      itemCnt += Object.keys(vm.allData.participation[index].lession.note.items).length;
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        vm.allData.participation[index].lession.note.items[keys[index3]].forEach((element) => {
                          if (element.student_id === vm.selectedStudentId) submitCnt += 1;
                        });
                      }
                    }
                    // lecture에 practice 포함되어 있는가
                    if (vm.allData.participation[index].lession.practice.items !== undefined) {
                      const keys = Object.keys(vm.allData.participation[index].lession.practice.items);
                      itemCnt += Object.keys(vm.allData.participation[index].lession.practice.items).length;
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        vm.allData.participation[index].lession.practice.items[keys[index3]].forEach((element) => {
                          if (element.student_id === vm.selectedStudentId) submitCnt += 1;
                        });
                      }
                    }
                    // lecture에 question 포함되어 있는가
                    if (vm.allData.participation[index].lession.question.items !== undefined) {
                      const keys = Object.keys(vm.allData.participation[index].lession.question.items);
                      itemCnt += Object.keys(vm.allData.participation[index].lession.question.items).length;
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        vm.allData.participation[index].lession.question.items[keys[index3]].forEach((element) => {
                          if (element.student_id === vm.selectedStudentId) submitCnt += 1;
                        });
                      }
                    }
                    // lecture에 survey 포함되어 있는가
                    if (vm.allData.participation[index].lession.survey.items !== undefined) {
                      const keys = Object.keys(vm.allData.participation[index].lession.survey.items);
                      itemCnt += Object.keys(vm.allData.participation[index].lession.survey.items).length;
                      for (let index3 = 0; index3 < keys.length; index3 += 1) {
                        vm.allData.participation[index].lession.survey.items[keys[index3]].forEach((element) => {
                          if (element.student_id === vm.selectedStudentId) submitCnt += 1;
                        });
                      }
                    }
                    if (itemCnt !== 0) { // 포함된 아이템이 하나라도 있으면
                      // 학생이 제출한 갯수의 합 / item 갯수
                      const participationAverage = submitCnt / itemCnt;
                      result[index].push((participationAverage * 100).toFixed(2));
                    } else { // 아이템이 없으면
                      result[index].push(0);
                    }
                  } else {
                    result[index].push(0);
                  }
                } else if (vm.nowOption[index2][2] === '전체') {
                  result[index].push(5);
                }
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
      turnOffInDepthAnalize() {
        this.nowOption = [['전체', '전체', '이해도'], ['전체', '전체', '참여도'], ['전체', '전체', '집중도']];
        this.isInDepthAnalize = false;
        this.onClick('SEARCH');
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
