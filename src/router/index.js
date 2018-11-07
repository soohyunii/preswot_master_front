import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../components/pages/LandingPage';
import Login from '../components/pages/Login';
import FindingPasswordPage from '../components/pages/FindingPasswordPage';
import Register from '../components/pages/Register';
import DownloadPage from '../components/pages/DownloadPage';
import PolicyPage from '../components/pages/PolicyPage';
import NotFound from '../components/pages/NotFound';
import ClassIndex from '../components/pages/ClassIndex';
import ClassDetail from '../components/pages/ClassDetail';
// import Test from '../components/TestComponent';
import authRoutes from './authRoutes';
import Manager from '../components/pages/Manager';
import ViewUni from '../components/pages/ViewUni';

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
      name: 'ClassIndex',
      component: ClassIndex,
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
    {
      path: '/manager',
      name: 'Manager',
      component: Manager,
      meta: {
        title: '관리자 메인 페이지',
      },
    },
    {
      path: '/view/uni',
      name: 'ViewUni',
      component: ViewUni,
      meta: {
        title: '관리자 조회하기-대학',
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
