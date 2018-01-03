import auth from '../services/auth';

function getJwtFromLocalStorage() {
  const jwt = localStorage.getItem('jwt') || '';
  // TODO: Replace dummy validation
  if (jwt.endsWith('valid')) {
    return jwt;
  }
  localStorage.setItem('jwt', null);
  return '';
}
export default {
  namespaced: true,
  state: {
    jwt: getJwtFromLocalStorage(),
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
