<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column prop="code" label="학생코드" width="233px">
      </el-table-column>
      <el-table-column prop="name" label="학생이름" width="233px">
      </el-table-column>
      <el-table-column prop="sex" label="성별" width="233px">
      </el-table-column>
      <el-table-column prop="age" label="나이" width="233px">
      </el-table-column>
      <el-table-column prop="dept" label="학과" width="233px">
      </el-table-column>
      
      <!-- <el-table-column label="" header-align="left" align="right">
        <template slot-scope="scope">
            <router-link :to="`/a/register/uni/${scope.row.code}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="listeners['delete'](scope.$index)" class="delete-btn">삭제</el-button>
          </template>
        </el-table-column> -->

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
      <!-- <div style="display: block; text-align: center;">
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
      </div> -->
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
      /*selectOptionList: [
        {
          value: 'name',
          label: '대학명',
        },
        {
          value: 'code',
          label: '대학코드',
        }, 
      ],
      searchQuery: {
        searchType: 'name',
        searchText: '',
      },*/
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
