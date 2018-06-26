/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.prototype.$isProd = document.URL.includes('preswot');
  },
};
