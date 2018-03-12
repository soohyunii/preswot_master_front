<template>
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

        <el-form-item label="설문 내용">
          <span class="item-text">
            ({{ sType }}) {{ sComment }}
          </span>
        </el-form-item>

        <el-form-item label="설문 입력">
          <el-checkbox-group v-if="[0].includes(sType)" v-model.lazy="sAnswerChoice">
            <template v-for="(choice, key) in sChoice">
              <el-checkbox :label="choice" :key="key"></el-checkbox>
            </template>
          </el-checkbox-group>
          <el-input  v-if="[1].includes(sType)" v-model.lazy="sAnswer">
          </el-input>
        </el-form-item>

        <el-form-item label="분포">
          <!-- TODO: 차트 데이터 수정 -->
          <bar-chart v-show="[0].includes(sType)" :xAxisName="chartXAxis" :data="chartData"/>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
@import "~@/common.scss";
</style>

<script>
import { mapGetters } from 'vuex';
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
  },
  methods: {
    onClick(index) {
      const vm = this;
      const file = vm.fileList[index];
      utils.downloadFile(file.url, file.name);
    },
  },
};
</script>

