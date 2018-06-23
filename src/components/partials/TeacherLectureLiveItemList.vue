<template>
  <el-table :data="dataList">
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
        <el-button type="primary" size="small" @click="onClick('SHOW', scope.row.lecture_item_id)">
          보이기
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'LectureItemList',
  props: ['dataList', 'onClick', 'isAuto'],
  methods: {
    convertLcItemTypeKor(row) {
      return utils.convertLcItemTypeKor(row.type);
    },
  },
};
</script>

<style>

</style>
