import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import layout from './layoutStore';
import sc from './scStore';
import lc from './lcStore';
import scItem from './scItemStore';
import sibalClassIsReservedWord from './classStore';
import NNclass from './NNclassStore';
import analysis from './analysisStore';
import board from './boardStore';
import kMap from './kMapStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    layout,
    scItem,
    sc,
    lc,
    class: sibalClassIsReservedWord,
    NNclass,
    analysis,
    board,
    kMap,
  },
});
