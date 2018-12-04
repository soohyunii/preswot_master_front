<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        학과 수정
      </template><template v-else>
        등록하기 > 학과 
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <el-form-item label="대학선택">
        <select id="uni-choice" v-model="input.choiceUni">
          <option value=""> 대학리스트</option>  <!-- DB에 있는 대학 리스트 가져오기 --> 
        </select> &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="학과코드">
        <el-input v-model="input.code" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="학과명">
        <el-input v-model="input.name" class="subject-title"></el-input>&nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="분야">
        <el-input v-model="input.fields" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="학과 담당자">
        <el-input v-model="input.manager" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="학과 대표 이메일">
        <el-input v-model="input.email" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="학과 전화번호">
        <el-input v-model="input.phone" class="subject-title" placeholder="하이픈없이 입력"></el-input>
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
            학과 수정
          </template><template v-else>
            등록하기
          </template>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import classService from '../../services/classService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'RegisterDept',
  async created() {
    const vm = this;
    // 학생이 url로 접근하는 경우 방지
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
      choiceUni: '',
      code: '',
      name: '',
      fields: '',
      manager: '',
      email: '',
      phone: '',
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
    };
  },
  async mounted() {
    const vm = this;
    if (vm.isEdit) {
      const res = await classService.getClass({ id: vm.classId });
      // console.log('res', res.data);
      vm.input.choiceUni = res.data.choiceUni || vm.initialInput.choiceUni;
      vm.input.code = res.data.code || vm.initialInput.code;
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.fields = res.data.fields || vm.initialInput.fields;
      vm.input.manager = res.data.manager || vm.initialInput.manager;
      vm.input.email = res.data.email || vm.initialInput.email;
      vm.input.phone = res.data.phone || vm.initialInput.phone;
      // 대학선택, 학과코드, 학과명 미입력시 '*는 필수입력사항입니다 알람'
    }
  },
  computed: {
    isEdit() {
      const vm = this;
      return vm.$route.fullPath.includes('/edit');
    },
    classId() {
      const vm = this;
      return vm.$route.path.split('class/')[1].split('/edit')[0];
    },
  },
  methods: {
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // console.log('valid,', valid);
        // console.log('fields', fields);
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false인 경우에 notify
        if (vm.isEdit) {
          const id = vm.classId;
          // TODO: wrap with try catch
          try {
            await classService.NNMasterputDept({
              id,
              ...vm.input,
            });
            vm.$router.push('/view/dept');
          } catch (error) {
            vm.$notify({
              title: '학과 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await classService.NNMasterpostDept(vm.input);
            if(vm.input.choiceUni=='' || vm.input.code=='' || vm.input.name=='') {
              vm.$notify({
                title: '학과 등록 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0, 
              });
            } else {
              vm.$router.push('/register/dept/success');
            }
          } catch (error) {
            vm.$notify({
              title: '학과 등록 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
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
