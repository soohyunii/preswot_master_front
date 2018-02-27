<template>
  <div id="app_nav_wrapper">
    <el-row type="flex" justify="space-between">

      <!-- TODO: replace span with :xs, :sm, :md, :lg, :xl -->
      <el-col :span="13">
        <el-button
          id="navigation_toggle"
          @click="onClick('TOGGLE_NAVIGATION')"
        >
          <i class="fa fa-bars fa-2x" />
        </el-button>
        <router-link to="/">
          <!-- TODO: replace 브랜드 로고 -->
          <el-button type="primary">Brand Logo</el-button>
        </router-link>
        <!-- TODO: translate placeholder -->
        <el-input placeholder="Please input" v-model="searchText">
        </el-input>
        <!-- <el-button icon="el-icon-search" type="primary"></el-button> -->
        <el-button type="primary">
          <i class="fa fa-search"></i>
        </el-button>
      </el-col>

      <el-col :span="11">

        <el-row type="flex" justify="end">
          <el-col :span="14">
            <el-dropdown @command="onClick">
              <el-button type="primary">
                {{ $t('HEADER.LANG_INFO') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="LOCALE_KO">한국어</el-dropdown-item>
                <el-dropdown-item command="LOCALE_EN">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <router-link to="/a/student/class" v-show="isJwtValid">
              <el-button type="primary">
                <i class="fa fa-graduation-cap"></i>
              </el-button>
            </router-link>

            <router-link to="/a/teacher/class" v-show="isJwtValid">
              <el-button type="primary">
                <i class="fa fa-pencil-square-o"></i>
              </el-button>
            </router-link>

            <!-- Login / Profile, Logout button part -->
            <router-link to="/login" v-show="!isJwtValid">
              <el-button type="primary">
                  {{ $t('LOGIN.LOGIN_BUTTON') }}
              </el-button>
            </router-link>
            <el-dropdown @command="onClick">
              <el-button type="primary" v-show="isJwtValid">
                  {{ $t('HEADER.PROFILE_BUTTON') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="PROFILE">{{ $t('HEADER.PROFILE_BUTTON') }}</el-dropdown-item>
                <el-dropdown-item command="LOGOUT">{{ $t('HEADER.LOGOUT_BUTTON') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <router-link to="/a/profile" v-show="isJwtValid">
            </router-link> -->

            <router-link to="/register" v-show="!isJwtValid">
              <el-button type="primary">
                회원가입
              </el-button>
            </router-link>
          </el-col>
        </el-row>

      </el-col>

    </el-row>
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
  vertical-align: middle;
  // .fa.fa-bars {
  //   top: 100px;
  // }
}

#app_nav_wrapper {
  padding: 8px 0;
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
        case 'TOGGLE_NAVIGATION': {
          vm.updateCollapse({
            isNavCollapsed: !vm.isNavCollapsed,
          });
          break;
        }
        case 'PROFILE': {
          vm.$router.push({
            name: 'Profile',
          });
          break;
        }
        case 'LOGOUT': {
          vm.updateJwt({
            jwt: '',
          });
          if (vm.$route.meta.auth) {
            vm.$router.push('/');
          }
          // TODO: translation
          vm.$notify({
            title: 'Success',
            message: 'Logout Success !!',
            type: 'success',
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
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

