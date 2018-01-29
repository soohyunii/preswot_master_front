import authService from '../services/authService';
import utils from '../utils';

export default {
  namespaced: true,
  state: {
    jwt: utils.getJwtFromLocalStorage(),
    locale: utils.getDefaultLocale(),
    redirectionTimeoutId: null,
  },
  getters: {
    isJwtValid(state) {
      // TODO: Implement jwt validation check
      return !!state.jwt;
    },
  },
  mutations: {
    updateJwt(state, { jwt }) {
      state.jwt = jwt;
      window.localStorage.setItem('jwt', jwt);
    },
    updateLocale(state, { locale }) {
      state.locale = locale;
      window.localStorage.setItem('locale', locale);
    },
    updateRedirectionTimeoutId(state, { redirectionTimeoutId }) {
      state.redirectionTimeoutId = redirectionTimeoutId;
    },
  },
  actions: {
    async reqLogin({ commit }, { email, password }) {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        commit('updateJwt', {
          jwt: res.data.token,
        });
      } else {
        throw new Error('login failed');
      }
      return res;
    },
  },
};
