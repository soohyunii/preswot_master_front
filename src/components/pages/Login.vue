<template>
  <div id="login_wrapper">
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
            id="btn_login"
            type="primary"
            @click="onClick('LOGIN')"
          >
            {{ $t('LOGIN.LOGIN_BUTTON') }}
          </el-button>
          <el-button
            type="primary"
            @click="onClick('FORGOT_PASSWORD')"
          >
            {{ $t('LOGIN.FORGOT_PASSWORD_BUTTON') }}
          </el-button>
          <el-dialog
            title="비밀번호 초기화"
            :visible.sync="isModalVisible"
            width="30%"
            center
          >
            <!-- TODO: replace 브랜드 로고 -->
            <el-button type="primary" plain slot="title">Brand Logo</el-button>
            <h2>비밀번호 변경</h2>
            <span>비밀번호를 변경할 이메일을 입력하세요.</span>
            <br/><br/><hr><br/>
            <el-form :model="input" label-width="120px" label-position="top">
              <el-form-item label="이메일">
                <el-input v-model="findingPasswordEmail"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="onClick('SUBMIT')"
              >
                변경 방법 전송
              </el-button>
            </span>
          </el-dialog>
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
        password: 'adjadj1234',
      },
      isModalVisible: false,
      findingPasswordEmail: '',
    };
  },
  methods: {
    ...mapActions('auth', [
      'reqLogin',
      'findPassword',
    ]),
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'LOGIN': {
          try {
            // const res = await vm.reqLogin({
            await vm.reqLogin({
              email: vm.input.email,
              password: vm.input.password,
            });
            // console.log('login res', JSON.stringify(res));
            // TODO: translate
            vm.openNoti('success', 'Login Success !!', 'Success');
            if (vm.redirectTo) {
              // jwt 업데이트 후 페이지 이동 이루어지도록
              vm.$router.push(vm.redirectTo);
            } else {
              vm.$router.push('/');
            }
          } catch (error) {
            // console.error('login error', error);
            // TODO: translate
            vm.openNoti('error', 'Login Failed !!');
          }
          break;
        }
        case 'FORGOT_PASSWORD': {
          vm.isModalVisible = true;
          break;
        }
        case 'SUBMIT': {
          try {
            await vm.findPassword({
              email: vm.findingPasswordEmail,
            });
            vm.$notify({
              title: '이메일 전송 성공',
              message: '비밀번호 초기화 이메일을 보냈습니다. 받은 편지함을 확인하세요.',
              type: 'success',
            });
            vm.isModalVisible = false;
          } catch (error) {
            vm.$notify({
              title: '이메일 전송 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
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
