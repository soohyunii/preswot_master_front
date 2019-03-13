<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        강의은행그룹 수정
      </template><template v-else>
        등록하기 > 강의은행그룹
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <el-form-item label="그룹명">
        <el-input v-model="input.name" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="소속대학 선택">
        <el-select id="uni-choice" v-model="input.university_name" @change="categoryChange(input.university_name)">
          <el-option 
            v-for="university_name in input.university_list"
            :key="university_name"
            :label="university_name"
            :value="university_name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="소속학과 선택">
        <el-select id="dept-choice" v-model="input.department_name" :disabled="input.boolean">
          <el-option 
            v-for="department_name in input.department_list"
            :key="department_name"
            :label="department_name"
            :value="department_name">
          </el-option>
        </el-select>
        <el-checkbox v-model="input.checked" style="margin-left:20px;" @change="input.boolean=input.checked">소속 없음</el-checkbox>
      </el-form-item>
      <el-form-item label="강사선택">
        
        <el-table
          :data="input.items"
          style="width: 470px"
          @selection-change="handleSelectionChange">
          <el-table-column
            label="강사이름"
            prop="name"
            width="100">
          </el-table-column>
          <el-table-column
            label="소속학과"
            prop="department_name"
            width="140">
          </el-table-column>
          <el-table-column
            label="이메일"
            prop="email_id"
            width="180">
          </el-table-column>
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
        </el-table>
        
      
      </el-form-item>

      <el-form-item class="keywords">
         <el-tag
          :key="index"
          v-for="(items, index) in input.email_items"
          v-model="input.email_id"> 
            {{items.name}} / {{items.department_name}} / {{items.email_id}} 
        </el-tag>
      </el-form-item>
    
      <el-form-item>
        <!-- TODO: use button loading -->
        <br/>
        <el-button
          type="primary"
          @click="onSubmit"
          class="subject-btn"
        >
          <template v-if="isEdit">
            강의은행그룹 수정
          </template><template v-else>
            등록하기
          </template>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import masterService from '../../services/masterService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'RegisterBank',
  async created() {
    const vm = this;
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }
  },
  data() {
    const initialInput = {
      name: '',
      university_name: '',
      department_name: '',
      capacity: 0,
      type: 1,
      choiceTeacher: '',
      university_list: [],
      department_list: [],
      items: [],
      email_items: [],
      email_id: [],
      email_id_list: [],
      checkedbox: false,
      booleantag: false,
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput),
      multipleSelection: [],
      tagSelection: [],
    };
  },
  async mounted() {
    const vm = this;
    const uniNameLists = await masterService.getUniNameLists();
    vm.input.university_list = uniNameLists.data.map(element => element.name);
    if (vm.isEdit) {
      const res = await masterService.getMasterBank({ group_id: vm.groupId });
      vm.input.name = res.data.name || vm.initialInput.name;
    }
  },
  computed: {
    isEdit() {
      const vm = this;
      return vm.$route.fullPath.includes('/edit');
    },
    groupId() {
      const vm = this;
      return vm.$route.path.split('bank/')[1].split('/edit')[0];
    },
  },
  methods: {
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        if (vm.isEdit) {
          const id = vm.groupId;
          // TODO: wrap with try catch
          try {
            if (vm.input.name === '') {
              vm.$notify({
                title: '강의은행그룹 수정 실패',
                message: '필수입력사항(*)을 기재해 주세요',
                type: 'error',
                duration: 0,
              });
            } else {
              await masterService.NNMasterputBank({
                group_id: id,
                university_name: vm.input.university_name,
                department_name: vm.input.department_name,
                new_name: vm.input.name,
                email_id_list: vm.tagSelection,
              });
              vm.$router.push('/a/view/bank');
            }
          } catch (error) {
            vm.$notify({
              title: '강의은행그룹 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await masterService.NNMasterpostBank({
              university_name: vm.input.university_name,
              department_name: vm.input.department_name,
              name: vm.input.name,
              email_id_list: vm.tagSelection,
            });
            if (vm.input.name === '') {
              vm.$notify({
                title: '강의은행그룹 등록 실패',
                message: '필수입력사항(*)을 기재해 주세요',
                type: 'error',
                duration: 0,
              });
            } else {
              vm.$router.push('/a/register/bank/success');
            }
          } catch (error) {
            vm.$notify({
              title: '강의은행그룹 등록 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        }
      });
    },
    async categoryChange(university_name) {
      const vm = this;
      const deptNameLists = await masterService.getDeptLists({
        university_name: vm.input.university_name,
        category: undefined,
      });
      vm.input.department_list = await deptNameLists.data.map(element => element.name);
      vm.input.department_name = null;
      const itemLists = await masterService.getUserLists(1,
        vm.input.university_name,
        vm.input.department_name,
        );
      for (let i = 0; i < itemLists.data.length; i += 1) {
        if (itemLists.data[i].department_name == null) {
          itemLists.data[i].department_name = '소속 없음';
        }
      }
      vm.input.items = itemLists.data;
    },
    selectClose(items) {
      const vm = this;
      const itemName = vm.input.email_items.splice(vm.input.items, 1);
    },
    handleSelectionChange(val) {
      const vm = this;
      vm.tagSelection = [];
      vm.multipleSelection = val;
      vm.input.email_items = val;
      for (let i = 0; i < val.length; i += 1) {
        vm.tagSelection[i] = val[i].email_id;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_class_new_wrapper {
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
    margin-left : 7px;
    margin-bottom : 50px;
  }
  .el-form-item__label {
    font-size: 30px;
  }
  .elForm-label el-form-item{
    text-align : left;
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
  }
  .subject-title{
    width: 300px;
    height: 40px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #dcdfe6;
    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }
  .subject-btn{
    position: relative;
    top:65%;
    width: 300px;
    height: 40px;
    border-radius: 3px;
    background-color: #1989fa;
    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }
}
.keywords{
  position: absolute;
  align:right;
  width: 700px;
  top:44%;
  left:48%;
}
</style>
