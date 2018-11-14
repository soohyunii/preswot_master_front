<template>
  <div id="app_nav_wrapper" class="bt-container">
    <div style="position: relative">
      <router-link to="/">
        <div :class="$attachReactablePostfix('div1')">
          <span :class="$attachReactablePostfix('title')">PRESWOT</span>
        </div>
      </router-link>
      <!--
      <router-link to="/classes" v-if="authType !== 1" >
        <div :class="$attachReactablePostfix('div2')">
          <span :class="$attachReactablePostfix('common')">과목목록</span>
        </div>
      </router-link>
      -->
      <router-link to="/a/teacher/NNclass" v-if="authType === 1" v-show="isJwtValid">
        <div :class="$attachReactablePostfix('div2_1')">
          <span :class="$attachReactablePostfix('common')">강의중인 과목</span>
        </div>
      </router-link>

      <router-link to="/classes" v-if="authType === 0||authType === 1">
        <div style="display:inline-block; position:absolute; top: 15px; left:230px;">
          <span class="normal">과목목록</span>
        </div>
      </router-link>
      <router-link to="/a/student/NNclass" v-if="authType === 0" v-show="isJwtValid">
        <div :class="$attachReactablePostfix('div3')">
          <span :class="$attachReactablePostfix('common')">수강중인 과목</span>
        </div>
      </router-link>
      <router-link to="/a/bank" v-if="authType === 1" v-show="isJwtValid">
        <div :class="$attachReactablePostfix('div3')">
          <span :class="$attachReactablePostfix('common')">강의 은행</span>
        </div>
      </router-link>
      
        <div style="display:inline-block; position:absolute; top: 15px; left:230px;" class="normal_manager" v-if="authType === 3" v-show="isJwtValid">
          <span>등록하기
            <ul>
              <li>
                <router-link to="/a/register/uni" v-if="authType === 3" v-show="isJwtValid">대학
                </router-link>
              </li>
              <li>
                <router-link to="/a/register/dept" v-if="authType === 3" v-show="isJwtValid">학과
                </router-link>
              </li>
              <li>
                <router-link to="/a/register/teacher" v-if="authType === 3" v-show="isJwtValid">강사
                </router-link>
              </li>
              <li>
                <router-link to="/a/register/class" v-if="authType === 3" v-show="isJwtValid">과목
                </router-link>
              </li>
              <li>
                <router-link to="/a/register/student" v-if="authType === 3" v-show="isJwtValid">학생
                </router-link>
              </li>
              <li>
                <router-link to="/a/register/bank" v-if="authType === 3" v-show="isJwtValid">강의은행그룹
                </router-link>
              </li>
            </ul>

          </span>
        </div>
      
      
        <div style="display:inline-block; position:absolute; top: 15px; left:365px;" class="normal_manager" v-if="authType === 3" v-show="isJwtValid">
          <span>조회하기
            <ul>
              <li>
                <router-link to="/a/view/uni" v-if="authType === 3" v-show="isJwtValid">대학</router-link>
              </li>
              <li>
                <router-link to="/a/view/dept" v-if="authType === 3" v-show="isJwtValid">학과</router-link>
              </li>
              <li>
                <router-link to="/a/view/teacher" v-if="authType === 3" v-show="isJwtValid">강사</router-link>
              </li>
              <li>
                <router-link to="/a/view/class" v-if="authType === 3" v-show="isJwtValid">과목및강의</router-link>
              </li>
              <li>
                <router-link to="/a/view/student" v-if="authType === 3" v-show="isJwtValid">학생</router-link>
              </li>
              <li>
                <router-link to="/a/view/bank" v-if="authType === 3" v-show="isJwtValid">강의은행그룹</router-link>
              </li>
            </ul>
          </span>
        </div>
      
      <div style="display:inline-block; position:absolute; top: 20px; left:632px;" v-if="authType === 0||authType === 1">
        <input v-model="testData" type="text" id="headerInput" class="inputtestclass" placeholder="Please input"/>
        <i class="el-icon-search" @click="onClick('asdfsadf')"></i>
      </div>

      <!-- 회원가입 막아놓기
      <router-link to="/tos" v-show="!isJwtValid">
        <div :class="$attachReactablePostfix('div4')">
          <span :class="$attachReactablePostfix('common')">회원가입</span>

      
      <router-link to="/register" v-show="!isJwtValid">
        <div style="display:inline-block; position:absolute; top: 15px; left:990px;">
          <span class="normal">회원가입</span>
        </div>
      </router-link>-->
      <router-link to="/login" v-show="!isJwtValid">
        <div :class="$attachReactablePostfix('div5')">
          <span :class="$attachReactablePostfix('common')">로그인</span>
        </div>
      </router-link>
      <router-link to="/profileEdit" v-show="isJwtValid">
        <div :class="$attachReactablePostfix('div4')">
          <span :class="$attachReactablePostfix('common')">프로필</span>
        </div>
      </router-link>
      <!-- {{ $t('HEADER.PROFILE_BUTTON') }}<i class="el-icon-arrow-down el-icon-right"></i> -->
      <div :class="$attachReactablePostfix('div5')" v-show="isJwtValid" @click="onClick('LOGOUT')">
        <span :class="$attachReactablePostfix('common')">로그아웃</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #app_nav_wrapper {
    padding: 8px 0;
  }
  .div1 {
    display:inline-block;
    position:absolute;
    top: 14px;
    left:5%;
  }
  .div2 {
    display:inline-block;
    position:absolute;
    top: 15px;
    left:20%;
  }
  .div2_1 {
    @extend .div2;
  }
  .div3 {
    display:inline-block;
    position:absolute;
    top: 15px;
    left:30%;
  }
  .div4 {
    display:inline-block;
    position:absolute;
    top: 15px;
    left:83%;
  }
  .div5 {
    cursor: pointer;
    display:inline-block;
    position:absolute;
    top: 15px;
    left:92%;
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
  .common {
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
  .common:hover {
    font-size: 13px;
    font-weight: bold;
    color: #20a0ff;
  }
  .normal_manager{
    width: 65px;
    height: 74px;
    font-family: SpoqaHanSans;
    font-size: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: #ffffff;
  }
  .normal_manager:hover{
    font-size: 13px;
    font-weight: bold;
    color: #20a0ff;
  }

  .normal_manager ul{
    list-style:none;
    padding-left:10px;
    width:100px;
    background-color:#233656;
  }

  .normal_manager ul li{
    display:none;
    font-family: SpoqaHanSans;
    line-height: normal;
    padding:5px 2px 5px 0;
    height:25px;
  }

  .normal_manager:hover ul li{
    display:block;
  }

  .normal_manager ul li a{
    text-decoration:none;
    color:#ffffff;
  }

  .normal_manager ul li a:hover{
    color:#20a0ff;
  }

  #header2:hover {
    background-color:blueviolet;
  }

  .div1-phone {
    display:inline-block;
    position:absolute;
    top: 14px;
    left:5%;
  }
  .div2-phone {
    display:none;
  }
  .div2_1-phone {
    @extend .div3-phone;
  }
  .div3-phone {
    display:inline-block;
    position:absolute;
    top: 14px;
    left:35%;
  }
  .div4-phone {
    display:inline-block;
    position:absolute;
    top: 15px;
    left:60%;
  }
  .div5-phone {
    display:inline-block;
    position:absolute;
    top: 15px;
    left:80%;
  }
  .title-phone {
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
  .common-phone {
    width: 45px;
    height: 14px;
    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: #ffffff;
  }
  .common-phone:hover {
    font-size: 13px;
    font-weight: bold;
    color: #20a0ff;
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
          /*
          // TODO: translation
          vm.$notify({
            title: '로그아웃',
            message: '로그아웃 성공',
            type: 'success',
          });
          */
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
