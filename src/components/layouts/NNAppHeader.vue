<template>
  <div id="app_nav_wrapper" class="bt-container">
    <div style="position: relative">
      <router-link to="/">
        <div style="display:inline-block; position:absolute; top: 14px; left:50px;">
          <span class="title">PRESWOT</span>
          <!--<span id="header1" class="class1" :class="{class2: testFlag}">PRESWOT</span>-->
        </div>
      </router-link>
      <router-link to="/classes">
        <div style="display:inline-block; position:absolute; top: 15px; left:230px;">
          <span class="normal">과목목록</span>
        </div>
      </router-link>
      <router-link to="/a/student/NNclass" v-if="authType === 0" v-show="isJwtValid">
        <div style="display:inline-block; position:absolute; top: 15px; left:335px;">
          <span class="normal">수강중인 과목</span>
        </div>
      </router-link>
      <router-link to="/a/teacher/NNclass" v-if="authType === 1" v-show="isJwtValid">
        <div style="display:inline-block; position:absolute; top: 15px; left:335px;">
          <span class="normal">강의중인 과목</span>
        </div>
      </router-link>
      <!--
      <div style="display:inline-block; position:absolute; top: 20px; left:632px;">
        <input v-model="testData" type="text" id="headerInput" class="inputtestclass" placeholder="Please input"/>
        <i class="el-icon-search" @click="onClick('asdfsadf')"></i>
      </div>
      -->
      <router-link to="/register" v-show="!isJwtValid">
        <div style="display:inline-block; position:absolute; top: 15px; left:990px;">
          <span class="normal">회원가입</span>
        </div>
      </router-link>
      <router-link to="/login" v-show="!isJwtValid">
        <div style="display:inline-block; position:absolute; top: 15px; left:1089px;">
          <span class="normal">로그인</span>
        </div>
      </router-link>
      <div style="display:inline-block; position:absolute; top: 15px; left:1089px;" v-show="isJwtValid"  @click="onClick('LOGOUT')">
        <span class="normal">로그아웃</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  .title {
    width: 101px;
    height: 22px;
    font-family: Verdana;
    font-size: 18px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
  }
  .normal {
    width: 45px;
    height: 14px;
    font-family: SpoqaHanSans;
    font-size: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: #ffffff;
  }
  .normal:hover {
    font-size: 13px;
    font-weight: bold;
    color: #20a0ff;
  }
  #header2:hover {
    background-color:blueviolet;
  }

  #header3:hover:after {
    content: "";
    display: inline-block;
    position: absolute;
    bottom: -10px;
    left: calc(50% - 25px);
    width: 50px;
    height: 7px;
    background: black;
  }
</style>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import utils from '../../utils';

export default {
  name: 'AppHeader',
  data() {
    return {
      searchText: '',
      testFlag: false,
      testData: '',
    };
  },
  computed: {
    ...mapState('auth', ['jwt', 'locale']),
    ...mapState('layout', ['isNavCollapsed']),
    ...mapGetters('auth', ['isJwtValid']),
    authType() {
      const vm = this;
      const jwt = vm.$store.state.auth.jwt;
      return utils.getAuthTypeFromJwt(jwt);
    },
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
