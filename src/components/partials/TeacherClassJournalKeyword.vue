<template>
  <div>
    <el-select v-model="selectedIndex" placeholder="키워드를 선택하세요." @change="selectKeyword()">
      <el-option
        v-for="(item, index) in allData"
        :key="index"
        :label="item.keyword"
        :value="index">
      </el-option>
    </el-select>
    <template v-if="selectedIndex !== ''">
      <h1>키워드가 사용된 아이템 목록</h1>
      <h3 v-if="selectedData.note !== undefined">자료</h3>
      <p v-for="item in selectedData.note" :key="item.lecture_item_id"> - {{ item.name }}</p>
      <h3 v-if="selectedData.question !== undefined">문항</h3>
      <p v-for="item in selectedData.question" :key="item.lecture_item_id"> - {{ item.name }}</p>
      <h3 v-if="selectedData.survey !== undefined">설문</h3>
      <p v-for="item in selectedData.survey" :key="item.lecture_item_id"> - {{ item.name }}</p>
      <el-table
        :data="selectedData.students">
        <el-table-column
          prop="name"
          label="학생 이름"
          width="180">
        </el-table-column>
        <el-table-column
          label="키워드 이해도">
          <template slot-scope="scope">
            {{ (scope.row.res * 100).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import analysisService from '../../services/analysisService';

export default {
  name: 'TeacherClassJournalKeyword',
  props: ['lectureId'],
  async beforeMount() {
    const vm = this;
    const res = await analysisService.getKeywordItems({ lectureId: vm.lectureId });
    vm.allData = res.data.result;
  },
  data() {
    return {
      selectedIndex: '',
      selectedData: {},
      allData: {},
    };
  },
  methods: {
    selectKeyword() {
      const vm = this;
      vm.selectedData = vm.allData[vm.selectedIndex];
    },
  },
};
</script>

<style>

</style>
