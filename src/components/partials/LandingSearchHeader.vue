<template>
  <div class="wrapper"> <!-- position:absolute의 부모가 되기 위해 relative 속성 부여 -->
    <pre id="centerWord" style="position:absolute; top: 300px; left: 50%; margin-left: -175px">
      배움은 우연히 얻을 수 없다. 그것은 타는 열정으로
      구해야 하며, 부지런함으로 참여해야 한다.
      - 아비가일 애덤스
    </pre>
    <div style="display:inline-block; position:absolute; top: 400px; left: 50%; margin-left: -180px">
      <i id="icon_search" class="el-icon-search" style="position:absolute; left: 18px; top: 8px" @click="onClick('asdfsadf')"></i>
      <input v-model="searchText" type="text" id="headerInput" placeholder="What do you want to learn?"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchText: '',
    };
  },
};
</script>
<style lang="scss" scoped>
.wrapper{
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
#centerWord{
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
}
#icon_search{
  font-size: 20px;
  color: red;
}
</style>
