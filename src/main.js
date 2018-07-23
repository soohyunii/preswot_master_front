// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ko';
import VueI18n from 'vue-i18n';
import VueTheMask from 'vue-the-mask';
import VueResize from 'vue-resize';
import Vue2Filters from 'vue2-filters';
import Vlf from 'vlf';
import VueScrollTo from 'vue-scrollto';
import VueYoutubeEmbed from 'vue-youtube-embed';
import VueSocketio from 'vue-socket.io';
import Buefy from 'buefy';

import authPlugin from './utils/authPlugin';
import App from './App';
import router from './router';
import store from './stores';
import messages from './messages';
import utils from './utils';
import { websocketUrl } from './services/config';
import appPlugin from './utils/appPlugin';


Vue.use(appPlugin);
Vue.config.productionTip = false;
Vue.use(Element, {
  locale,
});
Vue.use(VueI18n);
Vue.use(VueTheMask);
Vue.use(authPlugin, {
  router,
});
Vue.use(VueResize);
Vue.use(Vue2Filters);
Vue.use(Vlf);
Vue.use(VueScrollTo);
Vue.use(VueYoutubeEmbed);
Vue.use(VueSocketio, websocketUrl, store);
Vue.use(Buefy);

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
