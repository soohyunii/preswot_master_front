<template>
  <div>
    <el-container>

      <el-row>
        <el-col>
          <!-- TODO: add form html element -->
          <!-- TODO: add validation -->
          <h1>{{ $t('LOGIN.LOGIN_TITLE') }}</h1>

          <el-input placeholder="abc@gmail.com" v-model="input.email" type="email">
            <template slot="prepend">{{ $t('LOGIN.EMAIL') }}</template>
          </el-input>
          <el-input placeholder="********" v-model="input.password" type="password">
            <template slot="prepend">{{ $t('LOGIN.PASSWORD') }}</template>
          </el-input>
          <!-- TODO: add disabled attr according to validation -->
          <el-button type="primary" @click="onClick('LOGIN')">{{ $t('LOGIN.LOGIN_TITLE') }}</el-button>
        </el-col>
      </el-row>
    </el-container>
    jwt: {{ jwt }} <br />
    input: {{ input | json }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      input: {
        email: 'adoji92@gmail.com',
        password: 'adojiadoji',
      },
    };
  },
  methods: {
    ...mapActions('auth', [
      'reqLogin',
    ]),
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'LOGIN': {
          this.reqLogin({
            email: vm.inputEmail,
            password: vm.inputPassword,
          });
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
  },
  computed: {
    ...mapState('auth', ['jwt']),
  },
};
</script>
