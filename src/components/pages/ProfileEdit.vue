<template>
  <div oncontextmenu="return false">
    <el-card class="box-card" style="width: 1200px; margin: 0 auto;">
      <h1>회원정보 변경</h1>
      <br>
      <el-container>
        <el-row>
          <el-col style="max-width: 700px;">
            <el-form :model="input" :rules="rules" ref="elForm" :label-width="getLabelWidth()">

            <el-form-item label="비밀번호 변경" prop="changepw" id="changepw">
              <el-checkbox v-model="changepw"></el-checkbox>
            </el-form-item>

            <el-form-item label="비밀번호" prop="password" id="password">
              <el-input v-model="input.password" type="password" :disabled="!changepw"></el-input>
              <br />* 문자, 숫자, 특수문자를 포함한 8글자 이상의 비밀번호
            </el-form-item>

            <el-form-item label="비밀번호 확인" prop="password2" id="password2">
              <el-input v-model="input.password2" type="password" :disabled="!changepw"></el-input>
            </el-form-item>

            <br />
            <br />

            <el-form-item label="이름" prop="name" id="name">
              <el-input v-model="input.name" type="string"></el-input>
            </el-form-item>

            <el-form-item label="생년월일" prop="birth" id="birth">
              <el-date-picker v-model="input.birth" type="date" id="user_birthday_input">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="성별" prop="sex" id="sex">
              <el-radio-group v-model="input.sex" id="user_sex_input">
                <el-radio-button label="0">{{ $t('REG.SEX_LABEL_MALE') }}</el-radio-button>
                <el-radio-button label="1">{{ $t('REG.SEX_LABEL_FEMALE') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="기존주소">
              {{ input.initialaddress }}
            </el-form-item>

            <el-form-item label="주소" prop="address1" id="address1">
              <el-input type="string" v-model="input.address1" placeholder="빈칸일 경우, 변경되지 않습니다"></el-input>
              <el-button id="btn_search_address" type="primary" @click="execDaumPostcode()">주소 검색</el-button>
            </el-form-item>

            <el-form-item label="상세 주소" prop="address2" id="address2">
              <el-input id="detail" v-model="input.address2">
              </el-input>
            </el-form-item>

            <!--<el-form-item>
              {{ address }}
            </el-form-item>-->

            <el-form-item label="핸드폰 번호" prop="phone" id="phone">
              <el-input v-model="input.phone" v-mask="['###-####-####', '###-###-####']" type="tel"></el-input>
              <!--인증 부분 아직-->
              <!--<el-button type="primary" @click="dummy()">{{$t('REG.PHONE_NUMBER_VERIFY_BUTTON')}}</el-button>-->
            </el-form-item>

            <br />
            <br />

            <el-form-item label="전공" prop="major" id="major">
              <el-input v-model="input.major" type="string"></el-input>
            </el-form-item>

            <el-form-item label="소속" prop="belong" id="belong">
              <el-input v-model="input.belong" type="string"></el-input>
            </el-form-item>

            <br />
            <br />

            <el-form-item>
              <el-button id="btn_submit_register" type="primary" @click="submitForm('elForm')">변경 완료</el-button>
              <el-button @click="reset()">되돌리기</el-button>
            </el-form-item>
            <br />

          </el-form>
        </el-col>
      </el-row>
    </el-container>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import editRules from '../../validations/profileEditValidation';
import authService from '../../services/authService';
import utils from '../../utils';
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  directives: { focus },
  name: 'ProfileEdit',
  data() {
    const vm = this;
    return {
      focused: false,
      changepw: false,
      input: {
        email_id: '',
        password: '',
        password2: '',
        name: '',
        birth: '',
        postcode: '',
        address1: '', // 지역 주소
        address2: '', // 상세 주소
        initialaddress: '', // 기존 주소
        phone: '',
        major: '',
        belong: '',
        sex: '0',
      },
      rules: editRules(vm),
    };
  },
  computed: {
    ...mapState('auth', ['locale']),
    address() {
      const vm = this;
      if (vm.input.address1 === '') {
        return vm.input.initialaddress.trim();
      }
      const address = `${vm.input.address1} ${vm.input.address2} ${vm.input.postcode}`;
      return address.trim();
    },
  },
  // 페이지 로딩시 기존 회원정보를 페이지의 form에 맞춰 올림
  mounted: function () {  // eslint-disable-line
    this.$nextTick(function () {  // eslint-disable-line
      const vm = this;
      const userID = utils.getUserIdFromJwt();
      const userInfo = vm.returnUserInfo({
        userID,
      });
      userInfo.then(function(result) {  // eslint-disable-line
        vm.input.email_id = result.data.userInfo.email_id;
        vm.input.name = result.data.userInfo.name;
        vm.input.birth = result.data.userInfo.birth;
        vm.input.sex = result.data.userInfo.sex;
        vm.input.phone = result.data.userInfo.phone;
        vm.input.initialaddress = result.data.userInfo.address;
        vm.input.major = result.data.userInfo.major;
        vm.input.belong = result.data.userInfo.belong;
      });
    });
  },
  methods: {
    ...mapActions('auth', [
      'checkUserPW',
      'returnUserInfo',
    ]),
    // 프로필 수정 기능 초기화
    async reset() {
      const vm = this;
      const userID = utils.getUserIdFromJwt();
      const userInfo = vm.returnUserInfo({
        userID,
      });
      userInfo.then(function(result) {  // eslint-disable-line
        vm.input.name = result.data.userInfo.name;
        vm.input.birth = result.data.userInfo.birth;
        vm.input.sex = result.data.userInfo.sex;
        vm.input.phone = result.data.userInfo.phone;
        vm.input.initialaddress = result.data.userInfo.address;
        vm.input.major = result.data.userInfo.major;
        vm.input.belong = result.data.userInfo.belong;
      });
      vm.input.address1 = '';
      vm.input.address2 = '';
      vm.changepw = false;
      vm.input.password = '';
      vm.input.password2 = '';
    },
    execDaumPostcode() {
      const vm = this;
      new window.daum.Postcode({
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
        oncomplete(data) {
          // 각 주소의 노출 규칙에 따라 주소를 조합한다.
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
          let fullAddr = ''; // 최종 주소 변수
          let extraAddr = ''; // 조합형 주소 변수

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            fullAddr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
          if (data.userSelectedType === 'R') {
            // 법정동명이 있을 경우 추가한다.
            if (data.bname !== '') {
              extraAddr += data.bname;
            }
            // 건물명이 있을 경우 추가한다.
            if (data.buildingName !== '') {
              extraAddr +=
                extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
            fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          vm.input.postcode = data.zonecode; // 5자리 새우편번호 사용
          vm.input.address1 = fullAddr;

          // 커서를 상세주소 필드로 이동한다.
          document.getElementById('detail').focus();
        },
      }).open();
    },
    validator(formName, element) {
      const vm = this;
      let isValid = true;
      vm.$refs[formName].validateField(element, async (e) => {
        if (e) {
          vm.$scrollTo('#' + element, 500, { // eslint-disable-line
            offset: -100,
          });
          // window.console.log(e);
          isValid = false;
        }
      });
      return isValid;
    },
    async submitForm(formName) {
      const vm = this;

      if (vm.$isProd) {
        vm.$notify({
          message: 'ㅎㅎ! 막아놨음',
        });
        return;
      }
      const fieldList = [
        'password',
        'password2',
        'name',
        'birth',
        'sex',
        'address1',
        'address2',
        'phone',
        'major',
        'belong',
      ];

      let allValid = true;
      for (let i = 0; i < fieldList.length; i += 1) {
        if (!vm.validator(formName, fieldList[i])) {
          allValid = false;
          break;
        }
      }

      if (!allValid) {
        console.log('error submit!!'); // eslint-disable-line
        return;
      }
      const userID = utils.getUserIdFromJwt();
      try {
        await authService.editUser({
          userID: userID,  // eslint-disable-line
          input: {
            ...vm.input, address: vm.address,
          },
        });
        vm.$router.push({ // LandingPage로 redirect
          name: 'LandingPage',
        });
      } catch (e) {
        throw new Error('request error');
      }
    },
    getLabelWidth() {
      const vm = this;
      const labelString = [
        vm.$t('REG.EMAIL_LABEL'),
        vm.$t('REG.PASSWORD_LABEL'),
        vm.$t('REG.PASSWORD_CHECK_LABEL'),
        vm.$t('REG.NAME_LABEL'),
        vm.$t('REG.BIRTHDAY_LABEL'),
        vm.$t('REG.SEX_LABEL'),
        vm.$t('REG.ADDRESS_LABEL'),
        vm.$t('REG.ADDRESS2_LABEL'),
        vm.$t('REG.PHONE_NUMBER_LABEL'),
        vm.$t('REG.MAJOR_LABEL'),
        vm.$t('REG.BELONG_LABEL'),
        vm.$t('REG.TOU'),
      ];
      const maxLabelLength = Math.max.apply(null, labelString.map(x => x.length));

      let charPixel = 15;
      switch (vm.locale) {
        default:
        case 'ko':
          charPixel = 15;
          break;
        case 'en':
          charPixel = 8;
          break;
      }
      const width = maxLabelLength * charPixel + 'px' // eslint-disable-line
      // window.console.log(width);

      return width;
    },
  },
};
</script>