<template>
  <div>
    <h2>{{ $t('REG.REG_TITLE') }}</h2>
    <el-container>
      <el-row>
        <el-col style="max-width: 600px;">
          <!-- TODO: change label-width according to locale
          (based on longest label length in current locale) -->
          <el-form :model="input" :rules="rules" ref="elForm" label-width="120px">
            <el-form-item :label="$t('REG.EMAIL_LABEL')" prop="email_id">
              <el-input :placeholder="$t('REG.EMAIL_PH')" v-model="input.email_id" type="email"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_LABEL')" prop="password">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password" type="password"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_CHECK_LABEL')" prop="password2">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password2" type="password"></el-input>
            </el-form-item>

            <br />
            <br />

            <el-form-item :label="$t('REG.NAME_LABEL')" prop="name">
              <el-input :placeholder="$t('REG.NAME_PH')" v-model="input.name" type="string">
              </el-input>
            </el-form-item>


            <el-form-item :label="$t('REG.BIRTHDAY_LABEL')" prop="birth">
              <el-date-picker :placeholder="$t('REG.BIRTHDAY_PH')" v-model="input.birth" type="date" id="user_birthday_input">
              </el-date-picker>
            </el-form-item>

            <!-- TODO: 성별이 클릭이 되지 않은 상태 체크 -->
            <el-form-item :label="$t('REG.SEX_LABEL')" prop="sex">
              <el-radio-group v-model="input.sex" id="user_sex_input">
                <el-radio-button label="0">{{ $t('REG.SEX_LABEL_MALE') }}</el-radio-button>
                <el-radio-button label="1">{{ $t('REG.SEX_LABEL_FEMALE') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('REG.ADDRESS_LABEL')" prop="address1">
              <el-input type="string" :placeholder="$t('REG.ADDRESS_PH')" :value="address" readonly>
              </el-input>
              <!-- TODO: Replace button position -->
              <el-button type="primary" @click="execDaumPostcode()">{{ $t('REG.ADDRESS_SEARCH_BUTTON') }}</el-button>
            </el-form-item>

            <el-form-item :label="$t('REG.ADDRESS2_LABEL')" prop="address2">
              <el-input id="detail" :placeholder="$t('REG.ADDRESS2_PH')" v-model="input.address2">
              </el-input>
            </el-form-item>


            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <el-form-item :label="$t('REG.PHONE_NUMBER_LABEL')" prop="phoneNumber">
              <el-input :placeholder="$t('REG.PHONE_NUMBER_PH')" v-model="input.phone" v-mask="['###-####-####', '###-###-####']" type="tel"></el-input>
            </el-form-item>
            <el-button type="primary" @click="dummy()">{{$t('REG.PHONE_NUMBER_VERIFY_BUTTON')}}</el-button>

            <br />
            <br />

            <el-form-item :label="$t('REG.MAJOR_LABEL')" prop="major">
              <el-input :placeholder="$t('REG.MAJOR_PH')" v-model="input.major" type="string"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.BELONG_LABEL')" prop="belong">
              <el-input :placeholder="$t('REG.BELONG_PH')" v-model="input.belong" type="string"></el-input>
            </el-form-item>

            <br />
            <br />
            <!-- TODO: terms of use / privacy policy text 주루루룩 -->
            이용약관 <br />
            <!-- TODO: 회원가입 버튼 누를 시 약관 동의 확인 필요 -->
            <!-- http://element.eleme.io/#/en-US/component/checkbox#basic-usage -->

            <el-form-item prop="checkTou">
              <el-checkbox v-model="input.checkTou" id="user_tou_input">{{ $t('REG.TOU_LABEL') }}</el-checkbox>
            </el-form-item>
            <br />
            <br />

            <el-button type="primary" @click="submitForm('elForm')">회원가입</el-button>
            <br />
            <pre>{{ input }}</pre>
          </el-form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import generateRules from '../../validations/registerValidation';
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  directives: { focus },
  name: 'Register',
  data() {
    const vm = this;
    return {
      focused: false,
      input: {
        email_id: '',
        password: '',
        password2: '',
        name: '',
        birth: '',
        postcode: '',
        address1: '', // 지역 주소
        address2: '', // 상세 주소
        phone: '',
        major: '',
        belong: '',
        sex: '0',
        checkTou: false,
      },
      rules: generateRules(vm),
    };
  },
  computed: {
    address() {
      const vm = this;
      const address = `${vm.input.address1} ${vm.input.address2} ${vm.input.postcode}`;
      return address.trim();
    },
  },
  methods: {
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
    submitForm(formName) {
      const vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            vm.$http.post('/users', {
              ...vm.input, address: vm.address,
            });
            vm.$router.push({ // LandingPage로 redirect
              name: 'LandingPage',
            });
          } catch (e) {
            throw new Error('request error');
          }
        } else {
          console.log('error submit!!'); // eslint-disable-line
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



