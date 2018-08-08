<template>
  <div id="tos_wrapper" oncontextmenu="return false">
    <el-container>
      <el-row>
        <el-col style="max-width: 700px;">
          <el-form :model="input">
            <el-form-item>
              <h1>{{ $t('TOS.TOS_TITLE') }}</h1>
            </el-form-item>
            <!-- TODO: terms of use / privacy policy text 주루루룩 -->
            <el-form-item prop="checkTou" id="checkTou">
              <el-card class="box-card">
                <div class="tos">
                  <p>
                    이용 약관(영어: Terms of service terms of use이나
                    terms and conditions으로도 알려짐,
                    줄여서 ToS 또는 TOS라고 부르기도 함)은 서비스를
                    이용하기 위해 동의해야만 하는 규칙이다.
                  </p>
                  <p>
                    돈데기리기리 돈데기리기리 돈데돈데돈데 돈데크만
                    카피카피 룸룸 카피카피 룸룸
                    카피카피 룸룸 카피카피 룸룸
                  </p>
                </div>
              </el-card>
              <el-checkbox v-model="input.checkTou" id="user_tou_input">{{ $t('REG.TOU_LABEL') }}</el-checkbox>
            </el-form-item>
          </el-form>
          <el-button @click="onClick()">이동</el-button>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import generateRules from '../../validations/registerValidation';
// id(string), password(string), name(string),
// birth(1991-07-16 형식string), address(string), phone(string), major(string), belong(string소속)
export default {
  directives: { focus },
  name: 'Tos',
  data() {
    const vm = this;
    return {
      focused: false,
      input: {
        checkTou: false,
      },
      rules: generateRules(vm),
    };
  },
  methods: {
    onClick() {
      const vm = this;
      if (vm.input.checkTou === false) { // 약관에 동의하지 않으면 진행 불가
        vm.$notify({
          title: '알림',
          message: '약관에 동의해주세요.',
          type: 'warning',
        });
      } else { // 회원가입 진행
        vm.$router.push({
          name: 'Register',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 400px;
}

.el-button {
  margin-left: 10px;
}

.tos {
  background-color: white;
  border-radius: 4px;
  padding: 10px;
}
</style>