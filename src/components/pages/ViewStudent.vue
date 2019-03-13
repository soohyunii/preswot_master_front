<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 학생 및 성적표</h2>
    <div id="choiceLists">
    <el-form>
      <el-select placeholder="대학선택" v-model="chosen" @change="categoryChange(type,chosen)" style="width:200px; top:20px">
        <el-option 
          v-for="university_name in university_list"
          :key="university_name"
          :label="university_name"
          :value="university_name">
        </el-option>
      </el-select>
    </el-form>
    <el-form id="dept">
      <el-select placeholder="학과선택" v-model="dept_chosen" @change="onChange(type,chosen,dept_chosen)" style="width:200px; top:20px">
        <el-option 
          v-for="department_name in department_list"
          :key="department_name"
          :label="department_name"
          :value="department_name">
        </el-option>
      </el-select>
    </el-form>
    <div style="margin-top: -10px;"/>
    </div>
    <master-student-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/student">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">학생 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/a/view/studentScore">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">전체 학생 성적표 조회</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template> 

<script>
/* eslint-disable camelcase */
import { mapActions, mapState } from 'vuex';
import MasterStudentTable from '../partials/MasterStudentTable';
import utils from '../../utils';
import masterService from '../../services/masterService';

export default {
  name: 'ViewStudent',
  components: {
    MasterStudentTable,
  },
  data() {
    return {
      searchType: 'name',
      searchText: '',
      list: [],
      chosen: '',
      dept_chosen: undefined,
      university_list: [],
      department_list: [],
      university_name: '',
      department_name: null,
      type: 0,
    };
  },
  computed: {
    ...mapState('NNclass', ['studyingClassList']),
  },
  async created() {
    const vm = this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.university_list = await uniNameLists.data.map(element => element.name);
    // TODO: 새로고침(Refresh, F5) 해도 목록을 가져올 수 있게 하는 부분.
    // TODO: 속도가 눈에 보이게 느려지므로 다른 방법이 있다면 수정 요구.

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
        if (vm.searchType === 'userId') {
          if (vm.studyingClassList[i].master.name.includes(vm.searchText)) {
            vm.list.push(vm.studyingClassList[i]);
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'deleteClassUser',
    ]),
    formatDate: utils.formatDate,
    async onClick(type, arg) {
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
          vm.$router.push({ path: '/a/view/student', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    async categoryChange(type, university_name) {
      const vm = this;
      const deptNameLists = await masterService.getDeptLists({
        university_name: vm.chosen,
        category: undefined,
      });
      vm.department_list = await deptNameLists.data.map(element => element.name);
      const res = await masterService.getUserLists(type, university_name);
      if (vm.chosen !== undefined && vm.dept_chosen !== undefined) {
        vm.dept_chosen = undefined;
      }
      for (let i = 0; i < res.data.length; i += 1) {
        if (res.data[i].department_name === null) {
          res.data[i].department_name = '소속없음';
        }
        if (res.data[i].sex === 1) {
          res.data[i].sex = '남자';
        } else {
          res.data[i].sex = '여자';
        }
      }
      vm.list = res.data;
    },
    async onChange(type, university_name, department_name) {
      const vm = this;
      const res = await masterService.getUserLists(type, university_name, department_name);
      for (let i = 0; i < res.data.length; i += 1) {
        if (res.data[i].sex === 1) {
          res.data[i].sex = '남자';
        } else {
          res.data[i].sex = '여자';
        }
      }
      vm.list = res.data;
    },
    onClickDelete(index) {
      const vm = this;
      const currentTeachingClass = vm.teachingClassList[index];
      vm.$confirm('정말로 이 학생을 삭제하시겠습니까?', `${currentTeachingClass.name || ''} 삭제`, {
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
            vm.$notify({
              title: '학생 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '학생 삭제 취소됨',
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
    width: 300px;
    margin: 20px 0 0 10px;
  }
  #choiceLists #dept{
    position: relative;
    top:-60px;
    left: 200px;
    margin-left: 30px;
  }
}
</style>
