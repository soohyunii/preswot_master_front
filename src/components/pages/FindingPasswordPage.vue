<template>
  <div>
    <el-container>
      <el-row>
        <el-col style="max-width: 700px;">
          <!-- TODO: add form html element -->
          <!-- TODO: add validation -->
          <h1>비밀번호 재설정</h1>

          <el-form :model="input" :rules="rules" :label-width="getLabelWidth()">
            <el-form-item label="새 비밀번호" prop="password" id="password">
              <el-input placeholder="********" v-model="input.password" type="password" />
            </el-form-item>

            <el-form-item label="새 비밀번호 확인" prop="password2" id="password2">
              <el-input placeholder="********" v-model="input.password2" type="password" />
            </el-form-item>
          </el-form>
          <!-- TODO: add disabled attr according to validation -->
          <el-button
            type="primary"
            @click="onClick('SUBMIT')"
          >
          비밀번호 변경하기
          </el-button>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import generateRules from '../../validations/registerValidation';

export default {
  name: 'FindingPasswordPage',
  data() {
    const vm = this;
    return {
      input: {
        password: '',
        password2: '',
      },
      rules: generateRules(vm),
    };
  },
  methods: {
    ...mapActions('auth', [
      'putPassword',
    ]),
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'SUBMIT': {
          try {
            await vm.putPassword({
              newPassword: vm.input.password,
              key: vm.$route.params.rand,
              userId: vm.$route.params.userId,
            });
            vm.$notify({
              title: '비밀번호 변경 성공',
              message: '성공적으로 비밀번호가 변경됨',
              type: 'success',
            });
            vm.$router.push('/login');
          } catch (error) {
            vm.$notify({
              title: '비밀번호 변경 실패',
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
    getLabelWidth() {
      const vm = this;
      const labelString = [
        '새 비밀번호',
        '새 비밀번호 확인',
      ];
      const maxLabelLength = Math.max.apply(null, labelString.map(x => x.length));

      let charPixel = 15;
      switch (vm.locale) {
        default:
        case 'ko':
          charPixel = 15;
          break;
        case 'en':
          charPixel = 8;
          break;
      }
      const width = maxLabelLength * charPixel + 'px' // eslint-disable-line
      // window.console.log(width);

      return width;
    },
  },
};
</script>