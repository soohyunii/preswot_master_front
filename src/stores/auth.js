import authService from '../services/auth';
import utils from '../utils';

console.log('import auth store'); // eslint-disable-line

export default {
  namespaced: true,
  state: {
    jwt: utils.getJwtFromLocalStorage(),
    locale: utils.getDefaultLocale(),
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
  },
  actions: {
    async reqLogin({ commit }, { email, password }) {
      // TODO: try catch
      const res = await authService.login({ email, password });
      // TODO: delete console.log
      console.log('store auth', res); // eslint-disable-line
      commit('updateJwt', {
        jwt: res.jwt,
      });
    },
  },
};
