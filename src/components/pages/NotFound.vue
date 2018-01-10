<template>
  <div>
    <h1 class=notfound>Not Found 404</h1>
    <h2 class=redirectmessage>{{ $t('NOTFOUND.REDIRECT_MESSAGE1') }}{{ time }}{{ $t('NOTFOUND.REDIRECT_MESSAGE2') }}</h2>
  </div>
</template>

<style>
.notfound {
  text-align: center;
  font-size: 5em
}
.redirectmessage {
  text-align: center;
  font-size: 2em
}
</style>

<script>
export default {
  data() {
    return {
      time: 5, // 몇 초뒤 이동 되는지를 나타내는 시간
    };
  },
  methods: {
    redirectTo() {
      const vm = this;
      vm.$router.push('/login');
    },
    countdown() {
      const vm = this;
      vm.time -= 1;
    },
  },
  mounted() {
    setTimeout(this.redirectTo, 5000); // 5초 후 리다이렉팅 실행
    setInterval(this.countdown, 1000); // 매 초마다 표기 숫자를 카운트다운
  },
};
</script>
