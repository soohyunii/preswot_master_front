<template>
  <div id="app_footer_wrapper" v-show="!isLive">
    <div class="bt-container">
      <div style="position: relative">
        <div style="display:inline-block; position:absolute; top: 15px; left:5%;">
          <span class="title">PRESWOT</span>
        </div>
        <router-link to="/policy">
          <div style="display:inline-block; position:absolute; top: 15px; left:83%;">
            <span class="normal">Policy</span>
          </div>
        </router-link>
        <router-link to="/download">
          <div style="display:inline-block; position:absolute; top: 15px; left:92%;">
            <span class="normal">Download</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppFooter',
  computed: {
    isLive() {
      return this.$route.fullPath.includes('live');
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~@/variables.scss";
.title {
    width: 101px;
    height: 22px;
    font-family: Verdana;
    font-size: 18px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #20a0ff;
  }
.normal {
  width: 45px;
  height: 14px;
  font-family: SpoqaHanSans;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.17;
  letter-spacing: normal;
  color: #20a0ff;
}
.normal:hover {
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
}
#app_footer_wrapper {
  background-color: #000000;
  /* background-color: lighten($app-oatmeal, 50%);
  /* sh : margin-top추가 */ 
}
</style>
