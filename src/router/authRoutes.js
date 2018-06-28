// import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import TeacherClassIndex from '../components/pages/TeacherClassIndex';
import NNTeacherClassIndex from '../components/pages/NNTeacherClassIndex';
import NNTeacherClassNew from '../components/pages/NNTeacherClassNew';
import NNTeacherClassShow from '../components/pages/NNTeacherClassShow';
import NNTeacherLectureNew from '../components/pages/NNTeacherLectureNew';
import NNTeacherLectureManage from '../components/pages/NNTeacherLectureManage';
import NNTeacherLectureLive from '../components/pages/NNTeacherLectureLive';
import NNStudentClassIndex from '../components/pages/NNStudentClassIndex';
import NNStudentClassShow from '../components/pages/NNStudentClassShow';
import TeacherLectureNew from '../components/pages/TeacherLectureNew';
import TeacherLectureLive from '../components/pages/TeacherLectureLive';
import StudentClassIndex from '../components/pages/StudentClassIndex';
import NNStudentLectureLive from '../components/pages/NNStudentLectureLive';
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
import StudentClassReport from '../components/pages/StudentReport';
import TeacherClassReport from '../components/pages/TeacherReport';
import TeacherClassGrading from '../components/pages/TeacherClassGrading';

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
      alias: '/teacher/NNclass/:classId/edit',
      path: '/teacher/NNclass/new',
      name: 'NNTeacherClassNew',
      component: NNTeacherClassNew,
      meta: {
        title: 'ddd',
      },
    },
    {
      path: '/teacher/NNlecture/new',
      name: 'NNTeacherLectureNew',
      component: NNTeacherLectureNew,
      meta: {
        title: 'Teacher Lecture New',
      },
    },
    {
      path: '/teacher/NNlecture/:lectureId/manage',
      name: 'NNTeacherLectureManage',
      component: NNTeacherLectureManage,
      meta: {
        title: 'Teacher Lecture Manage',
      },
    },
    {
      path: '/teacher/NNlecture/:lectureId/live',
      name: 'NNTeacherLectureLive',
      component: NNTeacherLectureLive,
      meta: {
        title: 'Teacher Lecture Live',
      },
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
      path: '/teacher/NNclass/:classId',
      name: 'Teacher Class Show',
      component: NNTeacherClassShow,
      meta: {
        title: 'Teacher Class Show', // TODO: import from i18n
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
      path: '/teacher/class/:classId/grading',
      name: 'TeacherClassGraading',
      component: TeacherClassGrading,
      meta: {
        title: 'Teacher Class Grading',
      },
    },
    {
      path: '/class/:classId/questionanswer/:pageNum',
      name: 'ClassQuestionAnswer',
      component: ClassQuestionAnswer,
      meta: {
        title: 'Class Q&A',
      },
    },
    {
      path: '/class/:classId/questionanswerwrite',
      name: 'ClassQuestionAnswerWrite',
      component: ClassQuestionAnswerWrite,
      meta: {
        title: 'Class Q&A Write',
      },
    },
    {
      path: '/class/:classId/questionanswerdetail/:boardId',
      name: 'ClassQuestionDetail',
      component: ClassQuestionAnswerDetail,
      meta: {
        title: 'Class Q&A Detail',
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
      path: '/student/NNclass/',
      name: 'NNStudentClass',
      component: NNStudentClassIndex,
      meta: {
        title: 'NN Student Class Index', // TODO: import from i18n
      },
    },
    {
      path: '/student/NNclass/:classId',
      name: 'Student Class Show',
      component: NNStudentClassShow,
      meta: {
        title: 'NN Student Class Show', // TODO: import from i18n
      },
    },
    /*
    {
      path: '/student/lecture/:scId/:order',
      name: 'StudentLectureLive',
      component: StudentLectureLive,
      meta: {
        title: 'Student Lecture Live',
      },
    },
    */
    {
      path: '/student/NNlecture/:lectureId/:order',
      name: 'NNStudentLectureLive',
      component: NNStudentLectureLive,
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
    {
      path: '/report/student/:userId/class/:classId/',
      name: 'StudentClassReport',
      component: StudentClassReport,
      meta: {
        title: '학생 강의 보고서 페이지',
      },
    },
    {
      path: '/report/teacher/:userId/class/:classId/',
      name: 'TeacherClassReport',
      component: TeacherClassReport,
      meta: {
        title: '강사 강의 보고서 페이지',
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
