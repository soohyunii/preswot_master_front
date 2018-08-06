<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">과목 목록</h2>

    <el-table class="elTable-label" :data="page" style="width: 90%">
    <el-table-column label="번호" width="100">
      <template slot-scope="scope">
        {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="과목" width="200">
    </el-table-column>
    <el-table-column prop="master.name" label="강사" width="150">
    </el-table-column>
    <el-table-column label="기간" width="300">
      <template slot-scope="scope">
        {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
        ~
        {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
      </template>
    </el-table-column>
    <el-table-column label="-" fixed="right" style="text-align: center;">
      <template slot-scope="scope">
        <el-button type="success" @click="onClick('DETAIL', scope.row)">살펴보기</el-button>
        <span v-if="isApplied(scope.row)">
          <el-button type="danger" @click="onClick('CANCEL', scope.row)">수강취소</el-button>
        </span>
        <span v-else-if="scope.row.opened===2">
          <el-button type="info">마감됨</el-button>
        </span>
        <span v-else>
          <el-button type="primary" @click="onClick('APPLY', scope.row)">수강하기</el-button>
        </span>
      </template>
    </el-table-column>
    </el-table>
    <br>
    <div id="pagination" style="display: block; text-align: center;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="listCount"
        :current-page.sync="pageNum"
        @current-change="onClick('CHANGE', pageNum)"
      >
      </el-pagination>
    </div>
    <br>
    <div style="display: block; text-align: center;">
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
  name: 'ClassIndexTable',
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
      listCount: 0,
      listStatus: [],
      page: [],
      pageNum: 1,
      pageStatus: [],
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

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    if (vm.$route.query.type !== undefined) {
      vm.searchType = vm.$route.query.type;
    }
    if (vm.$route.query.text !== undefined) {
      vm.searchText = vm.$route.query.text;
    }
    for (let i = 0; i < vm.openedClassList.length; i += 1) {
      if (vm.searchType === 'name') {
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

    for (let i = 0; i < 10; i += 1) {
      vm.page.push(vm.list[((vm.pageNum - 1) * 10) + i]);
      if (((vm.pageNum - 1) * 10) + i === (vm.listCount - 1)) {
        break;
      }
    }
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
    isApplied(arg) {
      for (let i = 0; i < this.studyingClassList.length; i += 1) {
        if (arg.class_id === this.studyingClassList[i].class_id) {
          return true;
        }
      }
      return false;
    },
    async onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          vm.$router.push({ path: `/class/${arg.class_id}/classdetail` });
          break;
        }
        case 'APPLY': {
          try {
            await vm.postClassUser({
              classId: arg.class_id,
            });
            vm.$notify({
              title: '수강 신청 요청 성공',
              message: '메세지',
              type: 'success',
            });
          } catch (error) {
            vm.$notify({
              title: '수강 신청 요청 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }

          try {
            await vm.getMyClassLists();
            await vm.getClassLists();
          } catch (error) {
            vm.$notify({
              title: '과목 목록 가져오기 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
          break;
        }
        case 'CANCEL': {
          vm.$confirm('정말로 이 과목의 수강을 취소하시겠습니까?', `${arg.name || ''} 수강 취소`, {
            confirmButtonText: '예, 취소합니다.',
            cancelButtonText: '아니요, 취소하지 않습니다.',
            type: 'warning',
          })
          .then(async () => {
            try {
              await classService.deleteClassUser({
                classId: arg.class_id,
                userId: vm.userId,
              });

              vm.$notify({
                title: '수강 취소 성공',
                message: '수강이 취소됨',
                type: 'success',
                duration: 3000,
              });
            } catch (error) {
              vm.$notify({
                title: '수강 취소 실패',
                message: error.toString(),
                type: 'error',
                duration: 3000,
              });
            }
          })
          .catch(() => {
            vm.$notify({
              title: '중단됨',
              message: '수강 취소 중단됨',
              type: 'info',
              duration: 3000,
            });
          });

          try {
            await vm.getMyClassLists();
            await vm.getClassLists();
          } catch (error) {
            vm.$notify({
              title: '과목 목록 가져오기 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
          break;
        }
        case 'SEARCH': {
          vm.$router.push({ path: '/classes', query: { type: `${vm.searchType}`, text: `${vm.searchText}` } });
          break;
        }
        case 'CHANGE': {
          vm.page = [];
          for (let i = 0; i < 10; i += 1) {
            vm.page.push(vm.list[((vm.pageNum - 1) * 10) + i]);
            if (((vm.pageNum - 1) * 10) + i === (vm.listCount - 1)) {
              break;
            }
          }
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
