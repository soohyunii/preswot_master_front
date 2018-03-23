<template>
  <el-row>
    <el-col style="max-width: 600px;">
      <el-form label-width="120px">
        <el-form-item label="파일 목록">
          <el-button
            type="primary"
            v-for="(item, index) in fileList"
            :key="item.guid"
            @click="onClick('FILE',index)"
          >
            {{ item.name }} <i class="el-icon-download el-icon-right"></i>
          </el-button>
        </el-form-item>

        <el-form-item label="설문 내용">
          <span class="item-text">
            ({{ sType }}) {{ sComment }}
          </span>
        </el-form-item>

        <template v-if="!isSubmitted">
          <el-form-item label="설문 입력">
            <el-checkbox-group v-if="[0].includes(sType)" v-model.lazy="sAnswerChoice">
              <template v-for="(choice, key) in sChoice">
                <el-checkbox :label="choice" :key="key"></el-checkbox>
              </template>
            </el-checkbox-group>
            <el-input  v-if="[1].includes(sType)" v-model.lazy="sAnswer">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onClick('SUBMIT')">
              설문 제출
            </el-button>
          </el-form-item>
        </template>

        <div v-show="isSubmitted">
          <el-form-item v-show="[0].includes(sType)" label="분포">
            <!-- TODO: 차트 데이터 수정 -->
            <bar-chart :xAxisName="chartXAxis" :data="chartData"/>
          </el-form-item>
          제출되었습니다.
        </div>

      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters, mapActions } from 'vuex';
import utils from '../../utils';
import BarChart from './BarChart';

export default {
  name: 'ScSurveyViewer',
  components: {
    BarChart,
  },
  data() {
    return {
      sAnswer: '',
      sAnswerChoice: [],
      isSubmitted: false,
    };
  },
  computed: {
    chartXAxis() {
      const axis = ['x'];
      const vm = this;
      if (vm.sChoice) {
        vm.sChoice.forEach((element) => {
          axis.push(element);
        });
        return axis;
      }
      return null;
    },
    chartData() {
      const data = ['설문조사 결과'];
      const vm = this;
      if (vm.sChoice) {
        vm.sChoice.forEach(() => {
          // TODO: 설문 결과 값 수정
          data.push(Math.floor(Math.random() * 100) + 1);
        });
        return data;
      }
      return null;
    },
    ...mapGetters('scItem', ['currentEditingScItem']),
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      return item.fileList;
    },
    sType() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      return s ? s.type : 0;
    },
    sComment() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      return s ? s.comment : '';
    },
    sChoice() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      return s.choice ? s.choice : [];
    },
  },
  methods: {
    ...mapActions('scItem', [
      'submitSurvey',
    ]),
    async onClick(type, index) {
      switch (type) {
        case 'FILE': {
          const vm = this;
          const file = vm.fileList[index];
          utils.downloadFile(file.url, file.name);
          break;
        }
        case 'SUBMIT': {
          const vm = this;
          vm.isSubmitted = true;
          const params = {
            lecture_item_id: vm.currentEditingScItem.id,
            user_id: utils.getUserIdFromJwt(),
          };
          let answer;
          if (vm.sType === 1) {
            answer = [vm.sAnswer];
          } else {
            answer = vm.sAnswerChoice;
          }
          // console.log(answer);
          vm.$socket.emit('DOING_LECTURE_ITEM', JSON.stringify(params));
          await vm.submitSurvey({
            id: vm.currentEditingScItem.survey.id,
            answer,
          });
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
