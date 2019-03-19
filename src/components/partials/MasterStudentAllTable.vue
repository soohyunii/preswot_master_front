<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column prop="name" label="학생이름" width="233px">
      </el-table-column>
      <el-table-column prop="dept" label="학과" width="233px">
      </el-table-column>
      <el-table-column prop="understanding" label="이해도" width="233px">
      </el-table-column>
      <el-table-column prop="concentrating" label="집중도" width="233px">
      </el-table-column>
      <el-table-column prop="participating" label="참여도" width="233px">
      </el-table-column>
      </el-table>
      <br>
    </div>
    <div id="pagination" style="display: block; text-align: center;">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="listCount"
        :current-page.sync="pageNum"
        >
        </el-pagination>
      </div>
      <br>
  </div>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'MasterStudentAllTable',
  props: ['list', 'onClick'],
  data() {
    return {
      pageNum: 1,
    };
  },
  computed: {
    listCount() {
      return this.list.length;
    },
    page() {
      const vm = this;
      return vm.list.slice((vm.pageNum - 1) * 10, vm.pageNum * 10);
    },
  },
  methods: {
    formatDate: utils.formatDate,
  },
};
</script>


<style lang="scss" scoped>
#class_index_wrapper {
  .elTable-label {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    text-align: center;
  }
  .elTable-label tr {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    text-align: center;
  }
  .elTable-label td {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #606266;
    text-align: center;
  }
}
</style>
