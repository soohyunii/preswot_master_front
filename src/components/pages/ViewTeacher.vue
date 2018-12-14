<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 강사</h2>
    <!-- <student-class-table
      :list="list"
      :onClick="onClick"
    /> -->
    <div id="choiceLists">
    <el-form width="300px">
      <span>대학선택: </span>
      <select id="uni-choice" v-model="chosen" @change="categoryChange()">
        <option v-for="uniName in uniNameList">{{uniName}}</option>
      </select>
    </el-form>
    <el-form id="dept">
      <span>학과선택: </span>
      <select id="dept-choice"  style="width:130px;" v-model="dept_chosen" @change="onChange(type,chosen,dept_chosen)">
        <option v-for="deptName in deptNameList">{{deptName}}</option>
      </select>
    </el-form>
    </div>
    <!-- <div style="margin-top: 50px;"/> -->
    <div style="margin-top: -10px;"/>
    <master-teacher-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/teacher">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">강사 등록하기</div>
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
    };
  },
  computed: {
    ...mapState('NNclass', ['studyingClassList']),
  },
  async created() {
    const vm = this;
/*
    // 새로고침(Refresh, F5) 해도 목록을 가져올 수 있게 하는 부분.
    // TODO: 속도가 눈에 보이게 느려지므로 다른 방법이 있다면 수정 요구.
    const aaa = await vm.masterService.getTeacherLists(1,"연세대학교","물리학과");
    console.log(aaa);

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    if (vm.studyingClassList !== null) {
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
    console.log('uniNameLists======!!!!!!!',uniNameLists);
    // vm.input.uniNameLists = uniNameLists.data.map(element => element.name);
    vm.uniNameList = await uniNameLists.data.map(element => element.name);
    console.log('uniName**************==', vm.uniNameList);
    // const teacherLists = await masterService.getTeacherLists(1,);
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
      const deptNameLists = await masterService.getDeptLists(vm.chosen);
      // console.log(deptNameLists);
      vm.deptNameList = await deptNameLists.data.map(element=>element.name);
    },
    async onChange(type,university_name,department_name){
      const vm=this;
      // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',type);
      const res = await masterService.getTeacherLists(type,university_name,department_name);
      // console.log('######################',res);
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
    // border:1px solid red;
  }
  /*#dept{
    // text-align : left;
    //float: left;
    position: relative;
    right: 100px;
    top: -100px;
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
    border:1px solid red;
  }*/
  #choiceLists {
    //border: 1px solid red;
  }
  #choiceLists #dept{
    // border: 1px solid blue;
    position: relative;
    top:-60px;
    left: 200px;
    // width: 300px;
  }
  master-teacher-table list{
    border: 1px solid red;
  }
}
</style>
