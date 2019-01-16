<template>
  <div>
    <el-select v-model="selectedUserId" placeholder="학생을 선택하세요." @change="selectKeyword()">
      <el-option
        v-for="(item, index) in allData"
        :key="index"
        :label="item.email_id"
        :value="item.user_id">
      </el-option>
    </el-select>
    <template v-if="selectedIndex !== ''">
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
  name: 'TeacherClassJournalStudent',
  props: ['classId'],
  async beforeMount() {
    const vm = this;
    const res = await analysisService.getLectureStudents({ classId: vm.classId });
    console.log('@journal/studnet res.data = ', res.data);
    vm.allData = res.data;
  },
  data() {
    return {
      selectedUserId: '',
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
