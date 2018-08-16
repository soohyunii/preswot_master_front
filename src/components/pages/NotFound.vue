<template>
  <div>
    <h1 class="not-found">Not Found 404</h1>
    <i18n path="NOTFOUND.REDIRECT_MESSAGE" tag="h2" class="redirect-message">
      <span place="REDIRECT_MESSAGE1">{{ $t('NOTFOUND.REDIRECT_MESSAGE1') }}</span>
      <span place="secondLeft">{{ secondLeft }}</span>
      <span place="REDIRECT_MESSAGE2">{{ $t('NOTFOUND.REDIRECT_MESSAGE2') }}</span>
    </i18n>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      secondLeft: 5, // 몇 초뒤 이동 되는지를 나타내는 시간
    };
  },
  methods: {
    ...mapMutations('auth', ['updateRedirectionTimeoutId']),
  },
  mounted() {
    const vm = this;

    const redirectionTimeoutId = setTimeout(() => {
      vm.$router.push('/');
    }, 5000);

    vm.updateRedirectionTimeoutId({
      redirectionTimeoutId,
    });

    const intervalId = setInterval(() => {
      vm.secondLeft -= 1;
      if (vm.secondLeft === 0) {
        window.clearInterval(intervalId);
        vm.updateRedirectionTimeoutId({
          redirectionTimeoutId: null,
        });
      }
    }, 1000);
  },
};
</script>

<style scoped>
.not-found {
  text-align: center;
  font-size: 5em
}
.redirect-message {
  text-align: center;
  font-size: 2em
}
</style>