<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 과목</h2>
    <div id="choicLists">
      <el-form>
        <el-select placeholder="대학선택" v-model="chosen" @change="categoryChange()" style="width:200px; top:20px">
          <el-option 
            v-for="uniName in uniNameList"
            :key="uniName"
            :label="uniName"
            :value="uniName">
          </el-option>
        </el-select>
      </el-form>
      <el-form style="position: relative; left:220px; top:-60px;">
        <el-select placeholder="학과선택" v-model="dept_chosen" @change="showChange()" style="width:200px; top:20px">
          <el-option 
            v-for="deptName in deptNameList"
            :key="deptName"
            :label="deptName"
            :value="deptName">
          </el-option>
        </el-select>
      </el-form>
      <el-form id="semester" style="position: relative; left:440px; top:-120px; width:500px">
        <el-date-picker 
          v-model="date_from_chosen"
          type="date" 
          placeholder="시작일 선택"
          style="width:150px; top:20px;">
        </el-date-picker>
        <el-date-picker 
          v-model="date_to_chosen" 
          type="date"
          placeholder="종료일 선택"
          style="width:150px; top:20px;"
          @change="toChange()"
          >
        </el-date-picker>
        <el-checkbox v-model="checked" @change="isActiveChange()" :disabled="chosen==undefined">활성화과목만 조회</el-checkbox>
      </el-form>
    </div>
    <div style="margin-top: -70px;"/>
    <master-class-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
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
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
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
      uniNameList: [],
      deptNameList: [],
      semesterNameList: [],
      teacherNameList: [],
      chosen: undefined,
      dept_chosen: undefined,
      semester: '',
      date_from_chosen: undefined,
      date_to_chosen: undefined,
      checked: undefined,
    };
  },
  computed: {
    ...mapState('NNclass', ['studyingClassList']),
  },
  async mounted() {
    const vm = this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.uniNameList = uniNameLists.data.map(element => element.name);
  },
  watch: {
    list: async function list(val, oldVal) {
      const vm = this;
      if (vm.checked === false) {
        vm.checked = undefined;
      }
      const res = await masterService.getClassLists({
        university_name: vm.chosen,
        department_name: vm.dept_chosen,
        end_date_from: vm.date_from_chosen,
        end_date_to: vm.date_to_chosen,
        isActive: vm.checked,
      });
      const res2 = await masterService.getClassLists({
        university_name: vm.chosen,
        department_name: vm.dept_chosen,
        end_date_from: vm.date_from_chosen,
        end_date_to: vm.date_to_chosen,
        isActive: !vm.checked,
      });
      if (vm.checked === undefined) {
        for (let i = 0; i < res.data.length; i += 1) {
          for (let j = 0; j < res.data[i].users.length; j += 1) {
            if (res.data[i].users[j].user_class.role === 'teacher'
              && res.data[i].isActive === false) {
              const teacherNameTemp = await masterService.getMasterUser({
                email_id: res.data[i].users[j].email_id,
              });
              vm.teacherNameList[i] = teacherNameTemp.data.name;
              vm.list[i].teacher_email_id = vm.teacherNameList[i];
            }
          }
          /* TODO : 강사가 여러명일 경우를 해결 못 함 + 활성화 과목일 때 */
        }
      } else {
        for (let i = 0; i < res2.data.length; i += 1) {
          if (res2.data[i].teacher_email_id !== null) {
            const teacherNameTemp = await masterService.getMasterUser({
              email_id: res2.data[i].teacher_email_id });
            vm.teacherNameList[i] = teacherNameTemp.data.name;
            vm.list[i].teacher_email_id = vm.teacherNameList[i];
          }
        }
      }
      for (let i = 0; i < res.data.length; i += 1) {
        if (vm.checked === undefined) {
          if (res.data[i].isActive === true) {
            vm.list[i].isActive = '비활성화';
            vm.list[i].teacher_email_id = '-';
            vm.list[i].start_date = '-';
            vm.list[i].end_date = '-';
          } else {
            vm.list[i].isActive = '활성화';
          }
        }
      }
      for (let i = 0; i < res2.data.length; i += 1) {
        if (vm.checked === true) {
          vm.list[i].isActive = '활성화';
        }
      }
    },
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
          vm.$router.push({ path: '/a/view/class', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    async categoryChange() {
      const vm = this;
      const deptNameLists = await masterService.getDeptLists({
        university_name: vm.chosen,
        category: undefined,
      });
      vm.deptNameList = deptNameLists.data.map(element => element.name);
      const res = await masterService.getClassLists({ university_name: vm.chosen });
      if (vm.chosen !== undefined && vm.dept_chosen !== undefined) {
        vm.dept_chosen = undefined;
      }
      vm.list = res.data;
    },
    async showChange() {
      const vm = this;
      const res = await masterService.getClassLists({
        university_name: vm.chosen,
        department_name: vm.dept_chosen,
      });
      vm.list = res.data;
    },
    async toChange() {
      const vm = this;
      const res = await masterService.getClassLists({
        university_name: vm.chosen,
        department_name: vm.dept_chosen,
        end_date_from: vm.date_from_chosen,
        end_date_to: vm.date_to_chosen,
      });
      vm.list = res.data;
    },
    async isActiveChange() {
      const vm = this;
      if (vm.checked === false) {
        const res = await masterService.getClassLists({
          university_name: vm.chosen,
          department_name: vm.dept_chosen,
          end_date_from: vm.date_from_chosen,
          end_date_to: vm.date_to_chosen,
          isActive: undefined,
        });
        vm.list = res.data;
      } else {
        const res = await masterService.getClassLists({
          university_name: vm.chosen,
          department_name: vm.dept_chosen,
          end_date_from: vm.date_from_chosen,
          end_date_to: vm.date_to_chosen,
          isActive: !vm.checked,
        });
        vm.list = res.data;
      }
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
  .el-checkbox{
    position: relative;
    top:17px;
    left:17px;
  }
}
</style>

