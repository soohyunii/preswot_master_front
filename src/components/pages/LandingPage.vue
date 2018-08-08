<template>
  <div id="landing_page_wrapper" class="bt-container">
    <pre :class="$attachReactablePostfix('wise-saying')">
      {{selectedSaying}}
    </pre>
    <div :class="$attachReactablePostfix('search-box')">
      <i id="icon_search" class="el-icon-search" style="position:absolute; left: 18px; top: 8px" @click="onClick('asdfsadf')"></i>
      <input v-model="searchText" type="text" id="headerInput" placeholder="What do you want to learn?"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const saying = [
      '배움은 우연히 얻을 수 없다. 그것은 타는 열정으로\n구해야 하며, 부지런함으로 참여해야 한다.\n- 아비가일 애덤스',
      '굳은 결심은 가장 유용한 지식이다.\n- 나폴레옹',
      '꿈을 품고 시작하라.\n새로운 일을 시작하는 용기 속에\n당신의 천재성과 능력과 기적이 모두 숨어있다.\n- 요한 볼프강 괴테',
    ];
    return {
      saying,
      selectedSaying: '',
      searchText: '',
    };
  },
  created() {
    // 출력할 명언 무작위로 선택
    const index = Math.floor(Math.random() * this.saying.length);
    this.selectedSaying = this.saying[index];
  },
  methods: {
    async onClick(type) {
      switch (type) {
        case 'SEARCH': {
          this.$router.push({ path: '/classes', query: { type: 'name', text: `${this.searchText}` } });
          break;
        }
        default: {
          break;
        }
      }
    },
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
