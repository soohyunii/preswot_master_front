<template>
  <div>
    <el-button
      id="navigation_toggle"
      @click="onClick('TOGGLE_NAVIGATION')"
    >
      <i class="fa fa-bars fa-2x" />
    </el-button>
    <!-- TODO: replace 브랜드 로고 -->
    <el-button type="primary">Brand Logo</el-button>
    <!-- TODO: translate placeholder -->
    <el-input placeholder="Please input" v-model="searchText">
    </el-input>
    <!-- <el-button icon="el-icon-search" type="primary"></el-button> -->
    <el-button type="primary">
      <i class="fa fa-search"></i>
    </el-button>


    <el-dropdown @command="onClick">
      <el-button type="primary">
        {{ $t('HEADER.LANG_INFO') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="LOCALE_KO">한국어</el-dropdown-item>
        <el-dropdown-item command="LOCALE_EN">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    locale: {{ locale }}

    <router-link to="/a/teacher">* Teacher Home *</router-link>

    <!-- Login / Profile, Logout button part -->
    <router-link to="/login" style="text-decoration:none; color: #ffffff" v-if="!isJwtValid">
      <el-button type="primary">
          {{ $t('LOGIN.LOGIN_BUTTON') }}
      </el-button>
    </router-link>
    <router-link to="/a/profile" style="text-decoration:none; color: #ffffff" v-else>
      <el-dropdown @command="onClick">
        <el-button type="primary">
            {{ $t('HEADER.PROFILE_BUTTON') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="PROFILE">{{ $t('HEADER.PROFILE_BUTTON') }}</el-dropdown-item>
          <el-dropdown-item command="LOGOUT">{{ $t('HEADER.LOGOUT_BUTTON') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </router-link>
    <!-- router-link to "register" -->
    <router-link to="/register">Register</router-link>
    <!-- <router-link to="/a/home">Home</router-link> -->
  </div>
</template>

<style lang="scss" scoped>
// @import "~@/variables.scss"; // * To use $--color-primary scss variable

.el-input {
  width: 400px; // TODO: Rplace 400px with designed value
}

#navigation_toggle {
  border: 0;
  padding: 6px 10px;
  .fa.fa-bars {
    top: 100px;
  }
}

</style>


<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      searchText: '',
    };
  },
  computed: {
    ...mapState('auth', ['jwt', 'locale']),
    ...mapState('layout', ['isNavCollapsed']),
    ...mapGetters('auth', ['isJwtValid']),
  },
  methods: {
    ...mapMutations('layout', ['updateCollapse']),
    ...mapMutations('auth', ['updateJwt', 'updateLocale']),
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
        case 'LOGOUT': {
          vm.updateJwt('');
          vm.$router.push({
            name: 'LandingPage',
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
        case 'TOGGLE_NAVIGATION': {
          vm.updateCollapse({
            isNavCollapsed: !vm.isNavCollapsed,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

