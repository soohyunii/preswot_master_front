import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../components/LandingPage';
import Login from '../components/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
