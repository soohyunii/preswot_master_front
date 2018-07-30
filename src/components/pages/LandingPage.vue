<template>
  <div id="landing_page_wrapper" class="bt-container">
    <pre :class="$attachReactablePostfix('wise-saying')">
      배움은 우연히 얻을 수 없다. 그것은 타는 열정으로
      구해야 하며, 부지런함으로 참여해야 한다.
      - 아비가일 애덤스
    </pre>
    <div :class="$attachReactablePostfix('search-box')">
      <i id="icon_search" class="el-icon-search" style="position:absolute; left: 18px; top: 8px" @click="onClick('asdfsadf')"></i>
      <input v-model="searchText" type="text" id="headerInput" placeholder="What do you want to learn?"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      searchText: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.landing_page_wrapper{
  position:relative;
}
::placeholder {
  color: #ffffff;
  opacity: 1; /* Firefox */
}
#headerInput {
  width: 360px;
  height: 30px;
  border-radius: 20px;
  border: solid 1px #1989fa;
  background-color: rgba(0, 0, 0, 0);
  padding: 0px 0px 0px 50px;
  font-size: 12pt;
  color: #ffffff;
}
.btn-input-wrapper{
  position:absolute;
  top: 300px;
  left: 5%;
}
.el-input{
  display: inline-block;
  width: 300px;
}
.wise-saying{
  width: 380px;
  height: 38px;
  font-family: SpoqaHanSans;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;

  position:absolute;
  top: 40%;
  left: 50%;
  margin-left: -175px
}
.search-box{
  display:inline-block;
  position:absolute;
  top: 50%;
  left: 50%;
  margin-left: -180px;
}
#icon_search{
  font-size: 20px;
  color: red;
}

.wise-saying-phone{
  width: 380px;
  height: 38px;
  font-family: SpoqaHanSans;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;

  position:absolute;
  top: 40%;
  left: 50%;
  margin-left: -190px
}
.search-box-phone{
  display:none;
  position:absolute;
  top: 300px;
  left: 50%;
  margin-left: -180px;
}

</style>
