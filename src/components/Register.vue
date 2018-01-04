<template>
  <div>
    <h2>{{ $t('REG.REG_TITLE') }}</h2>
    <el-container>
      <el-row>
        <el-col>
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
              <template slot="prepend">Name</template>
            </el-input>

            <!-- TODO: 생년월일 -->
            <!-- http://element.eleme.io/#/en-US/component/date-picker -->

            <!-- TODO: 성별 -->
            <!-- http://element.eleme.io/#/en-US/component/radio#with-borders -->

            <!-- TODO: 주소 -->
            <!-- http://postcode.map.daum.net/guide -->

            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <!-- 010-1234-1234 로 포미탱도 있어야 할듯 -->

            <br />
            <br />

            <!-- TODO: 전공 -->
            <!-- Just simple input -->

            <!-- TODO: 소속 -->
            <!-- Just simple input -->

            <br />
            <br />
            <!-- TODO: terms of use / privacy policy -->
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
  name: 'Register',
  data() {
    const vm = this;
    return {
      input: {
        email: 'adoji92@gmail.com',
        password: 'adojiadoji',
        password2: 'adojiadoji',
        name: '안동진',
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
      },
    };
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



