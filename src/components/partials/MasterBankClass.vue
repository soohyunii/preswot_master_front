<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" :span-method="objectSpanMethod" style="width: 100%">
      <!-- <el-table-column prop="bank_group.group_id" label="그룹명" width="200px">
      </el-table-column> -->
      <el-table-column prop="bank_group.name" label="그룹명" width="200px">
      </el-table-column>
      <el-table-column prop="user.name" label="구성 강사">
      </el-table-column>
      <el-table-column prop="user.department_name" label="소속 학과">
      </el-table-column>
      <el-table-column prop="user.email_id" label="이메일 주소">
      </el-table-column>
      <el-table-column label="" header-align="left" align="right" width="200px">
          <template slot-scope="scope">
            <router-link :to="`/a/bank/${scope.row.group_id}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="classDelete(scope.row.group_id)" class="delete-btn">삭제</el-button>
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
import masterService from '../../services/masterService';

export default {
  name: 'MasterBankClass',
  props: ['list', 'onClick'],
  data() {
    return {
      onceFlag: true,
      pageNum: 1,
      selectOptionList: [
        {
          value: 'name',
          label: '학과명',
        },
        {
          value: 'university',
          label: '대학명',
        },
      ],
      searchQuery: {
        searchType: 'name',
        searchText: '',
      },
      groupNameArray: [],
      spanArray: [],
      /*tempArray: [{
        rowspan: 2,
        colspan: 1,
      }, {
        rowspan: 0,
        colspan: 0,
      }, {
        rowspan: 2,
        colspan: 1,
      }, {
        rowspan: 0,
        colspan: 0,
      }, {
        rowspan: 4,
        colspan: 1,
      }, {
        rowspan: 0,
        colspan: 0,
      }, {
        rowspan: 0,
        colspan: 0,
      } ,{
        rowspan: 0,
        colspan: 0,
      }],*/
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
    
    // 연산
    // vm.tempArray = [];
  },
  methods: {
    // formatDate: utils.formatDate,
    async classDelete(group_id){
      await masterService.classDelete({group_id: group_id});
      console.log('group_id===',group_id);
      window.location.reload();
    },

    // 테이블 데이터 합침 잘 안됨 
    objectSpanMethod({row,column,rowIndex,columnIndex}){
      const vm = this;
      if ( vm.onceFlag === true ) {
        console.log('@@@@@@@@@@@@@');
        console.log('row = ', row);
        console.log('column = ', column);
        console.log('rowIndex = ', rowIndex);
        console.log('columnIndex = ', columnIndex);

        vm.groupNameArray = vm.page.map(x => x.bank_group.name);

        let pre_value = '';
        let sameValue = 0;
        let sameValueArray = [];
        vm.groupNameArray.forEach((element,index) => {

          // 이전 값과 현재 값 비교하기
          if (pre_value === element || sameValue === 0) {
            sameValue++;
          } else {
            sameValueArray.push(sameValue);
            sameValue = 1;
          }
          // 이전 값 기억하기
          pre_value = element;
        });
        sameValueArray.push(sameValue);
        console.log('sameValueArray = ', sameValueArray);

        console.log('@vm.spanArray = ', vm.spanArray);
        sameValueArray.forEach((element,index)=>{
          console.log('element = ', element);
          vm.spanArray.push({
            rowspan: element,
            colspan: 1,
          });
          for (let i = 0 ; i < element-1 ; i++ ) {
            vm.spanArray.push({
              rowspan: 0,
              colspan: 0,
            });
          }
        });
        console.log('vm.spanArray = ', vm.spanArray);
        vm.onceFlag = false; 
      }
      if(columnIndex===0 || columnIndex===4 || columnIndex===5){
          return vm.spanArray[rowIndex];
      }
    },
  },
};
</script>


<style lang="scss" scoped>
#class_index_wrapper {
  .elTable-label {
    text-align: center;
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
    text-align: center;
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
    text-align: center;
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #606266;
  }
  /*.edit-btn-detail {
    border: 1px solid blue;
    width:120px;
    margin-right: 100px;
  }*/
}
</style>
