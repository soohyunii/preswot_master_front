<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>
          <router-link to="/">Landing Page</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
          <router-link to="/a/home">Home</router-link>

          |
          <el-button
            :type="locale === 'ko' ? 'primary' : 'default'"
            @click="changeLocale('ko')"
          >
            한국어
          </el-button>
          <el-button
            :type="locale === 'en' ? 'primary' : 'default'"
            @click="changeLocale('en')"
          >
            English
          </el-button>
          locale: {{ locale }}
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// Import element-ui css
import 'element-ui/lib/theme-chalk/index.css'; // eslint-disable-line

import { mapState, mapMutations } from 'vuex';


export default {
  name: 'app',
  computed: {
    ...mapState('auth', ['locale']),
  },
  methods: {
    ...mapMutations('auth', ['updateLocale']),
    changeLocale(locale) {
      const vm = this;
      vm.$i18n.locale = locale;
      vm.updateLocale({ locale });
    },
  },
};
</script>

<style>
</style>
