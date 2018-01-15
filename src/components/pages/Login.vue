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
          try {
            await vm.reqLogin({
              email: vm.input.email,
              password: vm.input.email,
            });
            vm.openNoti('success', 'Login Success !!', 'Success');
            if (vm.redirectTo) {
              // jwt 업데이트 후 페이지 이동 이루어지도록
              vm.$router.push(vm.redirectTo);
            }
          } catch (error) {
            // 로그인 실패 시 ( jwt 값 갱신 실패 시 )
            vm.openNoti('error', 'Login Failed !!');
            window.console.error(error);
          }
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    openNoti(type, message, title) {
      const vm = this;
      switch (type) {
        case 'success':
        case 'warning':
          vm.$notify({
            title,
            message,
            type,
          });
          break;
        default :
        case 'error' : {
          vm.$notify.error({
            title: 'Error',
            message,
          });
          break;
        }
      }
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
    const vm = this;
    if (vm.redirectTo) {
      vm.openNoti('warning', vm.$t('LOGIN.LOGIN_REQUIRED'), 'Warning');
    }
  },
};
</script>
