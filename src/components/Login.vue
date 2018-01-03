<template>
  <div>
    <el-container>

      <el-row>
        <el-col>
          <!-- TODO: add form html element -->
          <!-- TODO: add validation -->
        <h1>Login</h1>
        <el-input placeholder="abc@gmail.com" v-model="inputEmail" type="email">
          <template slot="prepend">Email</template>
        </el-input>
        <el-input placeholder="********" v-model="inputPassword" type="password">
          <template slot="prepend">Password</template>
        </el-input>
        <!-- TODO: add disabled attr according to validation -->
        <el-button type="primary" @click="onClick('LOGIN')">login</el-button>
        </el-col>
      </el-row>
    </el-container>
    jwt: {{ jwt }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      inputEmail: 'adoji92@gmail.com',
      inputPassword: 'adojiadoji',
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
