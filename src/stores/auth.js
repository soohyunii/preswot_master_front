import auth from '../services/auth';

export default {
  namespaced: true,
  state: {
    jwt: localStorage.getItem('jwt') || '',
  },
  mutations: {
    updateJwt(state, { jwt }) {
      state.jwt = jwt;
      window.localStorage.setItem('jwt', jwt);
    },
  },
  actions: {
    async reqLogin({ commit }, { email, password }) {
      const res = await auth.login({ email, password });
      console.log('store auth', res); // eslint-disable-line
      commit('updateJwt', {
        jwt: res.jwt,
      });
    },
  },
};
