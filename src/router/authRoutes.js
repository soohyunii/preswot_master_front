// import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import TeacherClassIndex from '../components/pages/TeacherClassIndex';
import TeacherLectureNew from '../components/pages/TeacherLectureNew';
import TeacherLectureLive from '../components/pages/TeacherLectureLive';
import StudentClassIndex from '../components/pages/StudentClassIndex';
import StudentLectureLive from '../components/pages/StudentLectureLive';
import TeacherClassNew from '../components/pages/TeacherClassNew';
import TeacherClassEdit from '../components/pages/TeacherClassEdit';
import wordCloudExample from '../components/partials/wordCloudExample';
import StudentClassJournal from '../components/pages/StudentClassJournal';
import TeacherClassJournal from '../components/pages/TeacherClassJournal';
import test from '../components/partials/test';


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
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        title: 'test', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/wordCloudExample',
      name: 'wordCloudExample',
      component: wordCloudExample,
      meta: {
        title: 'wordCloudExample', // TODO: import from i18n
        auth: true,
      },
    },
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
      path: '/teacher/class/',
      name: 'TeacherClass',
      component: TeacherClassIndex,
      meta: {
        title: 'Teacher Class Index', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/class/new',
      name: 'TeacherClassNew',
      component: TeacherClassNew,
      meta: {
        title: 'Teacher Class New', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/class/:classId/edit',
      name: 'TeacherClassEdit',
      component: TeacherClassEdit,
      meta: {
        title: 'Teacher Class Edit', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/:scId/edit',
      name: 'TeacherLectureNew',
      component: TeacherLectureNew,
      meta: {
        title: 'Teacher New Lecture', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/:scId/live',
      name: 'TeacherLectureLive',
      component: TeacherLectureLive,
      meta: {
        title: 'Teacher New Live', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/student/class/',
      name: 'StudentClass',
      component: StudentClassIndex,
      meta: {
        title: 'Student Class Index', // TODO: import from i18n
        auth: true,
      },
    },
    {
      path: '/student/lecture/:scId/live',
      name: 'StudentLectureLive',
      component: StudentLectureLive,
      meta: {
        title: 'Student Lecture Live',
        auth: true,
      },
    },
    {
      path: '/student/class/journal',
      name: 'StudentClassJournal',
      component: StudentClassJournal,
      meta: {
        title: 'Student Class Journal',
        auth: true,
      },
    },
    {
      path: '/teacher/class/journal',
      name: 'TeacherClassJournal',
      component: TeacherClassJournal,
      meta: {
        title: 'Teacher Class Journal',
        auth: true,
      },
    },
  ].map((route) => {
    route.path = root + route.path; // eslint-disable-line no-param-reassign
    return route;
  });
}
