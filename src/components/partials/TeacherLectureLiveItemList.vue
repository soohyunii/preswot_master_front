<template>
  <div>
    <el-table :data="currentData">
      <el-table-column
        prop="sequence"
        label="No."
        width="100"
        sortable >
      </el-table-column>
      <el-table-column
        prop="type"
        label="Type."
        width="130"
        :formatter="convertLcItemTypeKor"
        sortable >
      </el-table-column>
      <el-table-column
        prop="name"
        label="강의도구 이름."
        sortable >
      </el-table-column>
      <el-table-column
        label=""
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="onClick('SHOW', scope.row.lecture_item_id, scope.row.sequence - 1)">
            보이기
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination id="lecture_item_pagination" layout="prev, pager, next" :page-size="numPageElement" :total="numData" @current-change="handlePageChange" />
  </div>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'LectureItemList',
  props: ['dataList', 'onClick', 'isAuto'],
  data() {
    return {
      currentData: [],
      numData: 0,
      numPageElement: 5,
    };
  },
  methods: {
    convertLcItemTypeKor(row) {
      return utils.convertLcItemTypeKor(row.type);
    },
    handlePageChange(page) {
      const vm = this;
      vm.currentData = vm.dataList.slice(vm.numPageElement * (page - 1), vm.numPageElement * page);
    },
  },
  async mounted() {
    const vm = this;
    vm.currentData = await vm.dataList.slice(0, vm.numPageElement);
    vm.numData = vm.dataList.length;
  },
};
</script>

<style lang="scss" scoped>
#lecture_item_pagination {
  text-align: center;
}
</style>
