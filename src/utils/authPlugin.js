// import store from '../stores';
import utils from '../utils';

// window.setInterval(() => {
//   console.log(store); // eslint-disable-line
// }, 1000);
import store from '../stores';

export default class AuthPlugin {
  constructor(options) {
    this._applyRouteGuard(options.router);
  }

  static install(Vue, options) {
    Vue.prototype.$auth = new AuthPlugin(options); // eslint-disable-line no-param-reassign
  }

  _applyRouteGuard(router) { // eslint-disable-line class-methods-use-this
    router.beforeEach(async (to, from, next) => {
      const route = to.matched.find(e => e.meta.auth !== null);
      // console.log('beforeEach', route);
      // * Collapse AppNav after every routing
      store.commit('layout/updateCollapse', {
        isNavCollapsed: true,
      });
      if (!route) {
        next({
          name: 'NotFound',
        });
        return;
      }

      // If user routes himeself before force-redirection, cancel timeout
      if (route.name !== 'NotFound' && !!store.state.auth.redirectionTimeoutId) {
        window.clearTimeout(store.state.auth.redirectionTimeoutId);
        store.commit('auth/updateRedirectionTimeoutId', {
          redirectionTimeoutId: null,
        });
        next();
        return;
      }

      // TODO: split `auth` into two difference variables: authenticaion, authorization
      const auth = route.meta.auth;
      // * if authentication is not required, just route
      if (!auth) {
        next();
        return;
      }

      // TODO: check jwt is present and valid
      const jwt = utils.getJwtFromLocalStorage();
      // const loginRequired = 1; // Math.random() < 0.5;
      if (!jwt) {
        // TODO: show noti (notification that you're not logged in)
        next({
          name: 'Login',
          params: {
            to: to.path,
          },
        });
      } else {
        next();
      }
    });
  }
}
