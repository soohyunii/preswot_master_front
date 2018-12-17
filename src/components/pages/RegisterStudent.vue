<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        학생 수정
      </template><template v-else>
        등록하기 > 학생
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <el-form-item label="이메일">
        <el-input v-model="input.email_id" class="subject-title"></el-input>
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

      <el-form-item label="학생이름">
        <el-input v-model="input.name" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="성별">
        <!-- <el-input v-model="input.sex" class="subject-title"></el-input> -->
        <input type="radio" id="man" value="1" v-model="input.sex" >
        <label for="man" style="margin-right:10px">남자</label>
        <input type="radio" id="woman" value="2" v-model="input.sex">
        <label for="woman">여자</label>
      </el-form-item>

      <el-form-item label="생년월일">
        <el-date-picker type="datetime" v-model="input.birth" class="subject-Date" format="yyyy-MM-dd"></el-date-picker>
        <!-- <el-input v-model="input.birth" class="subject-title" placeholder="ex) 930610"></el-input> -->
      </el-form-item>

      <br/><br/><br/><br/><br/>
      <el-form-item label="소속대학 선택" style="margin-top:60px;">
        <select id="uni-choice" v-model="input.university_name" @change="categoryChange(input.university_name)">
          <option v-for="university_name in input.university_list">{{university_name}}</option>
        </select>
      </el-form-item>

      <el-form-item label="소속학과 선택">
        <select id="dept-choice" v-model="input.department_name">
          <option value="">선택사항없음</option>  <!-- DB에 있는 학과 리스트 가져오기 -->
          <option v-for="department_name in input.department_list">{{department_name}}</option>
        </select>
      </el-form-item>

      <el-form-item label="주소">
        <el-input v-model="input.address" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="전화번호">
        <el-input v-model="input.phone" class="subject-title" placeholder="하이픈없이 입력"></el-input>
      </el-form-item>

      <el-form-item label="계좌은행">
        <el-input v-model="input.account_bank" class="subject-title" placeholder="은행명 입력"></el-input>
      </el-form-item>

      <el-form-item label="계좌번호">
        <el-input v-model="input.account_number" class="subject-title" placeholder="하이픈없이 입력"></el-input>
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
            학생 수정
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
  name: 'RegisterStudent',
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
      email_id: '',
      password: '',
      passwordConfirm: '',
      name: '',
      type: 0,
      sex: '',
      birth:new Date(),
      university_list: '',
      department_list: null,
      address: '',
      phone: '',
      account_bank: '',
      account_number: '',
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
    };
  },
  async mounted() {
    const vm = this;
    const uniNameLists = await masterService.getUniLists();
    vm.input.university_list = uniNameLists.data.map(element=>element.name);

    if (vm.isEdit) {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@is Edit@@@@@@@@@@@@@@@@@');
      const res = await masterService.getMasterUser({ email_id : vm.classId });
      console.log(vm.classId);
      console.log('res', res.data);
      vm.input.email_id = res.data.email_id || vm.initialInput.email_id;
      vm.input.password = res.data.password || vm.initialInput.password;
      /*vm.input.passwordConfirm = res.data.passwordConfirm || vm.initialInput.passwordConfirm;*/
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.sex = res.data.sex || vm.initialInput.sex;
      vm.input.type=0;
      vm.input.birth = res.data.birth || vm.initialInput.birth;
      vm.input.university_name = res.data.university_name || vm.initialInput.university_name;
      vm.input.department_name = res.data.department_name || vm.initialInput.department_name;
      vm.input.address = res.data.address || vm.initialInput.address;
      vm.input.phone = res.data.phone || vm.initialInput.phone;
      vm.input.account_bank = res.data.account_bank || vm.initialInput.account_bank;
      vm.input.account_number = res.data.account_number || vm.initialInput.account_number;
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
      return vm.$route.path.split('student/')[1].split('/edit')[0];
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
            await masterService.NNMasterputStudent({
              id,
              ...vm.input,
            });
            if(vm.input.email_id==''||vm.input.password==''||vm.input.passwordConfirm==''||vm.input.name==''){
              vm.$notify({
                title: '학생 수정 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0, 
              });
            } else if(vm.input.password!==vm.input.passwordConfirm){
              vm.$notify({
                title:'학생 수정 실패',
                message: '패스워드가 일치하는지 확인해주세요',
                type:'error',
                duration:0,
              });
            } else {
              vm.$router.push('/a/view/student');
            }
            /*vm.$router.push('/a/view/student');*/
          } catch (error) {
            vm.$notify({
              title: '학생 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await masterService.NNMasterpostStudent(vm.input);
            if(vm.input.email_id==''||vm.input.password==''||vm.input.passwordConfirm==''||vm.input.name==''){
              vm.$notify({
                title: '학생 등록 실패',
                message: '필수입력사항(*)을 모두 기재해 주세요',
                type: 'error',
                duration: 0, 
              });
            } else if(vm.input.password!==vm.input.passwordConfirm){
              vm.$notify({
                title:'학생 등록 실패',
                message: '패스워드가 일치하는지 확인해주세요',
                type:'error',
                duration:0,
              });
            } else {
              vm.$router.push('/a/register/student/success');
            }
          } catch (error) {
            vm.$notify({
              title: '학생 등록 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        }
      });
    },
    async categoryChange(university_name){
      const vm=this;
      const deptNameLists = await masterService.getDeptLists(vm.input.university_name);
      vm.input.department_list = await deptNameLists.data.map(element=>element.name);
      console.log(vm.input.department_list);
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
