import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import layout from './layoutStore';
import sc from './scStore';
import scItem from './scItemStore';
import sibalClassIsReservedWord from './classStore';
import analysis from './analysisStore';
import board from './boardStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    layout,
    scItem,
    sc,
    class: sibalClassIsReservedWord,
    analysis,
    board,
  },
});
