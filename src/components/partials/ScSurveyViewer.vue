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
          <el-form-item v-show="[].includes(sType)" label="분포">
            <!-- TODO: 차트 데이터 수정 -->
            <bar-chart :xAxisName="chartXAxis" :data="chartData"/>
          </el-form-item>

          <h4 style="padding-left: 120px;">제출 기록</h4>

          <el-table
            :data="sSubmitted"
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
            다시 제출
          </el-button>
        </div>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
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
    sSubmitted() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      return s ? vm.currentEditingScItem.submitted : [];
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
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem', 'updateCurrentEditingScItemIndex']),
    ...mapActions('scItem', [
      'submitSurvey',
    ]),
    async onClick(type, index) {
      const vm = this;
      switch (type) {
        case 'FILE': {
          const file = vm.fileList[index];
          utils.downloadFile(file.url, file.name);
          break;
        }
        case 'SUBMIT': {
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
  },
};
</script>
