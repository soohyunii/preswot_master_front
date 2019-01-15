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
     <el-tabs>
      <el-tab-pane label="사용된 아이템 목록">
        <template v-if="selectedIndex !== ''">
          <template v-if="selectedData.note !== undefined">
            <h3>자료</h3>
            <el-table
              :data="selectedData.note">
              <el-table-column
                prop="name"
                width="200px"
                label="이름">
              </el-table-column>
            </el-table>
          </template>
          <template v-if="selectedData.question !== undefined">
            <h3>문항</h3>
            <el-table
              :data="selectedData.question">
              <el-table-column
                prop="name"
                label="이름"
                width="200px">
              </el-table-column>
              <el-table-column
                prop="content"
                label="내용">
              </el-table-column>
            </el-table>
          </template>
          <template v-if="selectedData.survey !== undefined">
            <h3>설문</h3>
            <el-table
              :data="selectedData.survey">
              <el-table-column
                prop="name"
                label="이름"
                width="200px">
              </el-table-column>
              <el-table-column
                prop="content"
                label="내용">
              </el-table-column>
            </el-table>
          </template>
        </template>
      </el-tab-pane>
      <el-tab-pane label="학생별 키워드 이해도">
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
      </el-tab-pane>
    </el-tabs>
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
    console.log('res.data.result = ', res.data.result);
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
