<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        대학 수정
      </template><template v-else>
        등록하기 > 대학 
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">

      <el-form-item label="대학 코드">
        <el-input v-model="input.code" class="subject-title"></el-input> &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="대학명">
        <el-input v-model="input.name" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="주소">
        <el-input v-model="input.address" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="담당자">
        <el-input v-model="input.manager_name" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="메일주소">
        <el-input v-model="input.manager_email" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="전화번호">
        <el-input v-model="input.manager_phone_number" class="subject-title" placeholder="하이픈없이 입력"></el-input>
      </el-form-item>

      <el-form-item>
        
        <br/>
        <el-button
          type="primary"
          @click="onSubmit"
          class="subject-btn"
        >
          <template v-if="isEdit">
            대학 수정
          </template><template v-else>
            등록하기
          </template>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import masterService from '../../services/masterService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'RegisterUni',
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
      code: '',
      name: '',
      address: '',
      manager_name: '',
      manager_email: '',
      manager_phone_number: '',
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput), 
    };
  },
  async mounted() {
    const vm = this;
    if (vm.isEdit) {
      const res = await masterService.getMasterUni({ name: vm.uniName });
      vm.input.code = res.data.code || vm.initialInput.code;
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.address = res.data.address || vm.initialInput.address;
      vm.input.manager_name = res.data.manager_name || vm.initialInput.manager_name;
      vm.input.manager_email = res.data.manager_email || vm.initialInput.manager_email;
      vm.input.manager_phone_number = res.data.manager_phone_number || vm.initialInput.manager_phone_number;
    }
  },
  computed: {
    isEdit() {
      const vm = this;
      return vm.$route.fullPath.includes('/edit');
    },
    uniName() {
      const vm = this;
      return vm.$route.path.split('a/')[1].split('/edit')[0];
    },
  },
  methods: {
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false인 경우에 notify
        if (vm.isEdit) {
          const id = vm.uniName;
          const res = await masterService.getMasterUni({ name: vm.uniName });
          const old_name = res.data.name;
          try {
            await masterService.NNMasterputUni({
              id,
              old_name,
              ...vm.input,
            });
            vm.$router.push('/a/view/uni');
          } catch (error) {
            vm.$notify({
              title: '대학 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await masterService.NNMasterpostUni(vm.input);
            if (vm.input.code == '' || vm.input.name == '') {
              vm.$notify({
                title: '대학 등록 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0,
              });
            } else {
              vm.$router.push('/a/register/uni/success');
            }
          } catch (error) {
            if(error=='Error: Request failed with status code 500') {
              vm.$notify({
              title: '대학등록 실패',
              message: '대학코드나 대학명이 중복되었는지 확인해주세요',
              type: 'error',
              duration: 0,
              });
            } else {
              vm.$notify({
              title: '대학등록 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
              });
            }
          }
        }
      });
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
</style>
