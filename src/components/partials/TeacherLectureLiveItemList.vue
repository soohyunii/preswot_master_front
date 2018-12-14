<template>
  <div>
    <el-table :data="currentData" height="400">
      <el-table-column
        prop="groupN"
        label="그룹"
        width="80"
        sortable >
      </el-table-column>
      <!--
      <el-table-column
        prop="type"
        label="Type."
        width="130"
        :formatter="convertLcItemTypeKor"
        sortable >
      </el-table-column>
      -->
      <el-table-column
        prop="name"
        label="강의도구 이름."
        sortable >
      </el-table-column>
      <el-table-column
        prop="itemNum"
        label="아이템 수"
        width="80">
      </el-table-column>
      <el-table-column
        label=""
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="onClick('SHOW', scope.row)" v-if="scope.row.fir">
            보이기
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <!--<el-pagination id="lecture_item_pagination" layout="prev, pager, next" :page-size="numPageElement" :total="numData" @current-change="handlePageChange" />-->
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
    const vm = this;
    vm.downList = vm.dataList;
    const grp = await lectureItemService.showGroup({
      lectureId: vm.lectureId,
    });
    const seq = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    grp.data.list.forEach((x, index) => {
      // 그룹별로
      x.list_ids.forEach((y, bul) => {
        seq.data.forEach((z) => {
          // 연결리스트별로
          if (z.lecture_item_list_id === parseInt(y, 10)) {
            const newLL = {};
            let howLL = 1;
            if (z.linked_list.includes('<$!<>') === true) {
              // 연결 아이템이 여러개라면
              howLL = z.linked_list.split('<$!<>').length;
            }
            vm.downList.forEach((w) => {
              if (w.lecture_item_id === z.item_id) {
                newLL.name = w.name;
              }
            });
            newLL.itemNum = howLL;
            newLL.groupN = index + 1;
            newLL.groupId = x.group_id;
            if (bul === 0) {
              newLL.fir = true;
            } else {
              newLL.fir = false;
            }
            vm.currentData.push(newLL);
          }
        });
      });
    });
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
