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
      <!-- <el-form-item label="그룹코드">
        <el-input v-model="input.code" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item> -->

      <el-form-item label="그룹명">
        <el-input v-model="input.name" class="subject-title"></el-input>
        &nbsp; <font color="red" size="5em">*</font>
      </el-form-item>

      <el-form-item label="소속대학 선택">
        <select id="uni-choice" v-model="input.choiceUni">
          <option value="">대학리스트</option>  <!-- DB에 있는 대학 리스트 가져오기 -->
        </select>
      </el-form-item>

      <el-form-item label="소속학과 선택">
        <select id="dept-choice" v-model="input.choiceDept">
          <option value="">학과리스트</option>  <!-- DB에 있는 학과 리스트 가져오기 -->
          <option value="">선택사항없음</option>
        </select>
      </el-form-item>

      <el-form-item label="최대 구성인원 수">
        <el-input type="number" v-model.number="input.capacity" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="강사선택">
        <table id="checkBox" v-model="input.choiceTeacher">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
          <tr>
            <th>강사이름</th>
            <th>소속학과</th>
            <th>이메일</th>
            <th><input type="checkbox"/></th> <!-- 모두 선택 체크버튼으로 만들기 -->
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>이름 리스트</td>
            <td>소속학과 리스트</td>
            <td>이메일 리스트</td>
            <td><input type="checkbox"/></td> <!-- 여기에 DB리스트 틀어감 -->
          </tr>
          <tr>
            <td>이름 리스트</td>
            <td>소속학과 리스트</td>
            <td>이메일 리스트</td>
            <td><input type="checkbox"/></td>
          </tr>
          <tr>
            <td>이름 리스트</td>
            <td>소속학과 리스트</td>
            <td>이메일 리스트</td>
            <td><input type="checkbox"/></td>
          </tr>
          </tbody>
        </table>
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
import classService from '../../services/classService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'RegisterBank',
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
      /*code: '',*/
      name: '',
      choiceUni: '',
      choiceDept: '',
      capacity: 0,
      choiceTeacher: '',
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
      // vm.input.code = res.data.code || vm.initialInput.code;
      vm.input.name = res.data.name || vm.initialInput.name;
      vm.input.choiceUni = res.data.choiceUni || vm.initialInput.choiceUni;
      vm.input.choiceDept = res.data.choiceDept || vm.initialInput.choiceDept;
      vm.input.capacity = res.data.capacity || vm.initialInput.capacity;
      vm.input.choiceTeacher = res.data.choiceTeacher || vm.initialInput.choiceTeacher;

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
            await classService.NNMasterputBank({
              id,
              ...vm.input,
            });
            vm.$router.push('/view/bank');
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
            await classService.NNMasterpostBank(vm.input);
            // if(vm.input.code==''||vm.input.name==''){
              if(vm.input.name==''){
              vm.$notify({
                title: '강의은행그룹 등록 실패',
                message: '필수입력사항(*)을 기재해 주세요',
                type: 'error',
                duration: 0,
              });
            } else {
              vm.$router.push('/register/bank/success');
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
#checkBox tbody {
  width:100%;
  height:300px;
  overflow:auto;
  display:block;
}
#checkBox thead {
  width:100%;
  background-color: #A2A3A5;
  display:block;
}
#checkBox {
  border-collapse: collapse;
  border:1px solid #dcdfe6;
}
#checkBox tr:hover {
  background-color: #EFEEEF;
}
#checkBox thead th:nth-of-type(1) {
  background-color: #A2A3A5;
  padding: 5px 10px 5px 20px;
  text-align:center;
  width:70px;
}
#checkBox thead th:nth-of-type(2) {
  background-color: #A2A3A5;
  padding: 5px 0 5px 10px;
  text-align:center;
  width:200px;
}
#checkBox thead th:nth-of-type(3) {
  background-color: #A2A3A5;
  padding: 5px 10px 5px 0;
  text-align:center;
  width:120px;
}
#checkBox thead th:nth-of-type(4) {
  background-color: #A2A3A5;
  padding: 5px 10px 5px 10px;
  text-align:center;
  width:30px;
}
#checkBox tbody td:nth-of-type(1) {
  padding: 5px 10px 5px 20px;
  text-align:center;
  width:70px;
}
#checkBox tbody td:nth-of-type(2) {
  padding: 5px 0 5px 10px;
  text-align:center;
  width:200px;
}
#checkBox tbody td:nth-of-type(3) {
  padding: 5px 10px 5px 0;
  text-align:center;
  width:120px;
}
#checkBox tbody td:nth-of-type(4) {
  padding: 5px 10px 5px 10px;
  text-align:center;
  width:30px;
}
</style>
