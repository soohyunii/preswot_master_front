<template>
  <div id="app">
    <el-container>
      <el-header :id="appTheme">
        <app-header />
      </el-header>
      <el-container>
        <el-aside width="200px" v-show="!isNavCollapsed">
          <app-navigation />
        </el-aside>
        <el-container>
          <el-main id="app_router_view_wrapper" >
            <router-view/>
          </el-main>
          <el-footer id="app_footer_wrapper">
            <app-footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    {{ appTheme }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
import objectAssign from 'object-assign';
import generateColors from './utils/color';
import './app.scss';
import './variables.scss'; // * To use $--color-primary scss variable

import AppNavigation from './components/layouts/AppNavigation';
import AppHeader from './components/layouts/AppHeader';
import AppFooter from './components/layouts/AppFooter';

export default {
  name: 'app',
  data() {
    return {
      colors: {
        primary: '#409eff',
      },
      primaryColor: '#57477f',
      originalStylesheetCount: -1,
      originalStyle: '',
      styleFiles: [],
      fontFiles: ['element-icons.ttf', 'element-icons.woff'],
      fonts: [],
    };
  },
  components: {
    AppNavigation,
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapState('layout', ['isNavCollapsed']),
    appTheme() {
      const vm = this;
      const path = vm.$route.path;
      if (path.includes('teacher')) {
        if (path.includes('live')) {
          this.colors.primary = '#eec553';
          return 'teacher_lecture_live_theme';
        }
        this.colors.primary = '#8b7ab3';
        return 'teacher_theme';
      } else if (path.includes('student')) {
        this.colors.primary = '#8f8f86';
        return 'student_theme';
      }
      return null;
    },
  },
  methods: {
    getStyleTemplate(data) {
      const colorMap = {
        '#3a8ee6': 'shade-1',
        '#409eff': 'primary',
        '#53a8ff': 'light-1',
        '#66b1ff': 'light-2',
        '#79bbff': 'light-3',
        '#8cc5ff': 'light-4',
        '#a0cfff': 'light-5',
        '#b3d8ff': 'light-6',
        '#c6e2ff': 'light-7',
        '#d9ecff': 'light-8',
        '#ecf5ff': 'light-9',
      };
      Object.keys(colorMap).forEach((key) => {
        const value = colorMap[key];
        data = data.replace(new RegExp(key, 'ig'), value); // eslint-disable-line
      });
      return data;
    },
    getFile(url, isBlob = false) {
      return new Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.responseType = isBlob ? 'blob' : '';
        client.onreadystatechange = () => {
          if (client.readyState !== 4) {
            return;
          }
          if (client.status === 200) {
            const urlArr = client.responseURL.split('/');
            resolve({
              data: client.response,
              url: urlArr[urlArr.length - 1],
            });
          } else {
            reject(new Error(client.statusText));
          }
        };
        client.open('GET', url);
        client.send();
      });
    },
    getIndexStyle() {
      this.getFile('//unpkg.com/element-ui/lib/theme-chalk/index.css')
        .then(({ data }) => {
          this.originalStyle = this.getStyleTemplate(data);
        });
    },
    getSeparatedStyles() {
      this.getFile('//unpkg.com/element-ui/lib/theme-chalk/')
        .then(({ data }) => { // eslint-disable-line
          return data.match(/href="[\w-]+\.css"/g).map(str => str.split('"')[1]);
        })
        .then((styleFiles) => { // eslint-disable-line
          return Promise.all(styleFiles.map((file) => { // eslint-disable-line
            return this.getFile(`//unpkg.com/element-ui/lib/theme-chalk/${file}`);
          }));
        })
        .then((files) => {
          this.styleFiles = files.map((file) => { // eslint-disable-line
            return {
              name: file.url,
              data: this.getStyleTemplate(file.data),
            };
          });
        });
    },
    getFontFiles() {
      Promise.all(this.fontFiles.map((font) => { // eslint-disable-line
        return this.getFile(`//unpkg.com/element-ui/lib/theme-chalk/fonts/${font}`, true);
      }))
        .then((fonts) => {
          this.fonts = fonts;
        });
    },
    writeNewStyle() {
      let cssText = this.originalStyle;
      Object.keys(this.colors).forEach((key) => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]); // eslint-disable-line
      });
      if (this.originalStylesheetCount === document.styleSheets.length) {
        const style = document.createElement('style');
        style.innerText = cssText;
        document.head.appendChild(style);
      } else {
        document.head.lastChild.innerText = cssText;
      }
    },
    submitForm() {
      this.colors = objectAssign({}, this.colors, generateColors(this.colors.primary));
      this.writeNewStyle();
    },
  },
  created() {
    this.getIndexStyle();
    this.getSeparatedStyles();
    this.getFontFiles();
  },
  async mounted() {
    const vm = this;
    await this.$nextTick();
    this.originalStylesheetCount = document.styleSheets.length;
    vm.$watch(
      () => (vm.$route.path),
      async () => {
        this.colors = await objectAssign({}, this.colors, generateColors(this.colors.primary));
        vm.writeNewStyle();
      },
    );
  },
};
</script>

<style lang="scss">
@import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
@import "~@/variables.scss";

body {
  font-family: 'Noto Sans KR', sans-serif !important;
}

#app {
  display: flex;
  min-height: 108vh;
  flex-direction: column;
}

#app_router_view_wrapper {
  background-color: $app-oatmeal;
  flex: 1;
}

#app_footer_wrapper {
  background-color: $app-oatmeal;
}

</style>

<style lang="scss">
  @import "~@/variables.scss"; // * To use $--color-primary scss variable

  #teacher_theme {
    background-color: $app-ultra-violet;
    $--color-primary: lighten($app-ultra-violet, 10%) !important;
  }

  #teacher_lecture_live_theme {
    background-color: $app-orange;
    $--color-primary: lighten($app-orange, 10%) !important;
  }

  #student_theme {
    background-color: darken($app-oatmeal, 5%);
  }

</style>