<template>
  <!-- <div id="app_footer_wrapper" v-show="!isLive"> -->
  <div id="app_footer_wrapper">
    <div class="bt-container">
      <div style="position: relative">
        <div :class="$attachReactablePostfix('div1')">
          <span :class="$attachReactablePostfix('title')">PRESWOT</span>
        </div>
        <router-link to="/policy">
          <div :class="$attachReactablePostfix('div2')">
            <span :class="$attachReactablePostfix('common')">Policy</span>
          </div>
        </router-link>
        <router-link to="/download">
          <div :class="$attachReactablePostfix('div3')">
            <span :class="$attachReactablePostfix('common')">Download</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppFooter',
  /*
  computed: {
    isLive() {
      return this.$route.fullPath.includes('live');
    },
  },
  */
};
</script>


<style lang="scss" scoped>
@import "~@/variables.scss";
#app_footer_wrapper {
  background-color: #000000;
  /* background-color: lighten($app-oatmeal, 50%);
  /* sh : margin-top추가 */ 
}
.div1 {
  display:inline-block;
  position:absolute;
  top: 14px;
  left:5%;
}
.div2 {
  display:inline-block;
  position:absolute;
  top: 14px;
  left:83%;
}
.div3 {
  display:inline-block;
  position:absolute;
  top: 14px;
  left:92%;
}
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
.common {
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
.common:hover {
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
}

.div1-phone {
  display:inline-block;
  position:absolute;
  top: 14px;
  left:5%;
}
.div2-phone {
  display:inline-block;
  position:absolute;
  top: 14px;
  left:80%;
}
.div3-phone {
  display:none;
}
.title-phone {
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
.common-phone {
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
</style>
