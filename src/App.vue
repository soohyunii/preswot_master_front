<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <el-button type="primary">Primary Button Tset</el-button>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'; // eslint-disable-line

export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
