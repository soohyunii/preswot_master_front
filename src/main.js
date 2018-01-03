// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ko';
import VueI18n from 'vue-i18n';

import App from './App';
import router from './router';
import store from './stores';
import messages from './messages';
import utils from './utils';


Vue.config.productionTip = false;
Vue.use(Element, {
  locale,
});
Vue.use(VueI18n);

const defaultLocale = utils.getDefaultLocale();

const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'ko',
  messages,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App },
  render: h => h(App),
});
