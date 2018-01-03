<template>
  <div id="app">
    <router-link to="/">Landing Page</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <router-view/>
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
