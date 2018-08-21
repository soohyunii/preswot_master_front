<template>
  <div class="lecture-live-item-wrapper" style="background: #e5e9f2">
    <!-- {{ data }} -->
    <div v-if="data === undefined"> <!-- 입력값 없음 -->
      강사님의 신호를 기다리는 중입니다.
    </div>
    <div v-else class="lecture-item">
      <div v-if="data.type === 0" class="question-box"> <!-- 질문 -->
        <div v-if="data.questions[0].type === 0">
          <template v-if="data.questions[0].student_answer_logs.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>보기 : </span>
                <span v-for="(choice, index) in data.questions[0].choice" class="item" :key="index">
                  <span>({{ index + 1 }}) {{ data.questions[0].choice[index] }}</span>
                </span>
              </p>
              <p>
                <span>정답 : </span>
                <span v-for="(answer, index) in data.questions[0].answer" class="item" :key="index">
                  <span>({{ answer }})</span>
                </span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>문항 - 객관</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-checkbox-group v-model="answer" style="width: 100%;">
              <div v-for="(choice,index) in data.questions[0].choice" :key="index" class="radio-one">
                <el-checkbox :label="(index + 1).toString()">{{ index + 1 }} . {{ choice }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </template>
        </div>
        <div v-if="data.questions[0].type === 1">
          <template v-if="data.questions[0].student_answer_logs.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>정답 : </span>
                <span v-for="(answer, index) in data.questions[0].answer" class="item" :key="index">
                  <span>{{ answer }}</span>
                </span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>문항 - 단답</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-input placeholder="내용을 입력해주세요." v-model="answer[0]"></el-input>
          </template>
        </div>
        <div v-if="data.questions[0].type === 2">
          <template v-if="data.questions[0].student_answer_logs.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>예시 파일</span>
              </p>
              <div style="margin: 10px 0px 10px 20px;">
                <a :href="`http://13.125.249.159:8020` + data.questions[0].files[0].client_path" target="_blank">{{ data.questions[0].files[0].name }}</a>
              </div>
              <p>
                <span>모범 답안 : </span>
                <span v-for="(answer, index) in data.questions[0].answer" class="item" :key="index">
                  <span>{{ answer }} . {{ data.questions[0].choice[answer - 1] }}</span>
                </span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>문항 - 서술</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-input class="margin-text" placeholder="내용을 입력해주세요." v-model="answer[0]" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
            <!-- TODO: 개수제한 해제 -->
            <el-upload
              action="#"
              :auto-upload="false"
              :file-list="[]"
              :limit=1
              :on-exceed="handleExceed"
              ref="answerUpload">
              <el-button slot="trigger" type="primary">파일 추가</el-button>
            </el-upload>
          </template>
        </div>
        <div v-if="data.questions[0].type === 3">
          <template v-if="data.questions[0].student_answer_logs.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>문항 - SW</p>
            <pre>{{ data.questions[0].question }}</pre>
            <pre>언어 : {{ data.questions[0].accept_language[0] }}</pre>
            <pre>입력 설명 : {{ data.questions[0].input_description }}</pre>
            <pre>출력 설명 : {{ data.questions[0].output_description }}</pre>
            <pre>샘플 입력 : {{ data.questions[0].sample_input }}</pre>
            <pre>샘플 출력 : {{ data.questions[0].sample_output }}</pre>
            <div v-for="testcase in data.questions[0].problem_testcases" :key="testcase.num">
              <pre>테스트 케이스 {{ testcase.num }} 입력 :  {{ testcase.input }} </pre>
              <pre>테스트 케이스 {{ testcase.num }} 출력 :  {{ testcase.output }} </pre>
            </div>
            <pre>메모리 제한(MB) : {{ data.questions[0].memory_limit }}</pre>
            <pre>시간 제한(초) : {{ data.questions[0].time_limit }}</pre>
            <el-input class="margin-text" placeholder="내용을 입력해주세요." v-model="answer[0]" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
          </template>
        </div>
        <div v-if="data.questions[0].type === 4">
          <template v-if="data.questions[0].student_answer_logs.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>정답 : </span>
                <span v-for="(answer, index) in data.questions[0].answer" class="item" :key="index">
                  <span>{{ answer }}</span>
                </span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>문항 - SQL</p>
            <pre>{{ data.questions[0].question }}</pre>
            <el-input placeholder="내용을 입력해주세요." v-model="answer[0]" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }"></el-input>
          </template>
        </div>
        <el-button
          v-if="data.questions[0].student_answer_logs.length === 0 && type === 'STUDENT'"
          style="float:right"
          type="primary"
          @click="preOnClick('SUBMIT', [data.type, data.questions[0].question_id, [answer], data.questions[0].accept_language[0]])">
          제출
        </el-button>
      </div>
      <div v-if="data.type === 1">
        <div v-if="data.surveys[0].type === 0">
          <template v-if="data.surveys[0].student_surveys.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
            <br />
            <el-card v-if="data.result === 1">
              <p>
                <span>문제 : {{ data.questions[0].question }}</span>
              </p>
              <p>
                <span>배점 : {{ data.questions[0].score }}</span>
              </p>
              <p>
                <span>정답 : </span>
                <span v-for="(answer, index) in data.questions[0].answer" class="item" :key="index">
                  <span>{{ answer }}</span>
                </span>
              </p>
              <p>
                <span>점수 : {{ data.questions[0].student_answer_logs[studentAnswerLogIndex].score }}</span>
              </p>
            </el-card>
          </template>
          <template v-else>
            <p>설문 - 객관</p>
            <pre>{{ data.surveys[0].comment }}</pre>
            <el-radio-group v-model="answer[0]" style="width: 100%;">
              <div v-for="(choice,index) in data.surveys[0].choice" :key="index">
                <el-radio :label="index">{{ index }} . {{ choice }}</el-radio>
              </div>
            </el-radio-group>
          </template>
        </div>
        <div v-if="data.surveys[0].type === 1">
          <template v-if="data.surveys[0].student_surveys.length > 0 && type === 'STUDENT'"> <!-- 이미 제출한 경우 -->
            <p>제출이 완료되었습니다.</p>
          </template>
          <template v-else>
            <p>설문 - 주관</p>
            <pre>{{ data.surveys[0].comment }}</pre>
            <el-input placeholder="내용을 입력해주세요." v-model="answer[0]"></el-input>
          </template>
        </div>
        <el-button
          v-if="data.surveys[0].student_surveys.length === 0 && type === 'STUDENT'"
          style="float:right"
          type="primary"
          @click="preOnClick('SUBMIT', [data.type, data.surveys[0].survey_id, data.surveys[0].type, answer])">
          제출
        </el-button>
      </div>
      <div v-if="data.type === 2" class="practice">
        <p>실습</p>
        <h3 style="margin:20px;">강사의 지시에 따라주세요.</h3>
        <pre>{{ data.lecture_code_practices[0].code }}</pre>
      </div>
      <div v-if="data.type === 3" class="discuss">
        <p>토론</p>
        <discussion :lectureItemId="data.lecture_item_id"/>
      </div>
      <!-- TODO: 자료 -->
      <div v-if="data.type === 4" class="note">
        <p>자료</p>
        <br>
        <div v-if="data.notes[0].note_type === 0">
          <img :src="Url">
        </div>
        <div v-if="data.notes[0].note_type === 1">
          <iframe width="500" height="470" frameborder="0" :src="Url"></iframe>
        </div>
        <div v-if="data.notes[0].note_type === 2">
          <a :href="Url" target="_blank">{{data.notes[0].url}}</a>
        </div>
        <div v-if="data.notes[0].note_type === 3">
          <iframe width="500" height="315" frameborder="0" :src="Url"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed';
