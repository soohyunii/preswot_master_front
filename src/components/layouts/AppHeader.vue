<template>
  <div>
    <!-- TODO: translate placeholder -->
    <el-input placeholder="Please input" v-model="searchText" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>

    <el-dropdown @command="handleCommand">
      <el-button type="primary">
        Lang<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="LOCALE_KO">한국어</el-dropdown-item>
        <el-dropdown-item command="LOCALE_EN">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    locale: {{ locale }}
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <el-button type="primary" @click="onClick('PROFILE')">
      Profile
    </el-button>
    <!-- <router-link to="/a/home">Home</router-link> -->
  </div>
</template>

<style lang="scss" scoped>
.el-input {
  width: 400px; // TODO: Rplace 400px with designed value
}
</style>


<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      searchText: '',
    };
  },
  computed: {
    ...mapState('auth', ['locale']),
  },
  methods: {
    ...mapMutations('auth', ['updateLocale']),
    _changeLocale(locale) {
      const vm = this;
      vm.$i18n.locale = locale;
      vm.updateLocale({ locale });
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'PROFILE': {
          vm.$router.push({
            name: 'Profile',
          });
          break;
        }
        case 'LOCALE_KO': {
          vm._changeLocale('ko'); // eslint-disable-line no-underscore-dangle
          break;
        }
        case 'LOCALE_EN': {
          vm._changeLocale('en'); // eslint-disable-line no-underscore-dangle
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
    handleCommand(command) {
      const vm = this;
      vm.onClick(command);
    },
  },
};
</script>

