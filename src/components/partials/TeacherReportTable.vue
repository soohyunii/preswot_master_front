<template>
  <div class="grid-content bg-white">
    <!-- TODO: translate -->
    <h2>집중도</h2>
    <hr />
    <el-table
      :data="tableData"
      border style="width: 100%">
      <el-table-column prop="index" label="강의" sortable width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="concen-pre" label="예습 평균" align="center">
      </el-table-column>
      <el-table-column prop="concen-rea" label="본강 평균" align="center">
      </el-table-column>
      <el-table-column prop="concen-rev" label="복습 평균" align="center">
      </el-table-column>
    </el-table>
    <br />
    <h2>이해도</h2>
    <hr />
    <el-table
      :data="tableData"
      border style="width: 100%">
      <el-table-column prop="index" label="강의" sortable width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="unders-pre" label="예습 평균" align="center">
      </el-table-column>
      <el-table-column prop="unders-rea" label="본강 평균" align="center">
      </el-table-column>
      <el-table-column prop="unders-rev" label="복습 평균" align="center">
      </el-table-column>
    </el-table>
    <br />
    <h2>참여도</h2>
    <hr />
    <el-table
      :data="tableData"
      border style="width: 100%">
      <el-table-column prop="index" label="강의" sortable width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="parti-pre" label="예습 평균" align="center">
      </el-table-column>
      <el-table-column prop="parti-rea" label="본강 평균" align="center">
      </el-table-column>
      <el-table-column prop="parti-rev" label="복습 평균" align="center">
      </el-table-column>
    </el-table>
    <br />
  </div>
</template>

<script>

export default {
  name: 'ReportTable',
  props: ['resultData', 'attendeeList'],
  computed: {
    tableData() {
      const vm = this;
      const tempArr = [];
      for (let i = 0; i < vm.resultData.length; i += 1) {
        tempArr.push({
          index: i,
          'concen-pre': vm.resultData[i].concen_pre_avg.toFixed(1),
          'concen-rea': vm.resultData[i].concen_rea_avg.toFixed(1),
          'concen-rev': vm.resultData[i].concen_rev_avg.toFixed(1),
          'unders-pre': vm.resultData[i].unders_pre_avg.toFixed(1),
          'unders-rea': vm.resultData[i].unders_rea_avg.toFixed(1),
          'unders-rev': vm.resultData[i].unders_rev_avg.toFixed(1),
          'parti-pre': vm.resultData[i].parti_pre_avg.toFixed(1),
          'parti-rea': vm.resultData[i].parti_rea_avg.toFixed(1),
          'parti-rev': vm.resultData[i].parti_rev_avg.toFixed(1),
        });
      }
      return tempArr;
    },
  },
  methods: {
  },
};
</script>

<style scoped>
  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>