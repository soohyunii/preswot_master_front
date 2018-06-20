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
    // 영상 로드 시 콘솔창에 Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('https://www.youtube.com') does not match the recipient window's origin ... 에러 해결을 위해 http로 변경합니다.
    youtubeId: () => (getIdFromURL('http://www.youtube.com/watch?v=xRbPAVnqtcs')),
  },
};
</script>

<style>

</style>
