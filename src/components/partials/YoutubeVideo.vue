<template>
  <youtube
    id="video"
    :video-id="youtubeId"
    player-width="100%"
    player-height="500px"
    :player-vars="{
      autoplay: 1,
    }"
    :mute="true"
    >
  </youtube>
</template>
  

<script>
// FIXME : CSS 적용 시, youtube의 player-height 하드코딩 해소
// FIXME : youtube 주소 하드코딩 해소
import { getIdFromURL } from 'vue-youtube-embed';

export default {
  name: 'YoutubeVideo',
  computed: {
    youtubeId: () => (getIdFromURL('https://www.youtube.com/watch?v=xRbPAVnqtcs')),
  },
};
</script>

<style>

</style>
