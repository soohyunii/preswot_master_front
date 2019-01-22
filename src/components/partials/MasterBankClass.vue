<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" v-model="setSpanMethod" :data="page" :span-method="objectSpanMethod" style="width: 100%">
      <el-table-column prop="bank_group.name" label="그룹명" width="200px">
      </el-table-column>
      </el-table-column>
      <el-table-column prop="user.name" label="구성 강사">
      </el-table-column>
      <el-table-column prop="user.department_name" label="소속 학과">
      </el-table-column>
      <el-table-column prop="user.email_id" label="이메일 주소">
      </el-table-column>
      <el-table-column label="" header-align="left" align="right" width="200px">
          <template slot-scope="scope">
            <router-link :to="`/a/bank/${scope.row.bank_group.group_id}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="bankDelete(scope.row.bank_group.group_id)"
            class="delete-btn">삭제</el-button>
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
      setSpanMethod:[], 
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
      departmentArray:[],
      deptNameArray:[],
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
  async mounted(){
    const vm=this;
  },
  watch:{
    page: function(val, oldVal){
      const vm=this;
      vm.spanArray = [];
      vm.groupNameArray = vm.page.map(x => x.bank_group.name);
      let pre_value = '';
      let sameValue = 0;
      let sameValueArray = [];
      vm.groupNameArray.forEach((element,index) => {
      if (pre_value === element || sameValue === 0) {
          sameValue++;
          } else {
            sameValueArray.push(sameValue);
            sameValue = 1;
          }
          pre_value = element;
        });
      sameValueArray.push(sameValue);
        sameValueArray.forEach((element,index)=>{
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
    },
  },
  methods: {
    async bankDelete(group_id){
      const vm=this;
      vm.$confirm('정말로 이 강의은행을 삭제하시겠습니까?',{
        confirmButtonText:'예, 삭제합니다',
        cancelButtonText:'아니오, 삭제하지 않습니다',
        type:'warning',
      })
      .then(async()=> {
        try{
          await masterService.bankDelete({group_id:group_id});
          await location.reload(true);  
        } catch(error){
          vm.$notify({
            title:'강의은행 삭제 실패',
            message:error.toString(),
            type:'error',
            duration:3000,
          }); 
        }
      })
    },
    objectSpanMethod({row,column,rowIndex,columnIndex}){
      const vm = this;
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
}
</style>
