<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">과목 목록</h2>

    <el-table class="elTable-label" :data="list" style="width: 100%">
    <el-table-column type="index" label="번호" width="100">
    </el-table-column>
    <el-table-column prop="name" label="과목" width="200">
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
    <el-table-column label="-" fixed="right" style="text-align: center;">
      <template slot-scope="scope">
        <el-button type="success" @click="DETAIL(scope.$index, scope.row)">살펴보기</el-button>
        <el-button type="primary" @click="APPLY(scope.$index, scope.row)">수강하기</el-button>
      </template>
    </el-table-column>
    </el-table>

    <div id="pagination" style="position: center;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="listCount"
        :current-page.sync="pageNum"
        @current-change="onClick('CHANGE',pageNum)"
      >
      </el-pagination>
    </div>

    <div style="display: inline; position: center;">
      <el-select v-model="searchType" style="display: inline-block; width: 100px">
        <el-option
          v-for="option in selectOptionList"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input style="display: inline-block; width: 300px" placeholder="검색어를 입력하세요." v-model="searchText" @keydown.enter.native="onClick('SEARCH')"></el-input>
      <el-button @click="onClick('SEARCH')" icon="el-icon-search" circle></el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import classService from '../../services/classService';
import utils from '../../utils';

export default {
  name: 'ClassIndex',
  data() {
    return {
      searchType: 'name',
      searchText: '',
      list: [],
      listCount: 0,
      pageNum: 1,
      selectOptionList: [{
        value: 'name',
        label: '과목',
      }, {
        value: 'teacher',
        label: '강사',
      }],
    };
  },
  computed: {
    ...mapState('NNclass', ['openedClassList', 'studyingClassList']),
  },
  async created() {
    const vm = this;
    if (vm.$route.query.type !== undefined) {
      vm.searchType = vm.$route.query.type;
    }
    if (vm.$route.query.text !== undefined) {
      vm.searchText = vm.$route.query.text;
    }
    console.log('searchType: ', vm.searchType, '// searchText: ', vm.searchText);
    console.log('openedClass: ',vm.openedClassList);
    for (let i = 0; i < vm.openedClassList.length; i += 1) {
      if (vm.searchType === 'name') {
        console.log('openedClassName: ', vm.openedClassList[i].name);
        if (vm.openedClassList[i].name.includes(vm.searchText)) {
          vm.list.push(vm.openedClassList[i]);
        }
      }
      if (vm.searchType === 'teacher') {
        if (vm.openedClassList[i].master.name.includes(vm.searchText)) {
          vm.list.push(vm.openedClassList[i]);
        }
      }
    }
    vm.listCount = vm.list.length;
  },
  async beforeMounted() {
    const vm = this;
    vm.getClassLists();
    vm.getMyClassLists();
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'postClassUser',
    ]),
    formatDate: utils.formatDate,
    updateNavNumList(navStartNum) { // 게시판 하단 네비게이터를 업데이트 함
      const temp = this.$data.postTotalCount - (((navStartNum - 1) * 10) + 1);
      let naviAmount = (Math.floor(temp / 10) + 1);
      if (naviAmount > 10) {
        naviAmount = 10;
      }
      this.$data.navNumList = [];
      for (let i = 0; i < naviAmount; i += 1) {
        this.$data.navNumList.push(navStartNum + i);
      }
    },
    async onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          break;
        }
        case 'APPLY': {
          break;
        }
        case 'CANCEL': {
          break;
        }
        case 'SEARCH': {
          vm.$router.push({ path: '/classes', query: { type: `${vm.searchType}`, text: `${vm.searchText}` } });
          break;
        }
        case 'CHANGE': {
          console.log(arg);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>


<style lang="scss" scoped>

#class_index_wrapper {
  .page-title{
    float:left;
    width:1000px;
    height: 24px;

    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;

    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;
  }

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
