<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column prop="uni_id" label="ID" width="50">
        <template slot-scope="scope">
          {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="대학코드" width="100">
      </el-table-column>
      <el-table-column prop="name" label="대학명" width="150">
      </el-table-column>
      <el-table-column prop="address" label="주소" width="280">
      </el-table-column>
      <el-table-column prop="manager_name" label="담당자" width="100">
      </el-table-column>
      <el-table-column prop="manager_email" label="메일주소" width="190">
      </el-table-column>
      <el-table-column prop="manager_phone_number" label="전화번호" width="140">
      </el-table-column>
      <el-table-column label="" header-align="left" align="right">
        <template slot-scope="scope">
            <router-link :to="`/a/${scope.row.name}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteUniversity(scope.row.name)" class="delete-btn">삭제</el-button>
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
  name: 'MasterUniTable',
  props: ['list', 'onClick'],
  data() {
    return {
      pageNum: 1,
      selectOptionList: [
        {
          value: 'name',
          label: '대학명',
        },
      ],
      searchQuery: [
        {
          searchType: 'name',
          searchText: '',
        },
      ],
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
    async deleteUniversity(uniName) {
      const vm=this;
      vm.$confirm('정말로 이 대학을 삭제하시겠습니까?',{
        confirmButtonText:'예, 삭제합니다',
        cancelButtonText:'아니오, 삭제하지 않습니다',
        type:'warning',
      })
      .then(async()=> {
        try{
          await masterService.delete({ name : uniName });
          await location.reload(true);  
        } catch(error){
          vm.$notify({
            title:'대학 삭제 실패',
            message:error.toString(),
            type:'error',
            duration:3000,
          }); 
        }
      })
    }
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
