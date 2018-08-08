<template>
  <div oncontextmenu="return false">
    <el-card class="box-card" style="width: 600px; margin: 0 auto;">
      <h1>회원정보 수정</h1>
      <br>

      <div>
        <h3>비밀번호를 한번 더 입력해 주세요.</h3>
        <el-form :model="input" :label-position="left" label-width="100px">
          <el-form-item label="Password :" prop="pw">
            <el-input type="password" v-model="input.pw" clearable auto-complete="false"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">확인</el-button>
            <el-button @click="resetForm()">취소</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      input: {
        pw: '',
      },
    };
  },
  methods: {
    ...mapActions('auth', [
      'returnUserInfo',
      'checkUserPW',
    ]),
    async submitForm() {
      const vm = this;
      try {
        await vm.checkUserPW({
          password: vm.input.pw,
        });
        vm.$router.push({
          name: 'ProfileEdit',
        });
      } catch (error) {
        vm.$notify({
          title: 'Error',
          message: '비밀번호가 올바르지 않습니다',
          type: 'error',
          duration: 0,
        });
        vm.input.pw = '';
      }
    },
    resetForm() {
      const vm = this;
      vm.$router.push({
        name: 'LandingPage',
      });
    },
  },
};
</script>