<template>
  <div id="app_footer_wrapper">
    <div class="bt-container">
      <el-row>
        <el-col :span="24" class="first-section">
          <h3 class="first-section-title">Preswot</h3>
          <ul class="first-section-body">
            <li>
              <router-link to="/policy">Policy</router-link>
            </li>
            <li>
              <router-link to="/download">Download</router-link>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~@/variables.scss";

#app_footer_wrapper {
  border-top: lightgray 1px solid;
  .first-section {
    text-align: center;
    h3.first-section-title {
      margin-bottom: 10px;
    }
    ul.first-section-body {
      margin-top: 6px;
      list-style-type: none;
      padding: 0;
      a {
        color: $--color-primary;
        line-height: 1.8em;
        vertical-align: top;
        text-decoration: none;
      }
    }
  }
}
</style>


<script>
export default {
  name: 'AppFooter',
};
</script>
