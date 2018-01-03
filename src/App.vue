<template>
  <div id="app">
    <router-link to="/">Landing Page</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
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

    <router-view/>
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
