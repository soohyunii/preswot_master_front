import authService from '../services/auth';

function getJwtFromLocalStorage() {
  const jwt = localStorage.getItem('jwt') || '';
  // TODO: Replace dummy validation
  if (jwt.endsWith('unexpired')) {
    return jwt;
  }
  // if jwt is expired, erase it then return empty string
  localStorage.setItem('jwt', '');
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
