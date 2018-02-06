<template>
  <div id="app">
      <wordcloud
        class="wordCloud"
        :data="words"
        nameKey="name"
        valueKey="value"
        fontScale="sqrt"
        :fontSize="[20, 100]"
        :wordClick="wordClick">
      </wordcloud>
  </div>
</template>

<script>
// import wordcloud from 'vue-wordcloud';
import wordcloud from './wordCloud';

export default {
  name: 'wordCloudExample',
  components: {
    wordcloud,
  },
  methods: {
    wordClick(word) {
      // 글자 클릭시 실행되는 함수
      window.console.log(word);
    },
  },
  computed: {
    words() {
      const wordarr = [];
      for (let i = 0; i < 100; i += 1) {
        let name = '';
        const randChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const randLength = Math.ceil((Math.random() * 6) + 2);
        for (let j = 0; j < randLength; j += 1) {
          name += randChar.charAt(Math.floor(Math.random() * randChar.length));
        }
        // const name = Math.ceil(Math.random() * 100).toString();
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
