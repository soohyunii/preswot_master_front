import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import layout from './layoutStore';
import teacher from './teacherStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    layout,
    teacher,
  },
});
