<template>
  <div>
    <el-container>

      <el-row>
        <el-col>
          <!-- TODO: add form html element -->
          <!-- TODO: add validation -->
          <h1>{{ $t('LOGIN.LOGIN_TITLE') }}</h1>

          <span v-if="redirectTo" style="color:red">{{ $t('LOGIN.LOGIN_REQUIRED') }}</span>

          <el-input placeholder="abc@gmail.com" v-model="input.email" type="email">
            <template slot="prepend">{{ $t('LOGIN.EMAIL_LABEL') }}</template>
          </el-input>
          <el-input placeholder="********" v-model="input.password" type="password">
            <template slot="prepend">{{ $t('LOGIN.PASSWORD_LABEL') }}</template>
          </el-input>
          <br />
          <br />
          <!-- TODO: add disabled attr according to validation -->
          <el-button
            type="primary"
            @click="onClick('LOGIN')"
          >
            {{ $t('LOGIN.LOGIN_BUTTON') }}
          </el-button>
          <el-button
            type="primary"
            @click="/* onClick('FORGOT_PASSWORD') */"
          >
            {{ $t('LOGIN.FORGOT_PASSWORD_BUTTON') }}
          </el-button>
        </el-col>
      </el-row>
    </el-container>
    jwt: {{ jwt }} <br />
    input: {{ input }} <br />
    redirectTo: {{ redirectTo }}
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
            email: vm.input.email,
            password: vm.input.email,
          });
          const loginSuccess = Math.random() < 0.5;
          if (loginSuccess && vm.redirectTo) {
            vm.$router.push(vm.redirectTo);
          }
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    openNoti() {
      this.$notify.error({
        title: 'Error',
        message: this.$t('LOGIN.LOGIN_REQUIRED'),
      });
    },
  },
  computed: {
    ...mapState('auth', ['jwt']),
    redirectTo() {
      const vm = this;
      return vm.$route.params.to;
    },
  },
  mounted() {
    if (this.redirectTo) {
      this.openNoti();
    }
  },
};
</script>
