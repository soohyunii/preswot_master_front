// import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import TeacherHome from '../components/pages/TeacherHome';
import TeacherLectureNew from '../components/pages/TeacherLectureNew';
import TeacherLectureLive from '../components/pages/TeacherLectureLive';
import StudentRealtime from '../components/pages/StudentRealtime';

export default function authRoutes(root) {
  return [
    // {
    //   path: '/admin-home', // FIXME: path가 너무 좀 이상한데 걍 /admin이 나을듯
    //   name: 'AdminHome',
    //   component: Test, // TODO: replace dummy with real component
    //   meta: {
    //     title: 'Admin Home', // TODO: import from i18n
    //     auth: true,
    //   },
    // },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Profile', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher',
      name: 'TeacherHome',
      component: TeacherHome,
      meta: {
        title: 'Teacher Home', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/new',
      name: 'TeacherLectureNew',
      component: TeacherLectureNew,
      meta: {
        title: 'Teacher New Lecture', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/live',
      name: 'TeacherLectureLive',
      component: TeacherLectureLive,
      meta: {
        title: 'Teacher New Live', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/student/lecture/realtime',
      name: 'StudentRealtime',
      component: StudentRealtime,
      meta: {
        title: 'Student RealTime',
        auth: true,
      },
    },
  ].map((route) => {
    route.path = root + route.path; // eslint-disable-line no-param-reassign
    return route;
  });
}
