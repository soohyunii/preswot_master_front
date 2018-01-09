<template>
  <div>
    <!-- TODO: translate placeholder -->
    <el-input placeholder="Please input" v-model="searchText" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
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
    changeLocale(locale) {
      const vm = this;
      vm.$i18n.locale = locale;
      vm.updateLocale({ locale });
    },
    onClick(type){
      const vm = this;
      switch (type) {
        case 'PROFILE': {
          vm.$router.push({
            name: 'Profile',
          });
          break;
        }
        default: {
          throw new Error('not defined type', type);
        }
      }
    },
  },
};
</script>

