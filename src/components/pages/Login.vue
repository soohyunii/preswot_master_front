<template>
  <div :id="$attachReactablePostfix('login_wrapper')" class="bt-container">
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
          <el-input placeholder="********" v-model="input.password" type="password" @keydown.enter.native="onClick('LOGIN')">
            <template slot="prepend">{{ $t('LOGIN.PASSWORD_LABEL') }}</template>
          </el-input>
          <br />
          <br />
          <!-- TODO: add disabled attr according to validation -->
          <el-button
            :id="$attachReactablePostfix('btn_login')"
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
            title="비밀번호 변경"
            :visible.sync="isModalVisible"
            :width="$isPhone?'80%':'30%'"
            center
          >
            <!-- TODO: replace 브랜드 로고 -->
            <!--<el-button type="primary" plain slot="title">Brand Logo</el-button>-->
            <!-- <h2>비밀번호 변경</h2> 
            <span>비밀번호를 변경할 이메일을 입력하세요.</span>
            <br/><br/><hr><br/>
            -->
            <el-form :model="input" label-width="120px" label-position="top">
              <el-form-item label="비밀번호를 변경할 이메일 주소를 입력하세요.">
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
    <!-- jwt: {{ jwt }} <br />
    input: {{ input }} <br />
    redirectTo: {{ redirectTo }} -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      input: {
        // email: 'adoji92@gmail.com',
        // password: 'adjadj1234',
        email: '',
        password: '',
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
            const res = await vm.reqLogin({
              email: vm.input.email,
              password: vm.input.password,
            });
            // const jwt = vm.$store.state.auth.jwt;
            // console.log('vm.$store.state.auth.jwt222; = ', vm.$store.state.auth.jwt);
            // console.log('utils.getAuthTypeFromJwt(jwt) = ', utils.getAuthTypeFromJwt(jwt));
            // console.log('login res', JSON.stringify(res));
            // TODO: translate

            // vm.openNoti('success', 'Login Success !!', 'Success');
            if (res.data.terms === 0) {
              vm.$router.push('/tos');
            } else if (vm.redirectTo) {
              // jwt 업데이트 후 페이지 이동 이루어지도록
              vm.$router.push(vm.redirectTo);
            } else {
              // if ()
              vm.$router.push('/');
            }
          } catch (error) {
            if (error.response.status === 403) {
              vm.$notify({
                title: 'warning',
                message: '입력하신 계정은 존재하지 않습니다.',
                type: 'warning',
                duration: 5000,
              });
            } else if (error.response.status === 406) {
              vm.$notify({
                title: 'Sorry',
                message: '비밀번호가 일치하지 않습니다.',
                type: 'warning',
                duration: 5000,
              });
            } else {
              vm.$notify({
                title: 'Sorry',
                message: (error.response !== undefined) ? error.response.data.message : error.message, //eslint-disable-line
                type: 'warning',
                duration: 5000,
              });
            }
            // console.dir(error);
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
    if (vm.$route.query.alert === 'expired') {
      vm.$notify({
        title: 'warning',
        message: '로그인이 세션이 만료되었습니다. 다른곳에서 로그인 하였거나, 일정 시간 이상 경과한 경우 발생할 수 있습니다. 다시 로그인 해주세요.',
        type: 'warning',
        duration: 10000,
      });
    }
  },
};
</script>

<style lang="scss" scoped> // scoped 를 풀었을경우, 강사 로그인 - 내 강의 목록 - 강의 개설 이동시 폰트가 커지는 버그가 있음. 해당 화면 새로고침시 다시 작아짐..
.el-input{
  margin:10px;
}

#btn_login{
  margin:0 20px 0 100px;
  width:150px;
}

#login_wrapper{
  margin-top:70px;
  padding-left:100px;
}

#login_wrapper h1{
  margin:0.67em 15px;
}

.el-form-item label{
  font-size:1.2em;
  margin-left: 10px;
  padding-bottom:0px;
}

#login_wrapper-phone{
  margin-top:70px;
}

#btn_login-phone{
  margin:0 20px 0 20px;
  width:100px;
}

</style>