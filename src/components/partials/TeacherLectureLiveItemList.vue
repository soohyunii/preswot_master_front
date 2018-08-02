<template>
  <div>
    <!-- {{ currentData }} -->
    <el-table :data="currentData">
      <el-table-column
        type="index"
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
          <el-button type="primary" size="small" @click="onClick('SHOW', scope.row.lecture_item_id, scope.$index)">
            보이기
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination id="lecture_item_pagination" layout="prev, pager, next" :page-size="5" :total="11" @current-change="handlePageChange" />
  </div>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'LectureItemList',
  props: ['dataList', 'onClick', 'isAuto'],
  data() {
    const vm = this;
    return {
      currentData: [],
    }
  },
  methods: {
    convertLcItemTypeKor(row) {
      return utils.convertLcItemTypeKor(row.type);
    },
    handlePageChange(page) {
      const vm = this;
      if (page === 1) {
        vm.currentData = vm.dataList.slice(0, 5);
      } else {
        vm.currentData = vm.dataList.slice(5,10);
      }
    },
  },
  async mounted() {
    const vm = this;
    await vm.$nextTick();
    vm.currentData = await vm.dataList.slice(0,5);
    console.log(vm.dataList);
    console.log(vm.currentData);
  },
};
</script>

<style lang="scss" scoped>
#lecture_item_pagination {
  text-align: center;
}
</style>
