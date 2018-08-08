<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column label="번호" width="100">
        <template slot-scope="scope">
        {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="과목">
      </el-table-column>
      <el-table-column prop="master.name" label="강사" width="150">
      </el-table-column>
      <el-table-column label="기간">
        <template slot-scope="scope">
        {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
        ~
        {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
        </template>
      </el-table-column>
      <el-table-column label="-" header-align="left" align="right" width="220">
        <template slot-scope="scope">
        <el-button type="success" @click="onClick('DETAIL', scope.row)">살펴보기</el-button>
        <span v-if="isApplied(scope.row)">
            <el-button type="danger" @click="onClick('CANCEL', scope.row)">수강취소</el-button>
        </span>
        <span v-else-if="scope.row.opened===2">
            <el-button type="info" disabled width="200px">신청마감</el-button>
        </span>
        <span v-else>
            <el-button type="primary" @click="onClick('APPLY', scope.row)">수강하기</el-button>
        </span>
        </template>
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
      <div style="display: block; text-align: center;">
        <el-select v-model="searchQuery.searchType" style="display: inline-block; width: 100px">
        <el-option
            v-for="option in selectOptionList"
            :key="option.value"
            :label="option.label"
            :value="option.value">
        </el-option>
        </el-select>
        <el-input style="display: inline-block; width: 300px" placeholder="검색어를 입력하세요."
          v-model="searchQuery.searchText" @keydown.enter.native="onClick('SEARCH', searchQuery)"></el-input>
        <el-button @click="onClick('SEARCH', searchQuery)" icon="el-icon-search" circle></el-button>
      </div>
  </div>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'ClassIntroTable',
  props: ['list', 'studyingClassList', 'onClick'],
  data() {
    return {
      pageNum: 1,
      selectOptionList: [{
        value: 'name',
        label: '과목',
      }, {
        value: 'teacher',
        label: '강사',
      }],
      searchQuery: {
        searchType: 'name',
        searchText: '',
      },
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
  created() {
    const vm = this;
    if (vm.$route.query.type !== undefined) {
      vm.searchQuery.searchType = vm.$route.query.type;
    }
    if (vm.$route.query.text !== undefined) {
      vm.searchQuery.searchText = vm.$route.query.text;
    }
  },
  methods: {
    formatDate: utils.formatDate,
    isApplied(arg) {
      for (let i = 0; i < this.studyingClassList.length; i += 1) {
        if (arg.class_id === this.studyingClassList[i].class_id) {
          return true;
        }
      }
      return false;
    },
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
  }
}
</style>
