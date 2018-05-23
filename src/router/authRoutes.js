// import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import TeacherClassIndex from '../components/pages/TeacherClassIndex';
import NNTeacherClassIndex from '../components/pages/NNTeacherClassIndex';
import NNTeacherClassNew from '../components/pages/NNTeacherClassNew';
import TeacherLectureNew from '../components/pages/TeacherLectureNew';
import TeacherLectureLive from '../components/pages/TeacherLectureLive';
import StudentClassIndex from '../components/pages/StudentClassIndex';
import StudentLectureLive from '../components/pages/StudentLectureLive';
import TeacherClassNew from '../components/pages/TeacherClassNew';
import TeacherClassEdit from '../components/pages/TeacherClassEdit';
import TeacherClassEvaluation from '../components/pages/TeacherClassEvaluation';
import TeacherClassScoring from '../components/pages/TeacherClassScoring';
// import wordCloudExample from '../components/partials/wordCloudExample';
import StudentClassJournal from '../components/pages/StudentClassJournal';
import TeacherClassJournal from '../components/pages/TeacherClassJournal';
import StudentLectureJournal from '../components/pages/StudentLectureJournal';
import TeacherLectureJournal from '../components/pages/TeacherLectureJournal';
import ClassQuestionAnswer from '../components/pages/ClassQuestionAnswer';
import ClassQuestionAnswerWrite from '../components/pages/ClassQuestionAnswerWrite';
import ClassQuestionAnswerDetail from '../components/pages/ClassQuestionAnswerDetail';
import test from '../components/partials/test';


export default function authRoutes(root) {
  return [
    // {
    //   path: '/admin-home', // FIXME: path가 너무 좀 이상한데 걍 /admin이 나을듯
    //   name: 'AdminHome',
    //   component: Test, // TODO: replace dummy with real component
    //   meta: {
    //     title: 'Admin Home', // TODO: import from i18n
    //   },
    // },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        title: 'test', // TODO: import from i18n
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Profile', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/class/',
      name: 'TeacherClass',
      component: TeacherClassIndex,
      meta: {
        title: 'Teacher Class Index', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/NNclass/',
      name: 'NNTeacherClassIndex',
      component: NNTeacherClassIndex,
      meta: {
        title: 'Teacher Class Index2', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/NNclass/new',
      name: 'NNTeacherClassNew',
      component: NNTeacherClassNew,
      meta: {
        title: 'ddd',
      },
      alias: '/teacher/NNclass/:classId/edit',
    },
    {
      path: '/teacher/class/new',
      name: 'TeacherClassNew',
      component: TeacherClassNew,
      meta: {
        title: 'Teacher Class New', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/class/:classId/edit',
      name: 'TeacherClassEdit',
      component: TeacherClassEdit,
      meta: {
        title: 'Teacher Class Edit', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/class/:classId/evaluation',
      name: 'TeacherClassEvaluation',
      component: TeacherClassEvaluation,
      meta: {
        title: 'Teacher Class Evaluation',
      },
    },
    {
      path: '/teacher/class/:classId/scoring',
      name: 'TeacherClassScoring',
      component: TeacherClassScoring,
      meta: {
        title: 'Teacher Class Scoring',
      },
    },
    {
      path: '/class/:classId/questionanswer/:pageNum',
      name: 'ClassQuestionAnswer',
      component: ClassQuestionAnswer,
      meta: {
        title: 'Class Q&A',
        auth: true,
      },
    },
    {
      path: '/class/:classId/questionanswerwrite',
      name: 'ClassQuestionAnswerWrite',
      component: ClassQuestionAnswerWrite,
      meta: {
        title: 'Class Q&A Write',
        auth: true,
      },
    },
    {
      path: '/class/:classId/questionanswerdetail/:boardId',
      name: 'ClassQuestionDetail',
      component: ClassQuestionAnswerDetail,
      meta: {
        title: 'Class Q&A Detail',
        auth: true,
      },
    },
    {
      path: '/teacher/lecture/:scId/edit',
      name: 'TeacherLectureNew',
      component: TeacherLectureNew,
      meta: {
        title: 'Teacher New Lecture', // TODO: import from i18n
      },
    },
    {
      path: '/teacher/lecture/:scId/live',
      name: 'TeacherLectureLive',
      component: TeacherLectureLive,
      meta: {
        title: 'Teacher New Live', // TODO: import from i18n
      },
    },
    {
      path: '/student/class/',
      name: 'StudentClass',
      component: StudentClassIndex,
      meta: {
        title: 'Student Class Index', // TODO: import from i18n
      },
    },
    {
      path: '/student/lecture/:scId/:order',
      name: 'StudentLectureLive',
      component: StudentLectureLive,
      meta: {
        title: 'Student Lecture Live',
      },
    },
    {
      path: '/student/class/:classId/:userId/journal',
      name: 'StudentClassJournal',
      component: StudentClassJournal,
      meta: {
        title: 'Student Class Journal',
      },
    },
    {
      path: '/teacher/class/:classId/journal',
      name: 'TeacherClassJournal',
      component: TeacherClassJournal,
      meta: {
        title: 'Teacher Class Journal',
      },
    },
    {
      path: '/student/lecture/:lectureId/:userId/journal',
      name: 'StudentLectureJournal',
      component: StudentLectureJournal,
      meta: {
        title: 'Student Lecture Journal',
      },
    },
    {
      path: '/teacher/lecture/:lectureId/journal',
      name: 'TeacherLectureJournal',
      component: TeacherLectureJournal,
      meta: {
        title: 'Teacher Lecture Journal',
      },
    },
  ].map((route) => {
    route.path = root + route.path; // eslint-disable-line no-param-reassign
    if (route.alias) {
      route.alias = root + route.alias; // eslint-disable-line no-param-reassign
    }
    if (!route.meta) {
      route.meta = {}; // eslint-disable-line no-param-reassign
    }
    route.meta.auth = true; // eslint-disable-line no-param-reassign
    return route;
  });
}
