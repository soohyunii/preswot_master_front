<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <el-button type="primary">Primary Button Tset</el-button>
  </div>
</template>

<script>
// Import element-ui css
import 'element-ui/lib/theme-chalk/index.css'; // eslint-disable-line

export default {
  name: 'app',
};
</script>

<style>
</style>
