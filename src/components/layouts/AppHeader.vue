<template>
  <div id="app_nav_wrapper" class="bt-container">
    <el-row type="flex" justify="space-between">

      <!-- TODO: replace span with :xs, :sm, :md, :lg, :xl -->
      <el-col :span="13">
        <el-button
          v-if="!isProd"
          :type="appTheme"
          id="navigation_toggle"
          @click="onClick('TOGGLE_NAVIGATION')"
        >
          <i class="fas fa-bars fa-2x" />
        </el-button>
        <router-link to="/">
          <!-- TODO: replace 브랜드 로고 -->
          <el-button :type="appTheme" plain>Preswot</el-button>
        </router-link>
        <!-- TODO: translate placeholder -->
        <!-- <el-input placeholder="Please input" v-model="searchText" style="max-width: 250px;">
        </el-input>
        <el-button :type="appTheme" plain>
          <i class="fas fa-search"></i>
        </el-button> -->
      </el-col>

      <el-col :span="11">

        <el-row type="flex" justify="end">
          <el-col :span="14">
            <!-- <el-dropdown @command="onClick">
              <el-button :type="appTheme" plain>
                {{ $t('HEADER.LANG_INFO') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="LOCALE_KO">한국어</el-dropdown-item>
                <el-dropdown-item command="LOCALE_EN">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->

            <router-link v-if="!isProd" to="/a/student/class" v-show="isJwtValid">
              <el-button :type="appTheme" plain>
                <i class="fas fa-graduation-cap"></i> 1
              </el-button>
            </router-link>

            <router-link to="/a/student/NNclass" v-show="isJwtValid">
              <el-button :type="appTheme" plain>
                <i class="fas fa-graduation-cap"></i> <span v-show="!isProd">2</span>
              </el-button>
            </router-link>

            <router-link v-if="!isProd" to="/a/teacher/class" v-show="isJwtValid">
              <el-button :type="appTheme" plain>
                <i class="fas fa-edit"></i>1
              </el-button>
            </router-link>

             <router-link to="/a/teacher/NNclass" v-show="isJwtValid" id="btn_teacher_home">
              <el-button :type="appTheme" plain>
                <i class="fas fa-edit"></i> <span v-show="!isProd">2</span>
              </el-button>
            </router-link>

            <!-- Login / Profile, Logout button part -->
            <router-link to="/login" v-show="!isJwtValid">
              <el-button :type="appTheme" plain>
                  {{ $t('LOGIN.LOGIN_BUTTON') }}
              </el-button>
            </router-link>
            <el-dropdown @command="onClick">
              <el-button :type="appTheme" plain v-show="isJwtValid">
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
              <el-button :type="appTheme" plain>
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
      isProd: document.URL.includes('preswot'),
    };
  },
  computed: {
    ...mapState('auth', ['jwt', 'locale']),
    ...mapState('layout', ['isNavCollapsed']),
    ...mapGetters('auth', ['isJwtValid']),
    appTheme() {
      const vm = this;
      const path = vm.$route.path;
      if (path.includes('teacher')) {
        if (path.includes('live')) {
          return 'warning';
        }
        return 'primary';
      } else if (path.includes('student')) {
        return '';
      }
      return 'primary';
    },
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
            title: '로그아웃',
            message: '로그아웃 성공',
            type: 'success',
          });
          setTimeout(() => {
            location.reload();
          }, 800);
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

