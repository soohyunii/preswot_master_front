<template>
  <div>
    <!-- TODO: translate placeholder -->
    <el-input placeholder="Please input" v-model="searchText" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button
      :type="locale === 'ko' ? 'primary' : 'default'"
      @click="onClick('LOCALE_KO')"
    >
      한국어
    </el-button>
    <el-button
      :type="locale === 'en' ? 'primary' : 'default'"
      @click="onClick('LOCALE_EN')"
    >
      English
    </el-button>
    locale: {{ locale }}
    <!-- Login / Profile, Logout button part -->
    <router-link to="/login" style="text-decoration:none; color: #ffffff" v-if="!valid">
      <el-button type="primary">
          {{ $t('LOGIN.LOGIN_BUTTON') }}
      </el-button>
    </router-link>
    <router-link to="/a/profile" style="text-decoration:none; color: #ffffff" v-else>
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
            {{ $t('HEADER.PROFILE_BUTTON') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">{{ $t('HEADER.PROFILE_BUTTON') }}</el-dropdown-item>
          <el-dropdown-item command="logout">{{ $t('HEADER.LOGOUT_BUTTON') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </router-link>
    <!-- router-link to "register" -->
    <router-link to="/register">Register</router-link>
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
    ...mapState('auth', ['jwt', 'locale', 'valid']),
  },
  methods: {
    ...mapMutations('auth', ['updateJwt', 'updateLocale', 'updateValid']),
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
      switch (command) {
        case 'logout': {
          vm.updateJwt('');
          vm.updateValid(false);
          vm.$router.push({
            name: 'LandingPage',
          });
          break;
        }
        case 'profile': {
          vm.onClick('PROFILE');
          break;
        }
        default :
      }
    },
  },
};
</script>

