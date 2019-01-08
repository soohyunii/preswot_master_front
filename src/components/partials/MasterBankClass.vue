<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" :span-method="objectSpanMethod" style="width: 100%">
      <!-- <el-table-column prop="name" label="ID" width="50">
        <template slot-scope="scope">
          {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="bank_group.group_id" label="ID" width="50"></el-table-column> -->
      <el-table-column prop="bank_group.name" label="그룹명">
      </el-table-column>
      <!-- <el-table-column prop="bank_group.name" label="그룹명" width="200">
      </el-table-column> -->
      <!-- <el-table-column prop="email_id" label="강사" width="200">
      </el-table-column> -->
      <!-- <el-table-column prop="university_name" label="대학" width="110">
      </el-table-column>
      <el-table-column prop="department_name" label="학과" width="140">
      </el-table-column> -->
      <el-table-column prop="user.name" label="구성 강사">
      </el-table-column>
      <!-- <el-table-column prop="user.name" label="구성 강사" width="140">
      </el-table-column> -->
      <el-table-column prop="user.department_name" label="소속 학과">
      </el-table-column>
      <!-- <el-table-column prop="user.department_name" label="소속 학과" width="200">
      </el-table-column> -->
      <el-table-column prop="user.email_id" label="이메일 주소">
      </el-table-column>
      <!-- <el-table-column prop="user.email_id" label="이메일 주소" width="250">
      </el-table-column> -->
      <!-- <el-table-column prop="capacity" label="최대인원" width="110">
      </el-table-column> -->
      <el-table-column label="" header-align="left" align="right">
        <!-- <template slot-scope="scope">
            <router-link :to="`/a/view/${scope.row.name}/detail`">
              <el-button class="edit-btn">상세</el-button>
            </router-link>
        </template> -->
      </el-table-column>
      <el-table-column label="" header-align="left" align="right">
        <!-- <template slot-scope="scope">
            <router-link :to="`/a/view/${scope.row.name}/detail`">
              <el-button class="edit-btn">상세보기</el-button>
            </router-link>
          </template> -->
          <template slot-scope="scope">
            <router-link :to="`/a/bank/${scope.row.group_id}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>
        <!-- </el-table-column> -->
        <!-- <template slot-scope="scope">
            <router-link :to="`/a/class/${scope.row.name}/detail`">
              <el-button class="edit-btn">상세보기</el-button>
            </router-link>
          </template> -->
        <!-- <template slot-scope="scope">
            <router-link :to="`/a/class/${scope.row.name}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column> -->

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
    // formatDate: utils.formatDate,
    async classDelete(group_id){
      await masterService.classDelete({group_id: group_id});
      console.log('group_id===',group_id);
      window.location.reload();
    },

    // 테이블 데이터 합침 잘 안됨 
    objectSpanMethod({row,column,rowIndex,columnIndex}){
      const vm=this;
      const arr=[];
      console.log('rowIndex===',rowIndex);
      console.log('row.bank_group.name===',row.bank_group.name);
      console.log('row===',row);
      if(columnIndex===0){
        for(var j=0;j<rowIndex+1;j++){
          console.log('j는 ==',j);
          arr.push(row.bank_group.name);
        }
        console.log('arr 배열은==',arr);
      }
        /*if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }*/

        if (columnIndex === 0) {
          for(var i=0;i<rowIndex.length;i++){
            if(row[i].bank_group.name==row[i+1].bank_group.name){
              return{
                rowspan:i+1,
                colspan:1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      /*if(columnIndex===0){
          console.log('columnIndex인식',columnIndex);
          for(var i=0; i<=rowIndex; i++){
              arr[i]=row.bank_group.group_id;
              console.log('arr배열에 row.bank_group.group_id 값 입력 :', arr[i] ,row.bank_group.group_id);
              console.log(arr);
            if(arr[i]===arr[i+1]){
              console.log('true');
              return{
                rowspan: 2,
                colspan: 1
              };
            } else {
              return{
                rowspan:2,
                colspan:1
              };
            }
          }
      }*/

      /*console.log('what is row.bank_group.group_id?', row.bank_group.group_id);
      console.log('what is column?', column);
      console.log('what is columnIndex?', columnIndex);
      console.log('what is row?', row);
      console.log('what is rowIndex?', rowIndex);*/
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
