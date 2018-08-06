import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../components/pages/LandingPage';
import Login from '../components/pages/Login';
import FindingPasswordPage from '../components/pages/FindingPasswordPage';
import Register from '../components/pages/Register';
import DownloadPage from '../components/pages/DownloadPage';
import PolicyPage from '../components/pages/PolicyPage';
import NotFound from '../components/pages/NotFound';
import ClassIndexTable from '../components/pages/ClassIndexTable';
// import ClassIndexCard from '../components/pages/ClassIndexCard';
import ClassDetail from '../components/pages/ClassDetail';
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
      path: '/forgot-password/:rand/:userId',
      name: 'FindingPasswordPage',
      component: FindingPasswordPage,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/download',
      name: 'Download',
      component: DownloadPage,
    },
    {
      path: '/policy',
      name: 'Policy',
      component: PolicyPage,
    },
    {
      path: '/classes',
      name: 'ClassIndexTable',
      component: ClassIndexTable,
    },
    {
      path: '/class/:classId/classdetail',
      name: 'ClassDetail',
      component: ClassDetail,
      meta: {
        title: 'Class Detail',
        auth: true,
      },
    },
    ...authRoutes('/a'),
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});
