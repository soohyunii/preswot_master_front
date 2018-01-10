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
      // 로그인 성공/실패 가정
      const login = Math.random() < 0.5;
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
