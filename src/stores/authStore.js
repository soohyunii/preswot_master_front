import jwtDecode from 'jwt-decode';

import authService from '../services/authService';
import utils from '../utils';
import http from '../services/http';

export default {
  namespaced: true,
  state: {
    jwt: utils.getJwtFromLocalStorage(),
    temporalJwt: '', // 아직 약관에 동의하지 않은 경우, 토큰 임시 저장.
    locale: utils.getDefaultLocale(),
    redirectionTimeoutId: null,
  },
  getters: {
    isJwtValid(state) {
      // TODO: Implement jwt validation check
      return !!state.jwt;
    },
    userId(state) {
      const payload = jwtDecode(state.jwt);
      return payload.authId;
    },
  },
  mutations: {
    updateJwt(state, { jwt }) {
      state.jwt = jwt;
      window.localStorage.setItem('jwt', jwt);
      http.defaults.headers.common['x-access-token'] = jwt || null;
    },
    updateTemporalJwt(state, { jwt }) {
      state.temporalJwt = jwt;
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
      if (res.data.terms === 0) { // 아직 약관에 동의하지 않았다면
        commit('updateTemporalJwt', {
          jwt: res.data.token,
        });
      } else if (res.data.success) {
        commit('updateJwt', {
          jwt: res.data.token,
        });
      } else {
        throw new Error('login failed');
      }
      return res;
    },
    async agreeTos({ state, commit }) {
      commit('updateJwt', {
        jwt: state.temporalJwt,
      });
      await authService.agreeTos();
    },
    async findPassword({ commit }, { email }) {
      await authService.findPassword({ email });
    },
    async putPassword({ commit }, { newPassword, key, userId }) {
      await authService.putPassword({ newPassword, key, userId });
    },
    async checkUserPW({ commit }, { password }) {
      await authService.checkUserPW({ password });
    },
    returnUserInfo({ state }, { userID }) {
      return authService.returnUserInfo({ userID });
    },
  },
};
