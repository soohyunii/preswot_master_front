import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import layout from './layoutStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    layout,
  },
});
