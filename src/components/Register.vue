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

            <el-input placeholder="********" v-model="input.password" type="password">
              <template slot="prepend">{{ $t('REG.PASSWORD_LABEL') }}</template>
            </el-input>

            <el-input placeholder="********" v-model="input.password2" type="password">
              <template slot="prepend">{{ $t('REG.PASSWORD_CHECK_LABEL') }}</template>
            </el-input>

            <br />
            <br />

            <el-input placeholder="홍길동" v-model="input.name" type="string">
              <template slot="prepend">{{ $t('REG.NAME_LABEL') }}</template>
            </el-input>

            <template>{{ $t('REG.BIRTHDAY_LABEL') }}</template>
            <el-date-picker placeholder="Pick a day" value-format="yyyy-MM-dd" v-model="input.birth" type="date">
            </el-date-picker>

            <!-- TODO: 성별 -->
            <!-- http://element.eleme.io/#/en-US/component/radio#with-borders -->

            <el-input placeholder="postcode" v-model="input.postcode" type="string" v-show="true">
              <template slot="prepend">우편번호</template>
            </el-input>
            <el-input placeholder="address" v-model="input.address" type="string" v-show="true">
              <template slot="prepend">도로명주소</template>
            </el-input>
            <el-input id="detail" placeholder="detail addr" v-model="input.address2" type="string" v-show="true">
              <template slot="prepend">상세주소</template>
            </el-input>
            <el-input type="string" v-show="true" :value="input.total_addr" disabled>
              <template slot="prepend">{{ $t('REG.ADDRESS_LABEL') }}</template>
              {{total_addr}}
            </el-input>
            <el-button type="primary" @click="execDaumPostcode()">{{ $t('REG.ADDRESS_SERACH_BUTTON') }}</el-button>

            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <el-form-item :label="$t('REG.PHONE_LABEL')" prop="phone">
              <el-input :placeholder="$t('REG.PHONE_PH')" v-model="input.phone" v-mask="['###-####-####', '###-###-####']" type="tel"></el-input>
            </el-form-item>
            <el-button type="primary" @click="dummy()">인증번호</el-button>

            <br />
            <br />

            <el-input placeholder="국어국문" v-model="input.major" type="string">
              <template slot="prepend">{{ $t('REG.MAJOR_LABEL') }}</template>
            </el-input>

            <el-form-item :label="$t('REG.BELONG_LABEL')" prop="belong">
            <el-input :placeholder="$t('REG.BELONG_PH')" v-model="input.belong" type="string"></el-input>
            </el-form-item>

            <br />
            <br />
            <!-- TODO: terms of use / privacy policy text 주루루룩 -->
            이용약관 <br />
            <!-- TODO: 이용약관에 동의 체크박스 -->
            <!-- http://element.eleme.io/#/en-US/component/checkbox#basic-usage -->


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
        birth: '1990-12-31',
        postcode: '03722',
        address: '서울 서대문구 연세로 50 (연세대학교)',
        address2: '제4 공학관 811호',
        total_addr: '',
        phone: '010-1234-1234',
        major: '컴퓨터과학',
        belong: '공과대학',
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
              const res = await authService.checkEmailDuplicated({ email: value });
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
                const errMsg = 'phone type err!'; // vm.$t('FORM.ERR_TYPE_PHONE'),
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
      },
    };
  },
  computed: {
    total_addr() {
      const vm = this;
      // eslint-disable-next-line
      vm.input.total_addr = vm.input.address + ' ' + vm.input.address2 + ' ' + vm.input.postcode;
      return vm.input.total_addr;
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
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
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
              extraAddr += (extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
            fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
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



