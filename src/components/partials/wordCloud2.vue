<template>
  <div>
    <wordcloud
      :words="[['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]]"
      :color="([, weight]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
      font-family="Roboto"></wordcloud>
  </div>
</template>

<script>
import wordcloud from 'vuewordcloud';

export default {
  name: 'app',
  components: {
    wordcloud,
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
