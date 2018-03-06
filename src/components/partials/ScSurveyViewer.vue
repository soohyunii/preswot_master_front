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
          <el-checkbox-group v-if="sChoice.length > 0" v-model="answerChoice">
            <template v-for="(choice, key) in sChoice">
              <el-checkbox :label="choice" :key="key"></el-checkbox>
            </template>
          </el-checkbox-group>
          <el-input v-else v-model="answerString">
          </el-input>
          <br/>
          <span class="item-text">
            {{ answerChoice }}<br />
            {{ answerString }}
          </span>
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

export default {
  name: 'ScSurveyViewer',
  data() {
    return {
      // TODO: 학생 답안 저장위치 바꾸기
      answerChoice: [],
      answerString: '',
    };
  },
  computed: {
    ...mapGetters('scItem', ['currentEditingScItem']),
    fileList() {
      const vm = this;
      const item = vm.currentEditingScItem;
      return item.fileList;
    },
    sType() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      const numType = s ? s.type : 0;
      return utils.convertScItemType(numType);
    },
    sComment() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      return s ? s.comment : '';
    },
    sChoice() {
      const vm = this;
      const s = vm.currentEditingScItem.survey;
      if (!s.choice) {
        return [];
      }
      return s.choice;
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

