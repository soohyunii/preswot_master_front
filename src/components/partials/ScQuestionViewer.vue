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
              @click="onClick(index)"
            >
              {{ item.name }} <i class="el-icon-download el-icon-right"></i>
            </el-button>
          </el-form-item>

          <el-form-item label="문항">
            ({{ qType }}) {{ qQuestion }}
          </el-form-item>

          <template v-if="[0].includes(qType)">
            <el-form-item label="보기">
              TODO: 보기 v-for<br />
              {{ qChoice }}
            </el-form-item>
          </template>

          <template v-if="[0, 1, 2].includes(qType)">
            <el-form-item label="답">
              <el-input
                :type="qType === 1 ? 'input' : 'textarea'"
                :rows="3"
                v-model.lazy="qAnswer"
              />
            </el-form-item>
          </template>

          <!-- 코딩 -->
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

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ScQuestionViewer',
  data() {
    return {
      qAnswer: '',
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      return item.fileList;
    },
    qType() {
      const vm = this;
      const q = vm.currentEditingScItem.question;
      return q ? q.type : 0;
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
  },
  methods: {
    onClick(type) {
      switch (type) {
        case 'SUBMIT': {
          console.log('onclick submit');
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
