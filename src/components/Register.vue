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
              <template slot="prepend">{{ $t('LOGIN.NAME') }}</template>
            </el-input>

            <!-- TODO: 생년월일 -->
            <!-- http://element.eleme.io/#/en-US/component/date-picker -->
            <el-input suffix-icon="el-icon-date" v-model="input.birth" type="date" format="yyyy-mm-dd">
              <template slot="prepend">{{ $t('LOGIN.BIRTH') }}</template>
            </el-input>

            <el-date-picker
              v-model="input.birth"
              type="date"
              placeholder="Pick a day">
            </el-date-picker>

            <br />
            <br />

            <!-- TODO: 주소 -->
            <!-- http://postcode.map.daum.net/guide -->
            <el-button type="primary" onclick="execDaumPostcode()">
              우편번호 찾기<br>
            </el-button>
            <el-input placeholder="우편번호" id="postcode" v-model="input.postcode" type="string">
            </el-input>
            <el-input placeholder="주소" id="address" v-model="input.address1" type="string">
            </el-input>
            <el-input placeholder="상세주소" id="address2" v-model="input.address2" type="string" v-focus="focused" @focus="focused = true" @blur="focused = false">
            </el-input>
            <el-input placeholder="주소" v-model="fullAddress" :disabled="true">
              <template slot="prepend">{{ $t('LOGIN.ADDRESS') }}</template>
            </el-input>
            <br />
            <br />
            
            <!-- TODO: 핸드폰 번호 -->
            <!-- 핸드폰 번호 인증 어떻게?? -->
            <!-- 010-1234-1234 로 포매팅도 있어야 할듯 -->
            <el-input placeholder="핸드폰 번호" v-model="input.phone" type="string" v-mask="['###-####-####','###-###-####']">
              <template slot="prepend">{{ $t('LOGIN.PHONE') }}</template>
            </el-input>
           
            <br />
            <br />
           
            <!-- TODO: 전공 -->
            <!-- Just simple input -->
            <el-input placeholder="CS" v-model="input.major" type="string">
              <template slot="prepend">{{ $t('LOGIN.MAJOR') }}</template><br />
            </el-input>

            <br />
            <br />

            <!-- TODO: 소속 -->
            <!-- Just simple input -->
            <el-input placeholder="소속" v-model="input.belong" type="string">
              <template slot="prepend">{{ $t('LOGIN.BELONG') }}</template><br />
            </el-input>

            <el-button type="primary" @click="onClick('LOGIN')">회원가입</el-button>
            <br />
            <pre>{{ input }}</pre>
          </form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  directives: { focus },
  name: 'Register',
  data() {
    return {
      focused: false,
      input: {
        email: 'adoji92@gmail.com',
        password: 'adojiadoji',
        password2: 'adojiadoji',
        name: '안동진',
        birth: '',
        postcode: '10073',
        address1: '경기 김포시 김포대로 1430 (운양동, 리버 에일린의 뜰)',
        address2: '',
        address: '',
        phone: '010-1234-5678',
        major: 'CS',
        belong: '공과대학',
      },
    };
  },
  computed: {
    fullAddress() {
      this.input.address = `${this.input.address1} ${this.input.address2} ${this.input.postcode}`;
      return this.input.address;
    },
  },
  watch: {
    focused: {
      handler() {
        this.input.postcode = document.getElementById('postcode').value;
        this.input.address1 = document.getElementById('address').value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: red;
}
</style>



