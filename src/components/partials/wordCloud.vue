<template>
  <div id="app">
      <wordcloud
        class="wordCloud"
        :data="words"
        nameKey="name"
        valueKey="value"
        fontScale="sqrt"
        :fontSize="[20, 120]"
        :wordClick="wordClick">
      </wordcloud>
  </div>
</template>

<script>
import wordcloud from '../../utils/vueWordCloud';

export default {
  name: 'app',
  components: {
    wordcloud,
  },
  methods: {
    wordClick(word) {
      // 글자 클릭시 실행되는 함수
      window.console.log(word.text);
    },
  },
  computed: {
    words() {
      const wordarr = [];
      for (let i = 0; i < 100; i += 1) {
        let name = '';
        const randChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let j = 0; j < 5; j += 1) {
          name += randChar.charAt(Math.floor(Math.random() * randChar.length));
        }
        const value = Math.ceil(Math.random() * 10);
        const understand = Math.random() > 0.3;
        wordarr.push({ name, value, understand });
      }
      return wordarr;
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scope>
  .wordCloud {
    min-height: 700px;
  }
</style>
