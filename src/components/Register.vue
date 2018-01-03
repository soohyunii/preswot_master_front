<template>
  <div>
    <h2>회원가입</h2>
    <el-container>
      <el-row>
        <el-col>
          <form novalidate>
            <el-input placeholder="abc@gmail.com" v-model="input.email" type="email">
              <template slot="prepend">{{ $t('LOGIN.EMAIL') }}</template>
            </el-input>
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
          </form>
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
    };
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



