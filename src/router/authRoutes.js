import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import TeacherHome from '../components/pages/TeacherHome';
import TeacherNewLecture from '../components/pages/TeacherNewLecture';

export default function authRoutes(root) {
  return [
    {
      path: '/home',
      name: 'Home',
      component: Test, // TODO: replace dummy with real component
      meta: {
        title: 'Home', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/admin-home',
      name: 'AdminHome',
      component: Test, // TODO: replace dummy with real component
      meta: {
        title: 'Admin Home', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile, // TODO: replace dummy with real component
      meta: {
        title: 'Profile', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher',
      name: 'TeacherHome',
      component: TeacherHome, // TODO: replace dummy with real component
      meta: {
        title: 'Teacher Home', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/new',
      name: 'TeacherNewLecture',
      component: TeacherNewLecture, // TODO: replace dummy with real component
      meta: {
        title: 'Teacher New Lecture', // TODO: import from i18n
        auth: true,
      },
    },
  ].map((route) => {
    route.path = root + route.path; // eslint-disable-line no-param-reassign
    return route;
  });
}
