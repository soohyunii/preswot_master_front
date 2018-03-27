<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="120px">
          <el-form-item label="파일 목록">
            <el-button
              type="primary"
              v-for="(item, index) in fileList"
              :key="item.guid"
              @click="onClick('FILE', index)"
            >
              {{ item.name }} <i class="el-icon-download el-icon-right"></i>
            </el-button>
          </el-form-item>

          <el-form-item label="문항">
            ({{ qTypeStr }}) {{ qQuestion }}
          </el-form-item>

          <template v-if="!isSubmitted">
            <template v-if="[0].includes(qType)">
              <el-form-item label="보기">
                <el-checkbox-group v-model.lazy="qAnswerChoice">
                  <template v-for="(choice, key) in qChoice">
                    <el-checkbox :label="(key+1).toString()" >{{ choice }}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
            </template>

            <template v-if="[1, 2, 4].includes(qType)">
              <el-form-item label="답">
                <el-input
                  :type="qType === 1 ? 'input' : 'textarea'"
                  :rows="3"
                  v-model.lazy="qAnswer"
                />
              </el-form-item>
            </template>

            <!-- SW -->
            <template v-if="[3].includes(qType)">
              <br />
              <br />

              <el-form-item label="정보">
                시간 제한: {{ qTimeLimit }} 초<br />
                메모리 제한: {{ qMemoryLimit }} MB<br />
                사용 가능한 언어: {{ qLanguageList.join(', ') }}
              </el-form-item>
              <el-form-item label="입력 예제">
                {{ qInputDescription }}
                <pre style="background-color: white; padding: 5px 20px;">{{ qSampleInput }}</pre>
              </el-form-item>
              <el-form-item label="출력 예제">
                {{ qOutputDescription }}
                <pre style="background-color: white; padding: 5px 20px;">{{ qSampleOutput }}</pre>
              </el-form-item>

              <el-form-item label="언어 선택">
                <el-radio-group v-model.lazy="qAnswerLanguage">
                  <template v-for="(lang) in qLanguageList">
                    <el-radio :label="lang" ></el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="코드">
                <el-input
                  type="textarea"
                  :rows="20"
                  v-model.lazy="qAnswer"
                />
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" @click="onClick('SUBMIT')">
                문항 제출
              </el-button>
            </el-form-item>
          </template>

          <div v-show="isSubmitted">
            <template v-if="[0].includes(qType)">
              <el-form-item label="보기">
                <el-checkbox-group>
                  <template v-for="(choice, key) in qChoice">
                    <el-checkbox :label="(key+1).toString()" disabled>{{choice}}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
            </template>

            <!--FIXME:  -->
            <el-form-item v-show="[].includes(qType)" label="분포">
              <bar-chart :xAxisName="chartXAxis" :data="chartData"/>
            </el-form-item>
            <br />

            <h4 style="padding-left: 120px;">제출 기록</h4>

            <!--FIXME: 제출기록-->
            <el-table
              :data="qSubmitted"
              border>
              <el-table-column label="시간" align="center" sortable>
                <template slot-scope="scope">
                  <p>{{new Date(scope.row.created_at).toLocaleString()}}</p>
                </template>
              </el-table-column>
              <el-table-column label="제출 답" align="center" sortable>
                <template slot-scope="scope">
                  <p>{{scope.row.answer.join(', ')}}</p>
                </template>
              </el-table-column>
            </el-table>

            <el-button
              type=""
              @click="onClick('RE', 0)">
              다시 풀기
            </el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>


  </div>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import BarChart from './BarChart';
import utils from '../../utils';

export default {
  name: 'ScQuestionViewer',
  components: {
    BarChart,
  },
  data() {
    return {
      qAnswer: '',
      qAnswerChoice: [],
      qAnswerLanguage: '',
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    ...mapState('sc', ['scStartDate']),
    chartXAxis() {
      const axis = ['x'];
      const vm = this;
      if (vm.qChoice) {
        vm.qChoice.forEach((element) => {
          axis.push(element);
        });
        return axis;
      }
      return [];
    },
    isSubmitted: {
      get() {
        const vm = this;
        return vm.currentEditingScItem.isSubmitted;
      },
      set(isSubmitted) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            isSubmitted,
          },
        });
      },
    },
    chartData() {
      const data = ['답 제출 분포'];
      const vm = this;
      if (vm.qChoice) {
        vm.qChoice.forEach(() => {
          // TODO: 결과 값 수정
          data.push(Math.floor(Math.random() * 100) + 1);
        });
        return data;
      }
      return [];
    },
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      vm.init();
      return item.fileList;
    },
    qType() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.type : 0;
    },
    qTypeStr() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      const type = q ? q.type : 0;
      return utils.convertQuestionType(type);
    },
    qQuestion() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.question : '';
    },
    qChoice() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.choice : [];
    },
    qInputDescription() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.inputDescription : null;
    },
    qOutputDescription() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.outputDescription : null;
    },
    qSampleInput() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.sampleInput : null;
    },
    qSampleOutput() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.sampleOutput : null;
    },
    qMemoryLimit() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.memoryLimit : null;
    },
    qTimeLimit() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.timeLimit : null;
    },
    qLanguageList() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.languageList : [];
    },
    qSubmitted() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? vm.currentEditingScItem.submitted : [];
    },
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem', 'updateCurrentEditingScItemIndex']),
    ...mapActions('scItem', ['submitQuestion']),
    async onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'FILE': {
          const file = vm.fileList[index];
          utils.downloadFile(file.url, file.name);
          break;
        }
        case 'SUBMIT': {
          // console.log('onclick submit'); //eslint-disable-line
          vm.isSubmitted = true;
          const params = {
            lecture_item_id: vm.currentEditingScItem.id,
            user_id: utils.getUserIdFromJwt(),
          };
          const answers = vm.qType === 0 ? vm.qAnswerChoice : [vm.qAnswer];

          /* Same with scStore updateOffsetSecNowDate algorithm. */
          const startScItem = vm.currentEditingScItem.activeStartOffsetSec;
          const startTime = vm.scStartDate.getTime() + startScItem;

          const now = new Date().getTime();
          const interval = Math.floor((now - startTime) / 1000);
          /* *************************************************** */


          // const interval
          vm.$socket.emit('DOING_LECTURE_ITEM', JSON.stringify(params));
          await vm.submitQuestion({
            id: vm.currentEditingScItem.question.id,
            answers,
            interval,
            codeLanguage: vm.qAnswerLanguage,
          });
          vm.updateCurrentEditingScItemIndex({ });
          break;
        }
        case 'RE': {
          vm.isSubmitted = false;
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    init() {
      const vm = this;
      vm.qAnswer = '';
      vm.qAnswerChoice = [];
      vm.qAnswerLanguage = '';
    },
  },
};

</script>
