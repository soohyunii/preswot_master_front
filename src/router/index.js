import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../components/pages/LandingPage';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import NotFound from '../components/pages/NotFound';
import ClassIndex from '../components/pages/ClassIndex';
// import Test from '../components/TestComponent';
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
    {
      path: '/classes',
      name: 'ClassIndex',
      component: ClassIndex,
    },
    ...authRoutes('/a'),
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});
