// import store from '../stores';

// window.setInterval(() => {
//   console.log(store); // eslint-disable-line
// }, 1000);

export default class AuthPlugin {
  constructor(options) {
    this._applyRouteGuard(options.router);
  }

  static install(Vue, options) {
    Vue.prototype.$auth = new AuthPlugin(options); // eslint-disable-line no-param-reassign
    // Vue.prototype.$auth.load();
  }

  // async load() {
  //   this._userId = 1; // TODO: get from localStorage
  //   this._userEmail = 'adoji92@gmail.com'; // TODO: get from localStorage if exists

  //   this._isLoading = false;
  // }

  _applyRouteGuard(router) { // eslint-disable-line class-methods-use-this
    router.beforeEach(async (to, from, next) => {
      const route = to.matched.find(e => e.meta.auth !== null);
      if (!route) {
        next({
          name: 'NotFound',
        });
        return;
      }

      // TODO: split `auth` into two difference variables: authenticaion, authorization
      const auth = route.meta.auth;
      // if authentication is not required, just route
      if (!auth) {
        next();
        return;
      }

      // TODO: check jwt is present and valid
      // const loginRequired = Math.random() < 0.5;
      const loginRequired = false;
      if (loginRequired) {
        // TODO: show noti (notification that you're not logged in)
        next({
          name: 'Login',
        });
      } else {
        next();
      }
    });
  }
}
