<template>
  <div>
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
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <!-- <router-link to="/a/home">Home</router-link> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'app-header',
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

