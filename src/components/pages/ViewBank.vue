<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 강의은행</h2>
    <div id="choiceLists">
      <el-form>
        <el-select placeholder="대학선택" v-model="chosen" @change="categoryChange()" style="width:200px; top:20px">
        <el-option 
          v-for="universityName in universityNameList"
          :key="universityName"
          :label="universityName"
          :value="universityName">
        </el-option>
      </el-select>
    </el-form>
    <el-form id="dept" style="position:relative; left:220px; top:-60px;">
      <el-select placeholder="학과선택" v-model="department_chosen" @change="showChange()" style="width:200px; top:20px;">
        <el-option 
          v-for="departmentName in departmentNameList"
          :key="departmentName"
          :label="departmentName"
          :value="departmentName">
        </el-option>
      </el-select>
    </el-form>
    </div>
    <master-bank-class
      :list="list"
      :sublist="sublist"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/bank">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">강의은행 등록하기</div>
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
/* eslint-disable no-unused-vars */
import { mapActions, mapState } from 'vuex';
import MasterBankClass from '../partials/MasterBankClass';
import masterService from '../../services/masterService';
import utils from '../../utils';

export default {
  name: 'ViewBank',
  components: {
    MasterBankClass,
  },
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
      sublist: [],
      universityNameList: [],
      departmentNameList: [],
      chosen: '',
      department_chosen: '',
    };
  },
  computed: {
    ...mapState('NNclass', ['studyingClassList']),
  },
  async created() {
    const vm = this;
  },
  async mounted() {
    const vm = this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.universityNameList = uniNameLists.data.map(element => element.name);
  },
  watch: {
    list: async function list(val, oldVal) {
      const vm = this;
    },
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
        case 'CANCEL': {
          vm.$confirm('정말로 이 강의은행을 삭제하시겠습니까?', `${''} 강의은행 취소`, {
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
        case 'SEARCH': {
          vm.$router.push({ path: '/a/view/bank', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
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
    async categoryChange() {
      const vm = this;
      const deptNameList = await masterService.getDeptLists({
        university_name: vm.chosen,
        category: undefined,
      });
      vm.departmentNameList = deptNameList.data.map(element => element.name);
      const res = await masterService.getBankLists({ university_name: vm.chosen });
      for (let i = 0; i < res.data.length; i += 1) {
        if (res.data[i].user.department_name === null) {
          res.data[i].user.department_name = '소속없음';
        }
      }
      vm.list = res.data;
    },
    async showChange() {
      const vm = this;
      const res = await masterService.getBankLists({
        university_name: vm.chosen,
        department_name: vm.department_chosen,
      });
      for (let i = 0; i < res.data.length; i += 1) {
        if (res.data[i].user.department_name === null) {
          res.data[i].user.department_name = '소속없음';
        }
      }
      vm.list = res.data;
    },
  },
};
</script>


<style lang="scss" scoped>
#class_index_wrapper {
  z-index:1;
}

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
}
</style>
