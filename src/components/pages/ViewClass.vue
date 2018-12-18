<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 과목</h2>
    <div id="choicLists">
      <el-form>
        <span>대학선택: </span>
        <select id="uni-choice" v-model="chosen" @change="categoryChange()" style="width:120px;">
          <option v-for="uniName in uniNameList">{{uniName}}</option>
        </select>
      </el-form>
      <el-form id="dept" style="position: relative; left:220px; top:-60px;">
        <span>학과선택: </span>
        <!-- <select id="dept-choice" v-model="dept_chosen" @change="categorySemesterChange(type,chosen,dept_chosen)" style="width:120px;"> -->
        <select id="dept-choice" v-model="dept_chosen" @change="showChange()" style="width:120px;">
          <option value="">선택사항없음</option>
          <option v-for="deptName in deptNameList">{{deptName}}</option>
        </select>
      </el-form>
      <!-- <el-form id="semester" style="position: relative; left:440px; top:-120px;">
        <span>학기선택: </span>
        <select id="semester-choice" v-model="semester_chosen" @change="onChange(type,chosen,dept_chosen)" style="width:120px;">
          <option value="">선택사항없음</option>
          <option v-for="semesterName in semesterNameList">{{semesterName}}</option>
        </select>
      </el-form> -->
      <el-form id="semester" style="position: relative; left:440px; top:-120px; width:500px">
        <span>기간선택:  </span>
        <el-date-picker v-model="date_from_chosen" type="datetime" format="yyyy-MM-dd" style="width:140px"></el-date-picker> 
        ~
        <el-date-picker v-model="date_to_chosen" type="datetime" format="yyyy-MM-dd" style="width:140px" @change="toChange()"></el-date-picker> 
      </el-form>
    </div>
    <div style="margin-top: -70px;"/>
    <master-class-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
<!--     <div class="right-align">
      <router-link to="/register/teacher">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">강사 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/manager">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div> -->
    <div class="right-align">
      <router-link to="/a/register/class">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">과목 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MasterClassTable from '../partials/MasterClassTable';
import masterService from '../../services/masterService';
import utils from '../../utils';

export default {
  name: 'ViewClass',
  components: {
    MasterClassTable,
  },
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
      uniNameList:[],
      deptNameList:[],
      semesterNameList:[],
      chosen:'',
      dept_chosen:'',
      semester:'',
      date_from_chosen:new Date(),
      date_to_chosen:new Date(),
    };
  },
  computed: {
    ...mapState('NNclass', ['studyingClassList']),
  },
  async created() {
    const vm = this;

    // 새로고침(Refresh, F5) 해도 목록을 가져올 수 있게 하는 부분.
    // TODO: 속도가 눈에 보이게 느려지므로 다른 방법이 있다면 수정 요구.
    // await vm.getMyClassLists();

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    /*if (vm.studyingClassList !== null) {
      if (vm.$route.query.type !== undefined) {
        vm.searchType = vm.$route.query.type;
      }
      if (vm.$route.query.text !== undefined) {
        vm.searchText = vm.$route.query.text;
      }
      for (let i = 0; i < vm.studyingClassList.length; i += 1) {
        if (vm.searchType === 'name') {
          if (vm.studyingClassList[i].name.includes(vm.searchText)) {
            vm.list.push(vm.studyingClassList[i]);
          }
        }
        if (vm.searchType === 'teacher') {
          if (vm.studyingClassList[i].master.name.includes(vm.searchText)) {
            vm.list.push(vm.studyingClassList[i]);
          }
        }
      }
    }*/
  },
  async mounted(){
    const vm=this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.uniNameList = uniNameLists.data.map(element=>element.name);
    // console.log('vm.uniNameList!!!!!!!!===',vm.uniNameList);
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
        /*
        case 'CANCEL': {
          vm.$confirm('정말로 이 학과를 삭제하시겠습니까?', `${arg.name || ''} 수강 취소`, {
            confirmButtonText: '예, 삭제합니다.',
            cancelButtonText: '아니요, 삭제하지 않습니다.',
            type: 'warning',
          })
          .then(async () => {
            try {
              await vm.deleteClassUser({
                classId: arg.class_id,
                userId: vm.userId,
              });

              vm.$notify({
                title: '학과 삭제 성공',
                message: '학과가 삭제됨',
                type: 'success',
                duration: 3000,
              });
            } catch (error) {
              vm.$notify({
                title: '학과 삭제 실패',
                message: error.toString(),
                type: 'error',
                duration: 3000,
              });
            }

            try {
              await vm.getMyClassLists();
              vm.list.splice(arg2, 1);
            } catch (error) {
              vm.$notify({
                title: '학과 삭제 실패',
                message: error.toString(),
                type: 'error',
                duration: 0,
              });
            }
          })
          .catch(() => {
            vm.$notify({
              title: '중단됨',
              message: '학과 삭제 중단됨',
              type: 'info',
              duration: 3000,
            });
          });

          break;
        }
        */
        case 'SEARCH': {
          vm.$router.push({ path: '/a/view/class', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    async categoryChange(){
      const vm=this;
      const deptNameLists = await masterService.getDeptLists(vm.chosen);
      vm.deptNameList = deptNameLists.data.map(element=>element.name);
      // console.log('vm.deptNameList!~!!!!!!!!!!!!!!!!!!!!!',vm.deptNameList);
    },
    /*async onChange(end_date_from,end_date_to){
      const vm=this;
      const res = await masterService.getClassLists({university_name : vm.uniName,department_name : vm.deptName ,end_date_from : vm.end_date_from ,end_date_to : vm.end_date_to});
      vm.list = res.data;
      console.log('vm.list=============',vm.list);
    },*/
    async showChange(){
      const vm=this;
      const null_date=new Date(NaN);
      console.log(null_date);
      const res = await masterService.getClassLists({university_name : vm.chosen,department_name : vm.dept_chosen ,end_date_from : null_date ,end_date_to : null_date});
      /*console.log('vm.uniName==',vm.chosen,'vm.deptName====',vm.dept_chosen);
      console.log('vm.date_from_chosen==',vm.date_from_chosen,'vm.date_to_chosen====',vm.date_to_chosen);*/
      vm.list = res.data;
      /*console.log('vm.list=============',vm.list);*/
    },
    async toChange(){
      const vm=this;
      const res = await masterService.getClassLists({university_name : vm.chosen,department_name : vm.dept_chosen ,end_date_from : vm.date_from_chosen ,end_date_to : vm.date_to_chosen});
      console.log('vm.uniName==',vm.chosen,'vm.deptName====',vm.dept_chosen);
      console.log('vm.date_from_chosen==',vm.date_from_chosen,'vm.date_to_chosen====',vm.date_to_chosen);
      vm.list = res.data;
      console.log('vm.list=============',vm.list);
    },
    onClickDelete(index) {
      const vm = this;
      const currentTeachingClass = vm.teachingClassList[index];
      vm.$confirm('정말로 이 과목을 삭제하시겠습니까?', `${currentTeachingClass.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            // const index = vm.currentClassIndex;
            const currentClass = vm.teachingClassList[index];
            await masterService.delete({
              id: currentClass.class_id,
            });
            vm.deleteTeachingClass({
              teachingClassIndex: index,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '과목 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '과목 삭제 취소됨',
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
    // text-align : left;
    // position: absolute;
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
    width: 300px;
    margin: 20px 0 0 10px;
    //border:1px solid red;
  }
  /*.el-form #dept{
    border: 1px solid blue;
    position: relative;
    top:-100px;
    left: 200px;
  }*/
}
</style>
