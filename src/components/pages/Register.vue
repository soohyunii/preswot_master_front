<template>
  <div class="wrapper">
    <el-container>
      <el-row>
        <el-col style="max-width: 700px;">
          <el-form :model="input" :rules="rules" ref="elForm" :label-width="getLabelWidth()">
            <el-form-item>
              <h1>{{ $t('REG.REG_TITLE') }}</h1>
            </el-form-item>
            <el-form-item :label="$t('REG.EMAIL_LABEL')" prop="email_id" id="email_id">
              <el-input :placeholder="$t('REG.EMAIL_PH')" v-model="input.email_id" type="email"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_LABEL')" prop="password" id="password">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password" type="password"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_CHECK_LABEL')" prop="password2" id="password2">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password2" type="password"></el-input>
            </el-form-item>

            <br />
            <br />

            <el-form-item :label="$t('REG.NAME_LABEL')" prop="name" id="name">
              <el-input :placeholder="$t('REG.NAME_PH')" v-model="input.name" type="string">
              </el-input>
            </el-form-item>


            <el-form-item :label="$t('REG.BIRTHDAY_LABEL')" prop="birth" id="birth">
              <el-date-picker :placeholder="$t('REG.BIRTHDAY_PH')" v-model="input.birth" type="date" id="user_birthday_input">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('REG.SEX_LABEL')" prop="sex" id="sex">
              <el-radio-group v-model="input.sex" id="user_sex_input">
                <el-radio-button label="0">{{ $t('REG.SEX_LABEL_MALE') }}</el-radio-button>
                <el-radio-button label="1">{{ $t('REG.SEX_LABEL_FEMALE') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('REG.ADDRESS_LABEL')" prop="address1" id="address1">
              <el-input type="string" :placeholder="$t('REG.ADDRESS_PH')" :value="address" readonly></el-input>
              <el-button type="primary" @click="execDaumPostcode()">{{ $t('REG.ADDRESS_SEARCH_BUTTON') }}</el-button>
            </el-form-item>

            <el-form-item :label="$t('REG.ADDRESS2_LABEL')" prop="address2" id="address2">
              <el-input id="detail" :placeholder="$t('REG.ADDRESS2_PH')" v-model="input.address2">
              </el-input>
            </el-form-item>


            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <el-form-item :label="$t('REG.PHONE_NUMBER_LABEL')" prop="phoneNumber" id="phoneNumber">
              <el-input :placeholder="$t('REG.PHONE_NUMBER_PH')" v-model="input.phoneNumber" v-mask="['###-####-####', '###-###-####']" type="tel"></el-input>
              <el-button type="primary" @click="dummy()">{{$t('REG.PHONE_NUMBER_VERIFY_BUTTON')}}</el-button>
            </el-form-item>

            <br />
            <br />

            <el-form-item :label="$t('REG.MAJOR_LABEL')" prop="major" id="major">
              <el-input :placeholder="$t('REG.MAJOR_PH')" v-model="input.major" type="string"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.BELONG_LABEL')" prop="belong" id="belong">
              <el-input :placeholder="$t('REG.BELONG_PH')" v-model="input.belong" type="string"></el-input>
            </el-form-item>

            <br />
            <br />

            <!-- TODO: terms of use / privacy policy text 주루루룩 -->
            <el-form-item :label="$t('REG.TOU')" prop="checkTou" id="checkTou">
              <div class="tos">
                <p>
                  이용 약관(영어: Terms of service terms of use이나
                  terms and conditions으로도 알려짐,
                  줄여서 ToS 또는 TOS라고 부르기도 함)은 서비스를
                  이용하기 위해 동의해야만 하는 규칙이다.
                </p>
                <p>
                  돈데기리기리 돈데기리기리 돈데돈데돈데 돈데크만
                  카피카피 룸룸 카피카피 룸룸
                  카피카피 룸룸 카피카피 룸룸
                </p>
              </div>
              <el-checkbox v-model="input.checkTou" id="user_tou_input">{{ $t('REG.TOU_LABEL') }}</el-checkbox>
            </el-form-item>

            <br />

            <el-form-item>
              <el-button type="primary" @click="submitForm('elForm')">회원가입</el-button>
            </el-form-item>
            <br />

          </el-form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import generateRules from '../../validations/registerValidation';
import authService from '../../services/authService';
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
        phoneNumber: '',
        major: '',
        belong: '',
        sex: '0',
        checkTou: false,
      },
      rules: generateRules(vm),
    };
  },
  computed: {
    ...mapState('auth', ['locale']),
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
      const fieldList = [
        'email_id',
        'password',
        'password2',
        'name',
        'birth',
        'sex',
        'address1',
        'address2',
        'phoneNumber',
        'major',
        'belong',
        'checkTou',
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
      try {
        await authService.register({
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

<style lang="scss" scoped>
.el-input {
  width: 400px;
}

.el-button {
  margin-left: 10px;
}

.tos {
  background-color: white;
  border-radius: 4px;
  padding: 10px;
}
</style>



