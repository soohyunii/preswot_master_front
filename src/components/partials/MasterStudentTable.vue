<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column prop="userId" label="유저ID" width="70">
        <!-- <template slot-scope="scope">
        {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template> -->
      </el-table-column>
      <el-table-column prop="userType" label="유저타입" width="80">
      </el-table-column>
      <el-table-column prop="email" label="메일주소" width="180">
      </el-table-column>
      <el-table-column prop="passwd" label="비밀번호" width="120">
      </el-table-column>
      <el-table-column prop="name" label="이름" width="100">
        <!-- <template slot-scope="scope">
        {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
        ~
        {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
        </template> -->
      </el-table-column>
      <el-table-column prop="birth" label="생년월일" width="100"></el-table-column>
      <el-table-column prop="sex" label="성별" width="50"></el-table-column>
      <el-table-column prop="phone" label="전화번호" width="150"></el-table-column>
      <el-table-column prop="major" label="전공" width="150"></el-table-column>
      <el-table-column prop="group" label="소속" width="100"></el-table-column>
      <el-table-column prop="bank" label="계좌은행" width="80"></el-table-column>
      <el-table-column prop="bank-account" label="계좌번호" width="150"></el-table-column>
      <!-- <el-table-column label="" header-align="left" align="right" width="345"> -->
        <!-- <el-table-column label="" header-align="left" align="right">
        <template slot-scope="scope">
          <router-link :to="`/a/register/student/${scope.row.code}/edit`">
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
      <el-table-column label="" header-align="left" align="right">
        <template slot-scope="scope">
          <router-link :to="`/a/register/student/${scope.row.code}/edit`">
            <el-button class="edit-btn">수정</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="listeners['delete'](scope.$index)" class="delete-btn">삭제</el-button>
          </template>
        </el-table-column>
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
  name: 'MasterStudentTable',
  props: ['list', 'onClick'],
  data() {
    return {
      pageNum: 1,
      selectOptionList: [
        {
          value: 'name',
          label: '이름',
        },
        {
          value: 'userId',
          label: '유저ID',
        },
      ],
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
