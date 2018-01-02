<template>
  <div>
    <el-container>

      <el-row>
        <el-col>
          <!-- TODO: add form html element -->
        <h1>Login</h1>
        <el-input placeholder="abc@gmail.com" v-model="inputEmail" type="email">
          <template slot="prepend">Email</template>
        </el-input>
        <el-input placeholder="********" v-model="inputPassword" type="password">
          <template slot="prepend">Password</template>
        </el-input>
        <el-button type="primary" @click="onClick('LOGIN')">login</el-button>
        </el-col>
      </el-row>
    </el-container>
    jwt: {{ jwt }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
import auth from '../services/auth';

export default {
  name: 'login',
  data() {
    return {
      inputEmail: 'adoji92@gmail.com',
      inputPassword: 'adojiadoji',
    };
  },
  methods: {
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'LOGIN': {
          const res = await auth.login(vm.inputEmail, vm.inputPassword);
          console.log('login response:', res); // eslint-disable-line
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
    // ...mapState(/* 'auth', */['jwt']),
  },
};
</script>
