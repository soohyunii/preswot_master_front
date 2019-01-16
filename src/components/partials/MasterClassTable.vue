<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <!-- <el-table-column prop="name" label="ID" width="50">
        <template slot-scope="scope">
          {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="class_id" label="ID" width="50">
        <template slot-scope="scope">
          {{ (pageNum - 1) * 10 + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="코드" width="90">
      </el-table-column>
      <el-table-column prop="name" label="과목명" width="140">
      </el-table-column>
      <el-table-column prop="isActive" label="활성화여부" width="120">  <!-- 기본과목(N)/실제과목(Y)/(실제과목 미등록)/ (상세 페이지 화면에서는 좀 더 자세하게:강의,시간,공간 중 무엇을 미등록했는지 알려주는 알림창 필요) -->
      </el-table-column>
      <!-- <el-table-column prop="user.name" label="강사" width="110"> -->
      <el-table-column prop="teacher_email_id" label="강사" width="110">
      <!-- <el-table-column prop="teacher_list.name" label="강사" width="110"> -->
      </el-table-column>
      <el-table-column prop="start_date" :list="list" label="강의시작일" width="160">
      </el-table-column>
      <el-table-column prop="lecture_register" label="강의등록여부" width="160">
      </el-table-column>  <!-- 등록 / 미등록 -->
      <el-table-column prop="attend_rate" label="출석률" width="100">
      </el-table-column>
      <el-table-column label="" header-align="left" align="right">
        <!-- <template slot-scope="scope" v-if="isActive==false"> -->
        <template slot-scope="scope">
            <router-link :to="`/a/view/${scope.row.class_id}/detail`">
              <el-button class="edit-btn">상세</el-button>
            </router-link>
        </template>
      </el-table-column>
      <el-table-column label="" header-align="left" align="right">
          <template slot-scope="scope">
            <router-link :to="`/a/class/${scope.row.class_id}/edit`">
              <el-button class="edit-btn">수정</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="danger" @click="classDelete(scope.row.class_id)" class="delete-btn">삭제</el-button>
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
  name: 'MasterClassTable',
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
      dateArray:[],
      start_date:[],
      teacherName:[],
      isActive:true,
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
  async mounted(){
    const vm=this;

    /*const res = await masterService.getMasterClass({class_id:class_id});
    if(res.data.isActive==false){
      vm.isActive=false;
    } else {
      vm.isActive=true;
    }*/
    /*console.log('vm.list[0].teacher_email_id==',vm.list[0].teacher_email_id);
    var teacherName = new Array();
    for(var i=0; i<vm.list.length; i++){
      teacherName[i] = await masterService.getMasterUser({email_id:vm.list[i].teacher_email_id});
      console.log('teacherName==',teacherName);
    }*/
    /*const teacherName = await masterService.getMasterUser({email_id:vm.list.teacher_email_id});
    console.log('teacherName==',teacherName);*/
    // vm.list.teacher_email_id=teacherName.data.map(element=>element.name);
  },
  watch:{
    page: 'changeColumn',
    /*page: function(val, oldVal){
      const vm=this;
      vm.dateArray = vm.page.map(x=>x.start_date);
      for(var i=0;i<vm.dateArray.length;i++){
        if(vm.dateArray[i].indexOf("T")!==-1){
          vm.dateArray[i]=vm.dateArray[i].split("T")[0]; 
          vm.list.start_date=vm.dateArray[i];
        }
      }
      console.log('vm.list.start_date==',vm.list.start_date);
      if(vm.list.start_date.indexOf("T")!=-1){
        console.log(vm.list.start_date.indexOf("T"));
        vm.list.start_date=vm.list.start_date.split("T")[0];
      }
      console.log('vm.dateArray==',vm.dateArray);
      console.log('vm.page.start_date==',vm.list.start_date);
    }*/
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
    async changeColumn(){
      const vm=this;
      /*console.log('method 출력!');
      const res = await masterService.getClassLists({university_name:vm.chosen,department_name:vm.dept_chosen, end_date_from:vm.date_from_chosen, end_date_to:vm.date_to_chosen});
      console.log('res.data[0].start_date==',res.data[0].start_date);
      console.log('res.data[0].start_date.indexOf==',res.data[0].start_date.indexOf("T"));
      for(var i=0;i<res.data.length;i++){
        console.log('res.data==',res.data);
        if(res.data.isActive=='false'){
          if(res.data[i].start_date.indexOf("T")!==-1){
            res.data[i].start_date=res.data[i].start_date.split("T")[0];
          }
        } 
      }
      vm.list=res.data;*/
    },
    async classDelete(class_id){
      const vm=this;
      vm.$confirm('정말로 이 과목을 삭제하시겠습니까?',{
        confirmButtonText:'예, 삭제합니다',
        cancelButtonText:'아니오, 삭제하지 않습니다',
        type:'warning',
      })
      .then(async()=> {
        try{
          // window.location.reload();
          await masterService.classDelete({class_id: class_id});
          /*await vm.$notify({
            title:'강의은행 삭제 성공',
            message:'강의은행 삭제',
            type:'success',
            duration:3000,
          });*/
          await location.reload(true);  
        } catch(error){
          vm.$notify({
            title:'과목 삭제 실패',
            message:error.toString(),
            type:'error',
            duration:3000,
          }); 
        }
      })
    },
    async goBack(){
      window.history.back();
      console.log('back!');
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

<!-- <el-table-column prop="user.name" label="강사" width="110"> -->