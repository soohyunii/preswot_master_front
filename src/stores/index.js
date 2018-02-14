import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import layout from './layoutStore';
import teacher from './teacherStore';
import sc from './scStore';
import sibalClassIsReservedWord from './classStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    layout,
    teacher,
    sc,
    class: sibalClassIsReservedWord,
  },
});
