import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authStore';
import user from './userStore';
import layout from './layoutStore';
import student from './studentStore';
import teacher from './teacherStore';
import analysis from './analysisStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    user,
    layout,
    student,
    teacher,
    analysis,
  },
});
