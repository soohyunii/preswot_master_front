<template>
  <div>
    <h2>회원가입</h2>
    <el-container>
      <el-row>
        <el-col>
          <!-- TODO: change label-width according to locale
          (based on longest label length in current locale) -->
          <el-form :model="input" :rules="rules" ref="elForm" label-width="120px">
            <el-form-item :label="$t('LOGIN.EMAIL')" prop="email">
              <el-input placeholder="abc@gmail.com" v-model="input.email" type="email"></el-input>
            </el-form-item>
            <el-input placeholder="********" v-model="input.password" type="password">
              <template slot="prepend">{{ $t('LOGIN.PASSWORD') }}</template>
            </el-input>
            <el-input placeholder="********" v-model="input.password2" type="password">
              <template slot="prepend">{{ $t('LOGIN.PASSWORD') }} 2</template>
            </el-input>

            <br />
            <br />

            <el-input placeholder="홍길동" v-model="input.name" type="string">
              <template slot="prepend">Name</template>
            </el-input>

            <!-- TODO: 생년월일 -->
            <!-- http://element.eleme.io/#/en-US/component/date-picker -->

            <!-- TODO: 주소 -->
            <!-- http://postcode.map.daum.net/guide -->

            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <!-- 010-1234-1234 로 포미탱도 있어야 할듯 -->

            <!-- TODO: 전공 -->
            <!-- Just simple input -->

            <!-- TODO: 소속 -->
            <!-- Just simple input -->

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
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  name: 'Register',
  data() {
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
            message: 'email required', // TODO: replace
            trigger: 'change,blur',
          },
          {
            type: 'email',
            message: 'invalid email regex', // TODO: replace
            trigger: 'change,blur',
          },
          {
            validator(rule, value, callback) {
              window.setTimeout(() => {
                // TODO: replace dummy duplicated email checking
                if (value === 'adoji92@gmail.com') {
                  callback(new Error('duplicated email')); // TODO: replace
                } else {
                  callback();
                }
              }, 500);
            },
            trigger: 'blur', // change로 해놓으면 서버에 너무 많이 요청하게 됨
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



