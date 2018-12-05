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
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" @click="onClick('APPEND', scope.row)" v-if="!scope.row.ifTail">
            추가
          </el-button>
          <el-button type="primary" size="small" @click="onClick('SHOW', scope.row.lecture_item_id, scope.row.sequence - 1)" v-if="!scope.row.ifTail">
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
import lectureItemService from '../../services/lectureItemService';

export default {
  name: 'LectureItemList',
  props: ['dataList', 'onClick', 'isAuto'],
  data() {
    return {
      downList: [],
      currentData: [],
      numData: 0,
      numPageElement: 5,
    };
  },
  async created() {
    // 각 문항이 딸린문항인지 아닌지 판별하기 위해
    const vm = this;
    vm.downList = vm.dataList;
    // 연결된 문항인지 속성 추가
    const tailItemList = [];
    const seq = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    seq.data.forEach((x) => {
      // 여러 하위 항목
      if (x.linked_list.includes('<$!<>') === true) {
        const namugiSplit = x.linked_list.split('<$!<>');
        namugiSplit.forEach((y) => {
          tailItemList.push(parseInt(y, 10));
        });
      } else {
        // 하위 항목이 하나
        tailItemList.push(parseInt(x.linked_list, 10));
      }
    });
    vm.downList.forEach((x) => {
      if (tailItemList.includes(x.lecture_item_id) === true) {
        x.ifTail = true; // eslint-disable-line
      } else {
        x.ifTail = false; // eslint-disable-line
      }
    });
    vm.currentData = vm.downList.slice(0, vm.numPageElement);
    vm.numData = vm.downList.length;
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
  },
  methods: {
    convertLcItemTypeKor(row) {
      return utils.convertLcItemTypeKor(row.type);
    },
    handlePageChange(page) {
      const vm = this;
      vm.currentData = vm.downList.slice(vm.numPageElement * (page - 1), vm.numPageElement * page);
    },
  },
};
</script>

<style lang="scss" scoped>
#lecture_item_pagination {
  text-align: center;
}
</style>
