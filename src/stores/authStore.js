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
      // TODO: try catch
      const res = await authService.login({ email, password });

      // TODO: need to validate jwt
      // window.console.log(res);
      const login = res.status;
      // jwt update 신호 주기위함
      if (login) {
        commit('updateJwt', {
          jwt: res.jwt,
        });
      } else {
        throw new Error('login failed');
      }
    },
  },
};
