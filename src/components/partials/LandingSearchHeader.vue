<template>
  <div class="wrapper"> <!-- position:absolute의 부모가 되기 위해 relative 속성 부여 -->
    <img :src="require('@/assets/home.jpg')" width="100%" style="height: 410px; object-fit: cover; object-position: top;">
    <div class="btn-input-wrapper">
      <!-- TODO
      <el-button icon="el-icon-search"></el-button>
      <div class="el-input">
        <el-input placeholder="What do you want to learn?" v-model="searchText"></el-input>
      </div>
      -->
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
.btn-input-wrapper{
  position:absolute;
  top: 300px;
  left: 5%;
}
.el-input{
  display: inline-block;
  width: 300px;
}
</style>
