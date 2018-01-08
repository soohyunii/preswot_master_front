import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../components/LandingPage';
import Login from '../components/Login';
import Register from '../components/Register';
import Test from '../components/TestComponent';
import authRoutes from './authRoutes';

Vue.use(Router);

export default new Router({
  mode: 'history',
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
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    ...authRoutes('/a'),
    {
      path: '*',
      name: 'NotFound',
      component: Test,
    },
  ],
});
