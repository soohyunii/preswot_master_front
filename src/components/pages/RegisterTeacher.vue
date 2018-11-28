<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        강사 수정
      </template><template v-else>
        등록하기 > 강사
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <el-form-item label="이메일">
        <el-input v-model="input.email" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="패스워드">
        <el-input v-model="input.password" class="subject-title" type="password"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="패스워드 확인">
        <el-input v-model="input.passwordConfirm" class="subject-title" type="password"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="강사이름">
        <el-input v-model="input.name" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="성별">
        <el-input v-model="input.sex" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="경력">
        <el-input v-model="input.career" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="생년월일">
        <el-input v-model="input.birth" class="subject-title" placeholder="ex) 930610"></el-input>
      </el-form-item>

      <br/><br/><br/><br/><br/>
      <el-form-item label="소속대학 선택" style="margin-top:60px;">
        <select id="uni-choice" v-model="input.choiceUni">
          <option value="">대학리스트</option>  <!-- DB에 있는 대학 리스트 가져오기 -->
          <option value="">선택사항없음</option>
        </select>
      </el-form-item>

      <el-form-item label="소속학과 선택">
        <select id="dept-choice" v-model="input.choiceDept">
          <option value="">학과리스트</option>  <!-- DB에 있는 학과 리스트 가져오기 -->
          <option value="">선택사항없음</option>
        </select>
      </el-form-item>

      <el-form-item label="주소">
        <el-input v-model="input.address" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="전화번호">
        <el-input v-model="input.phone" class="subject-title" placeholder="하이픈없이 입력"></el-input>
      </el-form-item>

      <el-form-item label="계좌번호">
        <el-input v-model="input.account" class="subject-title" placeholder="하이픈없이 입력"></el-input>
      </el-form-item>

      <el-form-item label="계좌은행">
        <el-input v-model="input.bank" class="subject-title" placeholder="은행명 입력"></el-input>
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
            강사 수정
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
  name: 'RegisterTeacher',
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
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      sex: '',
      career: '',
      birth: '',
      choiceUni: '',
      choiceDept: '',
      address: '',
      phone: '',
      account: '',
      bank: '',
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
      vm.input.email = res.data.email || vm.initialInput.email;
      vm.input.password = res.data.password || vm.initialInput.password;
      vm.input.passwordConfirm = res.data.passwordConfirm || vm.initialInput.passwordConfirm;
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.sex = res.data.sex || vm.initialInput.sex;
      vm.input.career = res.data.career || vm.initialInput.career;
      vm.input.birth = res.data.birth || vm.initialInput.birth;
      vm.input.choiceUni = res.data.choiceUni || vm.initialInput.choiceUni;
      vm.input.choiceDept = res.data.choiceDept || vm.initialInput.choiceDept;
      vm.input.address = res.data.address || vm.initialInput.address;
      vm.input.phone = res.data.phone || vm.initialInput.phone;
      vm.input.account = res.data.account || vm.initialInput.account;
      vm.input.bank = res.data.bank || vm.initialInput.bank;
      // 필수입력사항(강사코드,PW,이름,이메일) 미입력시 '*는 필수입력사항입니다 알람'
      // 패스워드와 패스워드 확인이 일치하지 않을 시 '패스워드가 일치하지 않습니다'경고알람 
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
            await classService.NNMasterputTeacher({
              id,
              ...vm.input,
            });
            vm.$router.push('/view/teacher');
          } catch (error) {
            vm.$notify({
              title: '강사 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await classService.NNMasterpostTeacher(vm.input);
            if(vm.input.email==''||vm.input.password==''||vm.input.passwordConfirm==''||vm.input.name=='') {
              vm.$notify({
                title: '강사 등록 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0, 
              });
            } else {
              // console.log(vm.input);
              // console.log('s111');
              vm.$router.push('/register/teacher/success');
              // console.log('s222');
            }
          } catch (error) {
            vm.$notify({
              title: '강사 등록 실패',
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
  column-count: 2;
} 
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
