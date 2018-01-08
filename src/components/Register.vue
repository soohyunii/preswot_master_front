<template>
  <div>
    <h2>{{ $t('REG.REG_TITLE') }}</h2>
    <el-container>
      <el-row>
        <el-col style="max-width: 600px;">
          <!-- TODO: change label-width according to locale
          (based on longest label length in current locale) -->
          <el-form :model="input" :rules="rules" ref="elForm" label-width="120px">
            <el-form-item :label="$t('REG.EMAIL_LABEL')" prop="email">
              <el-input :placeholder="$t('REG.EMAIL_PH')" v-model="input.email" type="email"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_LABEL')" prop="password">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password" type="password"></el-input>
            </el-form-item>

            <el-form-item :label="$t('REG.PASSWORD_CHECK_LABEL')" prop="password2">
              <el-input :placeholder="$t('LOGIN.PASSWORD_PH')" v-model="input.password2" type="password"></el-input>
            </el-form-item>

            <br />
            <br />

            <el-input placeholder="홍길동" v-model="input.name" type="string">
              <template slot="prepend">{{ $t('REG.NAME_LABEL') }}</template>
            </el-input>

            <el-form-item :label="$t('REG.BIRTHDAY_LABEL')" prop="birthday">
              <el-date-picker :placeholder="$t('REG.BIRTHDAY_PH')" v-model="input.birthday" type="date" id="user_birthday_input">
              </el-date-picker>
            </el-form-item>

            <br />
            <br />

            <!-- TODO: 성별이 클릭이 되지 않은 상태 체크 -->
            <el-form-item :label="$t('REG.SEX_LABEL')" prop="sex">
              <el-radio-group v-model="input.sex" id ="user_sex_input">
                <el-radio-button label="male" >{{ $t('REG.SEX_LABEL_MALE') }}</el-radio-button>
                <el-radio-button label="female" >{{ $t('REG.SEX_LABEL_FEMALE') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('REG.ADDRESS_LABEL')" prop="address">
              <el-input type="string" :placeholder="$t('REG.ADDRESS_PH')" :value="combinedAddress" readonly>
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
            <el-form-item :label="$t('REG.PHONE_LABEL')" prop="phone">
              <el-input :placeholder="$t('REG.PHONE_PH')" v-model="input.phone" v-mask="['###-####-####', '###-###-####']" type="tel"></el-input>
            </el-form-item>
            <el-button type="primary" @click="dummy()">{{$t('REG.PHONE_VERIFY_BUTTON')}}</el-button>

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

<<<<<<< HEAD
            <el-form-item prop="checkTOU">
              <el-checkbox v-model="input.checkTOU" id ="user_TOU_input">{{ $t('REG.TOU_LABEL') }}</el-checkbox>
            </el-form-item>
            <br />
            <br />
=======
            <!-- <el-input type="tel" v-mask="['###-####-####','###-###-####']" v-model="input.phone" placeholder="핸드폰 번호">
              <template slot="prepend">{{ $t('LOGIN.PHONE') }}</template>
            </el-input> -->
>>>>>>> master

            <el-button type="primary" @click="onClick('LOGIN')">회원가입</el-button>
            <br />
            <pre>{{ input }}</pre>
          </el-form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import authService from '../services/auth';
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
        email: 'adoji92@gmail.com',
        password: 'adojiadoji',
        password2: 'adojiadoji',
        name: '안동진',
        birthday: '',
        postcode: '',
        address: '', // 지역 주소
        address2: '', // 상세 주소
        phone: '010-1234-1234',
        major: '컴퓨터과학',
        belong: '공과대학',
        sex: '',
        checkTOU: false,
      },
      rules: {
        email: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            type: 'email',
            message: vm.$t('FORM.ERR_TYPE_EMAIL'),
            trigger: 'change,blur',
          },
          {
            async validator(rule, value, callback) {
              // TODO: try catch
              const res = await authService.checkEmailDuplicated({
                email: value,
              });
              if (res.duplicated) {
                const errMsg = vm.$t('REG.ERR_DUPLICATED_EMAIL');
                callback(new Error(errMsg));
              } else {
                callback();
              }
            },
            trigger: 'blur', // change 추가하면 서버에 너무 많이 요청하게 됨
          },

        ],
        password: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              const checkNumber = value.search(/[0-9]/g);
              const checkEnglish = value.search(/[a-z]/ig);
              if (!vm.input.password.match(/^[A-Za-z0-9]{10,50}$/)) {
                callback(new Error(vm.$t('FORM.ERR_PASSWORD_LENGTH')));
              } else if (checkNumber < 0 || checkEnglish < 0) {
                callback(new Error(vm.$t('FORM.ERR_TYPE_PASSWORD')));
              } else if (vm.input.password2 !== '') {
                vm.$refs.elForm.validateField('password2');
              }
              callback();
            },
            trigger: 'change,blur',
          },
        ],
        password2: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              if (value !== vm.input.password) {
                callback(new Error(vm.$t('LOGIN.ERR_PASSWORD_MATCH')));
              } else {
                callback();
              }
            },
            trigger: 'change,blur',
          },
        ],
        sex: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              // console.log(value.match); // type of `value` = Date, not String
              window.setTimeout(() => {
                const strValue = document.getElementById('user_sex_input').value;
                if (strValue.value === null) {
                  const errMsg = vm.$t('REG.ERR_SEX_REQUIRED');
                  callback(new Error(errMsg));
                } else {
                  callback();
                }
              }, 500);
            },
            trigger: 'change',
          },
        ],
        checkTOU: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              // console.log(value.match); // type of `value` = Date, not String
              window.setTimeout(() => {
                const strValue = document.getElementById('user_TOU_input').value;
                if (strValue.value === false) {
                  const errMsg = vm.$t('REG.ERR_TOU_REQUIRED');
                  callback(new Error(errMsg));
                } else {
                  callback();
                }
              }, 500);
            },
            trigger: 'change',
          },
        ],
        phone: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              const pattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
              if (!pattern.test(value)) {
                const errMsg = vm.$t('FORM.ERR_TYPE_PHONE');
                callback(new Error(errMsg));
              } else {
                callback();
              }
            },
            trigger: 'change,blur',
          },
        ],
        belong: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
        ],
        birthday: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              // console.log(value.match); // type of `value` = Date, not String
              window.setTimeout(() => {
                const strValue = document.getElementById('user_birthday_input').value;
                if (strValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
                  callback();
                } else {
                  const errMsg = vm.$t('FORM.ERR_TYPE_DATE');
                  callback(new Error(errMsg));
                }
              }, 500);
            },
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
        ],
        address2: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
        ],
        major: [
          {
            required: true,
            message: vm.$t('FORM.ERR_REQUIRED'),
            trigger: 'change,blur',
          },
        ],
      },
    };
  },
  computed: {
    combinedAddress() {
      const vm = this;
      const combinedAddress = `${vm.input.address} ${vm.input.address2} ${vm.input.postcode}`;
      return combinedAddress.trim();
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
          vm.input.address = fullAddr;

          // 커서를 상세주소 필드로 이동한다.
          document.getElementById('detail').focus();
        },
      }).open();
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



