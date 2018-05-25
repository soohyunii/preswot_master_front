<template>
  <div class="grid-content bg-white">
    <!-- TODO: translate -->
    <h2>종합</h2>
    <hr />
    <el-table
      :data="tableData"
      border style="width: 100%">
      <el-table-column prop="index" label="강의" sortable width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="concen" label="집중도" align="center">
        <el-table-column prop="concen-pre" label="예습" align="center">
          <el-table-column prop="concen-pre-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="concen-pre-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="concen-rea" label="본강" align="center">
          <el-table-column prop="concen-rea-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="concen-rea-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="concen-rev" label="복습" align="center">
          <el-table-column prop="concen-rev-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="concen-rev-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="unders" label="이해도" align="center">
        <el-table-column prop="unders-pre" label="예습" align="center">
          <el-table-column prop="unders-pre-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="unders-pre-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="unders-rea" label="본강" align="center">
          <el-table-column prop="unders-rea-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="unders-rea-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="unders-rev" label="복습" align="center">
          <el-table-column prop="unders-rev-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="unders-rev-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="parti" label="참여도" align="center">
        <el-table-column prop="parti-pre" label="예습" align="center">
          <el-table-column prop="parti-pre-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="parti-pre-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="parti-rea" label="본강" align="center">
          <el-table-column prop="parti-rea-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="parti-rea-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="parti-rev" label="복습" align="center">
          <el-table-column prop="parti-rev-score" label="점수 (평균)" sortable align="center">
          </el-table-column>
          <el-table-column prop="parti-rev-gra" label="등급" sortable align="center">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <br />
    <br />
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
      <el-table-column prop="concen-pre" label="예습" align="center">
        <el-table-column prop="concen-pre-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="concen-pre-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="concen-rea" label="본강" align="center">
        <el-table-column prop="concen-rea-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="concen-rea-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="concen-rev" label="복습" align="center">
        <el-table-column prop="concen-rev-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="concen-rev-gra" label="등급" sortable align="center">
        </el-table-column>
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
      <el-table-column prop="unders-pre" label="예습" align="center">
        <el-table-column prop="unders-pre-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="unders-pre-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="unders-rea" label="본강" align="center">
        <el-table-column prop="unders-rea-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="unders-rea-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="unders-rev" label="복습" align="center">
        <el-table-column prop="unders-rev-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="unders-rev-gra" label="등급" sortable align="center">
        </el-table-column>
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
      <el-table-column prop="parti-pre" label="예습" align="center">
        <el-table-column prop="parti-pre-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="parti-pre-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="parti-rea" label="본강" align="center">
        <el-table-column prop="parti-rea-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="parti-rea-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="parti-rev" label="복습" align="center">
        <el-table-column prop="parti-rev-score" label="점수 (평균)" sortable align="center">
        </el-table-column>
        <el-table-column prop="parti-rev-gra" label="등급" sortable align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
    <br />
  </div>
</template>

<script>

export default {
  name: 'ReportTable',
  props: ['resultData'],
  component: {
  },
  computed: {
    tableData() {
      const vm = this;
      const tempArr = [];
      for (let i = 0; i < vm.resultData.length; i += 1) {
        tempArr.push({
          index: i,
          'concen-pre-score': `${vm.resultData[i].concen_pre_score.toFixed(1)} (${vm.resultData[i].concen_pre_avg.toFixed(1)})`,
          'concen-pre-gra': `${vm.resultData[i].concen_pre_gra}`,
          'concen-rea-score': `${vm.resultData[i].concen_rea_score.toFixed(1)} (${vm.resultData[i].concen_rea_avg.toFixed(1)})`,
          'concen-rea-gra': `${vm.resultData[i].concen_rea_gra}`,
          'concen-rev-score': `${vm.resultData[i].concen_rev_score.toFixed(1)} (${vm.resultData[i].concen_rev_avg.toFixed(1)})`,
          'concen-rev-gra': `${vm.resultData[i].concen_rev_gra}`,
          'unders-pre-score': `${vm.resultData[i].unders_pre_score.toFixed(1)} (${vm.resultData[i].unders_pre_avg.toFixed(1)})`,
          'unders-pre-gra': `${vm.resultData[i].unders_pre_gra}`,
          'unders-rea-score': `${vm.resultData[i].unders_rea_score.toFixed(1)} (${vm.resultData[i].unders_rea_avg.toFixed(1)})`,
          'unders-rea-gra': `${vm.resultData[i].unders_rea_gra}`,
          'unders-rev-score': `${vm.resultData[i].unders_rev_score.toFixed(1)} (${vm.resultData[i].unders_rev_avg.toFixed(1)})`,
          'unders-rev-gra': `${vm.resultData[i].unders_rev_gra}`,
          'parti-pre-score': `${vm.resultData[i].parti_pre_score.toFixed(1)} (${vm.resultData[i].parti_pre_avg.toFixed(1)})`,
          'parti-pre-gra': `${vm.resultData[i].parti_pre_gra}`,
          'parti-rea-score': `${vm.resultData[i].parti_rea_score.toFixed(1)} (${vm.resultData[i].parti_rea_avg.toFixed(1)})`,
          'parti-rea-gra': `${vm.resultData[i].parti_rea_gra}`,
          'parti-rev-score': `${vm.resultData[i].parti_rev_score.toFixed(1)} (${vm.resultData[i].parti_rev_avg.toFixed(1)})`,
          'parti-rev-gra': `${vm.resultData[i].parti_rev_gra}`,
        });
      }
      return tempArr;
    },
  },
  data() {
    const muserId = 35;
    const mclassId = 2;
    return {
      muserId,
      mclassId,
    };
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