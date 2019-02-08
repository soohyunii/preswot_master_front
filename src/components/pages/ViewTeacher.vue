<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 강사</h2>
    <div id="choiceLists">
    <el-form>
      <el-select placeholder="대학선택" style="width:200px; top:20px;" v-model="chosen" @change="categoryChange()">
        <el-option 
          v-for="uniName in uniNameList"
          :key="uniName"
          :label="uniName"
          :value="uniName">
        </el-option>
      </el-select>
    </el-form>
    <el-form id="dept">
      <el-select placeholder="학과선택" style="width:200px; top:20px;" v-model="dept_chosen" @change="onChange(type,chosen,dept_chosen)">
        <el-option 
          v-for="deptName in deptNameList"
          :key="deptName"
          :label="deptName"
          :value="deptName">
        </el-option>
      </el-select>
    </el-form>
    </div>
    <div style="margin-top: -10px;"/>
    <master-teacher-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/teacher">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49.5%">
          <div class="right-align-btn-layer">강사 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 50%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MasterTeacherTable from '../partials/MasterTeacherTable';
import masterService from '../../services/masterService';
import utils from '../../utils';

export default {
  name: 'ViewTeacher',
  components: {
    MasterTeacherTable,
  },
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
      chosen:'',
      uniNameList:[],
      deptNameList:[],
      dept_chosen:'',
      type:1,
      nothing: undefined,
    };
  },
  computed: {
    ...mapState('MasterTeacher', ['studyingTeacherList']),
  },
  async created() {
    const vm = this;
  },
  async mounted(){
    const vm=this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.uniNameList = await uniNameLists.data.map(element => element.name);
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'deleteClassUser',
    ]),
    formatDate: utils.formatDate,
    async onClick(type, arg, arg2) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          vm.$router.push(`/class/${arg.class_id}/classdetail`);
          break;
        }
        case 'LISTEN': {
          vm.$router.push(`/a/student/NNclass/${arg.class_id}`);
          break;
        }
        case 'SEARCH': {
          vm.$router.push({ path: '/a/view/teacher', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    async categoryChange(){
      const vm=this;
      const deptNameLists = await masterService.getDeptLists({university_name:vm.chosen, category:undefined});
      vm.deptNameList = await deptNameLists.data.map(element=>element.name);
      const res = await masterService.getUserLists(type,university_name,null);
      for(var i=0;i<res.data.length;i++){
        if(res.data[i].birth.indexOf("T")!==-1){
          res.data[i].birth=res.data[i].birth.split("T")[0];
        }
      }
      vm.list=res.data;
    },
    async categoryAllShow(){
      const vm=this;
      const deptNameListsAll = await masterService.getUserLists(type,university_name,department_name);
      vm.list=deptNameListsAll.data;
    },
    async onChange(type,university_name,department_name){
      const vm=this;
      const res = await masterService.getUserLists(type,university_name,department_name);
      vm.list = res.data;
    },
    onClickDelete(index) {
      const vm = this;
      const currentTeachingClass = vm.teachingClassList[index];
      vm.$confirm('정말로 이 강사를 삭제하시겠습니까?', `${currentTeachingClass.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            const currentClass = vm.teachingClassList[index];
            await masterService.delete({
              id: currentClass.class_id,
            });
            vm.deleteTeachingClass({
              teachingClassIndex: index,
            });
          } catch (error) {
            console.error(error); 
            vm.$notify({
              title: '강사 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '강사 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
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
  .el-form{
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
    width: 200px;
    margin: 20px 10px 0 10px;
  }
  #choiceLists {
  }
  #choiceLists #dept{
    position: relative;
    top:-60px;
    left: 200px;
    margin-left:30px;
  }
  master-teacher-table list{
    border: 1px solid red;
  }
}
</style>
