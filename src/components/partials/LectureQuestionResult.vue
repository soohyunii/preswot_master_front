<template>
  <div>
    <div v-if="studentQuestionResult">
      <el-row v-if="resultType === '실시간'">
        <el-col :span="5"><strong>현재 수강 인원</strong></el-col>
        <!-- <el-col :span="8"> 실시간 수강 인원  / {{ numberOfStudentInClass }} </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="3"><strong>학생 답변</strong></el-col>
        <el-col :span="7">총 {{ studentQuestionResult.numberOfStudent }}건</el-col>
        <el-button v-if="resultType === '실시간'" style="float:right" type="primary" size="small" icon="el-icon-refresh" @click="refresh()">새로고침</el-button>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span v-if="studentQuestionResult.type === '객관'" class="table-caption">단위 : 명</span>
          <el-table v-if="studentQuestionResult.type === '객관'"
                    :data="questionResultSummary"
                    :header-cell-style="changeHead"
                    style="margin-bottom: 20px;">
            <el-table-column
              prop="numAnswer"
              label="정답"
              align="center">
            </el-table-column>
            <el-table-column
              prop="numPartialAnswer"
              label="부분 정답"
              align="center">
            </el-table-column>
            <el-table-column
              prop="numWrongAnswer"
              label="오답"
              align="center">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-table :data="studentQuestionResult.answers"
                :header-cell-style="changeHead"
                :default-sort="{prop: 'score', order: 'ascending'}">
                <!-- height="500"> -->
        <el-table-column
          label="학생 아이디"
          align="center"
          width="250px">
          <template slot-scope="scope">
            <p>{{ scope.row.user.email_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studentQuestionResult.type === '서술'"
          label="첨부 파일"
          align="center">
          <template slot-scope="scope">
            <el-dropdown @command="handleVisible" placement="bottom-start" trigger="click">
              <span class="el-dropdown-link">
                제출 파일 목록<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div v-for="(file) in scope.row.files" :key="file.file_guid">
                  <el-dropdown-item type="text" :command="file">{{ file.name }}</el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="답변"
          align="center">
          <template slot-scope="scope">
            <span v-for="(answer, index) in scope.row.answer" class="item" :key="index">
              <span>{{ answer }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studentQuestionResult.type === 'SW'"
          label="결과"
          align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.swResult }}</p>
            <p>{{ scope.row.oj_solution.time }}ms, {{ scope.row.oj_solution.memory }}KB</p>
            <p v-if="scope.row.swResult === '컴파일 에러'">{{ scope.row.oj_compileinfo.error }}</p>
            <p v-if="scope.row.swResult === '런타임 에러'">{{ scope.row.oj_runtimeinfo.error }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="점수"
          width="150px"
          align="center">
            <template slot-scope="scope">
              <div v-if="studentQuestionResult.type !== '서술'">
                <p v-if="scope.row.score === null">-</p>
                <p v-else>{{ scope.row.score }}</p>
              </div>
              <div v-else>
                <el-input placeholder="Please input"
                        v-model="scope.row.score"
                        type="number"
                        min="0"
                        :max="studentQuestionResult.score" />
              </div>
            </template>
        </el-table-column>
        <el-table-column
          v-if="studentQuestionResult.type === '서술'"
          label=""
          width="100px"
          align="center">
          <template slot-scope="scope">
            <el-button type="info"
                      plain
                      size="small"
                      @click="scoreSubmit(scope.row.score, scope.row.student_answer_log_id)">
              확인
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :visible.sync="fileVisible"
        :before-close="handleClose"
        custom-class="dialog">
        <div v-if="fileType === `.mp4`">
          <vue-plyr ref="player">
            <video>
              <source :src="url" type="video/mp4">
            </video>
          </vue-plyr>
        </div>
        <div v-else-if="['.jpg','.png','.gif'].includes(fileType)">
          <img :src="url" width="100%">
        </div>
        <div v-else>
          <a :href="url" target="_blank" download>{{ fileName }}</a>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .choices {
    padding-right: 25px;
    .index {
      color: #888888;
    }
  }
  .el-row {
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  .item + .item:before {
    content: ", ";
  }
  .table-caption {
    float: right;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
<style src="vue-plyr/dist/vue-plyr.css">
</style>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import questionService from '../../services/questionService';
  import { baseUrl } from '../../services/config';
  import utils from '../../utils';

  export default {
    name: 'LectureQuestionResult',
    props: ['classId', 'itemId', 'resultType'],
    data() {
      return {
        activeTab: 'question',
        questionResultSummary: [{
          numAnswer: null,
          numPartialAnswer: null,
          numTotal: null,
        }],
        studentQuestionResult: undefined,
        fileVisible: false,
        fileName: null,
        fileType: null,
        filePath: null,
        player: null,
      };
    },
    computed: {
      ...mapState('grading', [
        'theResult',
        'questionResult',
      ]),
      ...mapGetters('NNclass', [
        'currentTeachingClass',
      ]),
      ...mapGetters('class', [
        'numberOfStudentInClass',
      ]),
      url() {
        const vm = this;
        return baseUrl + vm.filePath;
      },
    },
    async created() {
      const vm = this;
      // TODO: 부모 component에서 받아 오는 형식으로 수정
      await vm.getClassTotalResult({
        classId: vm.classId,
      });
      vm.getQuestionResult({
        itemId: vm.itemId,
      });
      vm.studentQuestionResult = vm.questionResult;
      const questionId = vm.studentQuestionResult.questionId;
      const res = await questionService.getQuestionResult({
        questionId,
      });
      const numAnswer = res.data.num_students_answer;
      const numPartialAnswer = res.data.num_students_partial_answer;
      const numTotal = res.data.num_students_total;
      vm.questionResultSummary[0].numAnswer = numAnswer;
      vm.questionResultSummary[0].numPartialAnswer = numPartialAnswer;
      vm.questionResultSummary[0].numWrongAnswer = numTotal - numAnswer - numPartialAnswer;
    },
    mounted() {
    },
    methods: {
      ...mapActions('grading', [
        'getClassTotalResult',
        'getQuestionResult',
      ]),
      ...mapActions('NNclass', [
        'putScore',
      ]),
      async refresh() {
        const vm = this;
        await vm.getClassTotalResult({
          classId: vm.classId,
          isStudent: false,
        });
        vm.getQuestionResult({
          itemId: vm.itemId,
        });
        vm.studentQuestionResult = vm.questionResult;
        const questionId = vm.studentQuestionResult.questionId;
        const res = await questionService.getQuestionResult({
          questionId,
        });
        const numAnswer = res.data.num_students_answer;
        const numPartialAnswer = res.data.num_students_partial_answer;
        const numTotal = res.data.num_students_total;
        vm.questionResultSummary[0].numAnswer = numAnswer;
        vm.questionResultSummary[0].numPartialAnswer = numPartialAnswer;
        vm.questionResultSummary[0].numWrongAnswer = numTotal - numAnswer - numPartialAnswer;
      },
      changeHead() {
        return { backgroundColor: '#EAEAEA' };
      },
      async scoreSubmit(score, id) { // eslint-disable-line
        const vm = this;
        if (score < 0 || score > vm.studentQuestionResult.score) {
          vm.$notify({
            title: '점수 범위를 확인하세요',
            message: '',
            type: 'error',
            duration: 2000,
          });
        }
      },
      handleVisible(file) {
        const vm = this;
        vm.fileName = file.name;
        vm.fileType = file.file_type;
        vm.filePath = file.client_path;
        if (['.mp4', '.jpg', '.png', '.gif'].includes(vm.fileType)) {
          vm.fileVisible = true;
        } else {
          utils.downloadFile(vm.url, vm.fileName);
        }
      },
      handleClose() {
        const vm = this;
        vm.fileVisible = false;
        if (vm.fileType === '.mp4') {
          vm.player = vm.$refs.player.player;
          vm.player.stop();
        }
      },
    },
  };
</script>
