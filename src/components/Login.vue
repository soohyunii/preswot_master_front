<template>
  <div>
    <el-container>

      <el-row>
        <el-col>
          <!-- TODO: add form html element -->
          <!-- TODO: add validation -->
          <h1>{{ $t('LOGIN.LOGIN_TITLE') }}</h1>

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
    params : {{ params }}
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
          if (vm.$route.params.to) {
            setTimeout(() => {
              vm.$router.push({
                path: vm.$route.params.to,
              });
            }, 500);
          }
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    noti() {
      const vm = this;
      vm.$notify({
        title: vm.$t('LOGIN.LOGIN_REQUIRED'),
        type: 'warning',
      });
    },
  },
  computed: {
    ...mapState('auth', ['jwt']),
    params() {
      const vm = this;
      return vm.$route.params.to;
    },
  },
  mounted() {
    const vm = this;
    if (vm.$route.params.to) {
      vm.noti();
    }
  },
};
</script>