import Discussion from './NNDiscussion';
import { EventBus } from '../../event-bus';
import { baseUrl } from '../../services/config';
import utils from '../../utils';

export default {
  props: ['data', 'onClick', 'type'],
  data() {
    return {
      answer: [],
      answerFile: [],
    };
  },
  mounted() {
    const vm = this;
    EventBus.$on('clearAnswer', vm.clearAnswer);
  },
  computed: {
    Url() {
      const vm = this;
      if (vm.data.type === 4) {
        if (vm.data.notes[0].note_type === 0) {
          const url = baseUrl + vm.data.notes[0].files[0].client_path;
          return url;
        }
        if (vm.data.notes[0].note_type === 1) {
          const url = baseUrl + vm.data.notes[0].files[0].client_path;
          // return `https://view.officeapps.live.com/op/embed.aspx?src=${url}`;
          return `http://docs.google.com/gview?url=${url}&embedded=true`;
        }
        if (vm.data.notes[0].note_type === 2) {
          return vm.data.notes[0].url;
        }
        if (vm.data.notes[0].note_type === 3) {
          const id = getIdFromURL(vm.data.notes[0].url);
          const interval = vm.data.notes[0].youtube_interval.split('<?>');
          return `https://www.youtube.com/embed/${id}?start=${interval[0]}&end=${interval[1]}`;
        }
      }
      return '';
    },
    studentAnswerLogIndex() {
      const vm = this;
      const userId = utils.getUserIdFromJwt();
      return vm.data.questions[0].student_answer_logs.findIndex(item => item.student_id === userId);
    },
  },
  methods: {
    preOnClick(...args) {
      const vm = this;
      vm.onClick(...args);
      vm.clearAnswer();
    },
    onChange(data) { // 문항 - 객관값 보정 (0 1 2 3 4를 1 2 3 4 5로) 을 위한 함수
      const vm = this;
      vm.answer = data + 1;
    },
    clearAnswer() {
      const vm = this;
      vm.answer = [];
    },
    handleExceed() {
      this.$message.warning(
        '파일 1개만 업로드 할 수 있습니다.',
      );
    },
  },
  components: {
    Discussion,
  },
};
</script>

<style lang="scss">
.lecture-live-item-wrapper {
  pre {
    overflow-x: auto; /* Use horizontal scroller if needed; for Firefox 2, not needed in Firefox 3 */
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    /* width: 99%; */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }

  .radio-one {
    /*border:1px solid red;*/
    margin:15px;
  }

  .lecture-item {
    /*border:1px solid green;*/
    margin:30px 0;
  }

  .lecture-item .question-box{
    padding:5px 0 0 0;
  }

  .lecture-item p{  /*sh : 이 경우 <p>제출이 완료되었습니다.</p>도 스타일이 적용되기 때문에 후에 분리시키는 조치가 필요함*/
    margin: 10px 0 0 10px;
    font-size: 1.1em;
  }


  .lecture-item pre{
    /*border:1px solid red;*/
    margin: 20px 0 0 15px;
  }


  /*.lecture-item span{
    <span>답 : </span> 을 아예 없애는건?
  }
  */

  .lecture-item .el-button{
    margin:10px 0;
  }

  .lecture-item .el-input{
    margin:20px 0 0 0;
  }

  .lecture-item .margin-text{ /*문항 - 서술,SW*/
    margin:20px 0 0 0;
  }

  .lecture-item .practice{
    padding:5px 0 20px 0;
  }

  .lecture-item .discuss{
    padding:5px 0 0 0;
    height:530px;
  }

  .item + .item:before {
    content: ", ";
  }
  .lecture-item .note{
    padding:10px;
    margin:10px;
    height:530px;
  }
}
</style>
