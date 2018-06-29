<template>
  <div id="download_page_wrapper" class="bt-container">
    <h1>다운로드 페이지</h1>
    <h3>- 로그 프로그램</h3>
    <a :href = "downloadLink">다운로드</a> <br /><br />
    학생이 수강하는 동안 집중도, 참여도, 이해도 등을 계산하기 위해 브라우저에서 수집할 수 없는 시스템 로그들을 수집합니다.
  </div>
</template>

<script>
  import { baseUrl } from '../../services/config';

  export default {
    data() {
      const downloadLink = `${baseUrl}/downloads/download_logfile`;
      return {
        downloadLink,
      };
    },
  };
</script>
