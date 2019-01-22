// import Test from '../components/TestComponent';
import Profile from '../components/pages/Profile';
import ProfileEdit from '../components/pages/ProfileEdit';
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
import NNStudentLectureLive from '../components/pages/NNStudentLectureLive';
// import TeacherClassNew from '../components/pages/TeacherClassNew'; // season 0
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
import TeacherClassGradingQuestion from '../components/pages/TeacherClassGradingQuestion';
import TeacherClassGradingSurvey from '../components/pages/TeacherClassGradingSurvey';
import StudentClassGrade from '../components/pages/StudentClassGrade';
import Bank from '../components/pages/Bank';
import NClassFromBank from '../components/pages/NClassFromBank';
import NLectureFromBank from '../components/pages/NLectureFromBank';
import NLectureItemFromBank from '../components/pages/NLectureItemFromBank';

import ViewUni from '../components/pages/ViewUni';
// import ViewUniUpdate from '../components/pages/ViewUniUpdate';
import ViewDept from '../components/pages/ViewDept';
import ViewTeacher from '../components/pages/ViewTeacher';
// import ViewTeacherAll from '../components/pages/ViewTeacherAll';
import ViewClass from '../components/pages/ViewClass';
import ViewDetailClass from '../components/pages/ViewClassAll';
import ViewStudent from '../components/pages/ViewStudent';
import ViewStudentScore from '../components/pages/ViewStudentScore';
import ViewDetailStudent from '../components/pages/ViewDetailStudent';
import ViewBank from '../components/pages/ViewBank';
import RegisterUni from '../components/pages/RegisterUni';

// import RegisterUniEdit from '../components/pages/RegisterUni';
import RegisterUniSuccess from '../components/pages/RegisterUniSuccess';
import RegisterDept from '../components/pages/RegisterDept';
import RegisterDeptSuccess from '../components/pages/RegisterDeptSuccess';
import RegisterTeacher from '../components/pages/RegisterTeacher';
import RegisterTeacherSuccess from '../components/pages/RegisterTeacherSuccess';
import RegisterClass from '../components/pages/RegisterClass';
import RegisterClassSuccess from '../components/pages/RegisterClassSuccess';
import RegisterStudent from '../components/pages/RegisterStudent';
import RegisterStudentSuccess from '../components/pages/RegisterStudentSuccess';
import RegisterBank from '../components/pages/RegisterBank';
import RegisterBankSuccess from '../components/pages/RegisterBankSuccess';


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
      path: '/profileEdit',
      name: 'ProfileEdit',
      component: ProfileEdit,
      meta: {
        title: 'ProfileEdit',
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
      path: '/teacher/NNclass/newfrombank',
      name: 'NClassFromBank',
      component: NClassFromBank,
      meta: {
        title: 'New Class From Bank',
      },
    },
    {
      path: '/teacher/NNlecture/newfrombank',
      name: 'NLectureFromBank',
      component: NLectureFromBank,
      meta: {
        title: 'New Lecture From Bank',
      },
    },
    {
      path: '/teacher/NNlecture/newitemfrombank',
      name: 'NLectureItemFromBank',
      component: NLectureItemFromBank,
      meta: {
        title: 'New Lecture Item From Bank',
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
    /*  // season 0
    {
      path: '/teacher/class/new',
      name: 'TeacherClassNew',
      component: TeacherClassNew,
      meta: {
        title: 'Teacher Class New', // TODO: import from i18n
      },
    },
    */
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
      name: 'TeacherClassGrading',
      component: TeacherClassGrading,
      meta: {
        title: 'Teacher Class Grading',
      },
    },
    {
      path: '/teacher/class/:classId/grading/question/:itemId',
      name: 'TeacherClassGradingQuestion',
      component: TeacherClassGradingQuestion,
      meta: {
        title: 'Teacher Class Grading Question',
      },
    },
    {
      path: '/teacher/class/:classId/grading/survey/:itemId',
      name: 'TeacherClassGradingSurvey',
      component: TeacherClassGradingSurvey,
      meta: {
        title: 'Teacher Class Grading Survey',
      },
    },
    {
      path: '/student/class/:classId/grade',
      name: 'StudentClassGrade',
      component: StudentClassGrade,
      meta: {
        title: 'Student Class Grade',
      },
    },
    {
      path: '/class/:classId/board/:pageNum',
      name: 'ClassQuestionAnswer',
      component: ClassQuestionAnswer,
      meta: {
        title: 'Class Q&A',
      },
    },
    {
      path: '/class/:classId/boardwrite',
      name: 'ClassQuestionAnswerWrite',
      component: ClassQuestionAnswerWrite,
      meta: {
        title: 'Class Q&A Write',
      },
    },
    {
      path: '/class/:classId/boarddetail/:boardId',
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
      path: '/student/NNclass/',
      name: 'NNStudentClassIndex',
      component: NNStudentClassIndex,
      meta: {
        title: 'Student Class Index 2', // TODO: import from i18n
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

    {
      path: '/bank',
      name: 'Bank',
      component: Bank,
      meta: {
        title: '강의 은행',
      },
    },

   // NOTE: 행정개발 
    {
      path: '/view/uni',
      name: 'ViewUni',
      component: ViewUni,
      meta: {
        title: '조회하기-대학',
      },
    },
    {
      path: '/view/dept',
      name: 'ViewDept',
      component: ViewDept,
      meta: {
        title: '관리자 학과 조회',
      },
    },   
    {
      path: '/view/teacher',
      name: 'ViewTeacher',
      component: ViewTeacher,
      meta: {
        title: '관리자 강사 조회',
      },
    },
    {
      path: '/view/class',
      name: 'ViewClass',
      component: ViewClass,
      meta: {
        title: '관리자 과목 및 강의 조회',
      },
    },
    {
      path: '/view/:code/detail',
      name: 'ViewDetailClass',
      component: ViewDetailClass,
      meta: {
        title: '관리자 과목 상세 보기',
      },
    },
    {
      path: '/view/student',
      name: 'ViewStudent',
      component: ViewStudent,
      meta: {
        title: '관리자 학생 조회',
      },
    },
    {
      path: '/view/studentScore',
      name: 'ViewStudentScore',
      component: ViewStudentScore,
      meta: {
        title: '관리자 학생성적표 조회',
      },
    },
    {
      path: '/student/:code/detail',
      name: 'ViewDetailStudent',
      component: ViewDetailStudent,
      meta: {
        title: '관리자 학생 개인 성적표 조회',
      },
    },
    {
      path: '/view/bank',
      name: 'ViewBank',
      component: ViewBank,
      meta: {
        title: '관리자 강의은행 조회',
      },
    },
    {
      path: '/register/uni',
      name: 'RegisterUni',
      component: RegisterUni,
      meta: {
        title: '관리자 대학 등록',
      },
    },
    {
      path: '/register/uni/success',
      name: 'RegisterUniSuccess',
      component: RegisterUniSuccess,
      meta: {
        title: '관리자 대학 등록 성공',
      },
    },
    /*{
      alias: '/register/uni/edit/:code',
      path: '/register/uni',
      name: 'RegisterUni',
      component: RegisterUni,
      meta: {
        title: '관리자 대학 수정',
      },
    },*/
    {
      alias: '/:code/edit',
      path: '/register/uni',
      name: 'RegisterUni',
      component: RegisterUni,
      meta: {
        title: '관리자 대학 수정',
      },
    },
    {
      path: '/register/dept',
      name: 'RegisterDept',
      component: RegisterDept,
      meta: {
        title: '관리자 학과 등록',
      },
    },
    {
      path: '/register/dept/success',
      name: 'RegisterDeptSuccess',
      component: RegisterDeptSuccess,
      meta: {
        title: '관리자 학과 등록 성공',
      },
    },
    {
      alias: '/:code/dept/:code/edit',
      path: '/register/dept',
      name: 'RegisterDept',
      component: RegisterDept,
      meta: {
        title: '관리자 학과 수정',
      },
    },
    {
      path: '/register/teacher',
      name: 'RegisterTeacher',
      component: RegisterTeacher,
      meta: {
        title: '관리자 강사 등록',
      },
    },
    {
      path: '/register/teacher/success',
      name: 'RegisterTeacherSuccess',
      component: RegisterTeacherSuccess,
      meta: {
        title: '관리자 강사 등록 성공',
      },
    },
    {
      alias: '/teacher/:code/edit',
      path: '/register/teacher',
      name: 'RegisterTeacher',
      component: RegisterTeacher,
      meta: {
        title: '관리자 강사 수정',
      },
    },
    {
      path: '/register/class',
      name: 'RegisterClass',
      component: RegisterClass,
      meta: {
        title: '관리자 과목 등록',
      },
    },
    {
      alias: '/class/:code/edit',
      path: '/register/class',
      name: 'RegisterClass',
      component: RegisterClass,
      meta: {
        title: '관리자 과목 수정',
      },
    },
    {
      path: '/register/class/success',
      name: 'RegisterClassSuccess',
      component: RegisterClassSuccess,
      meta: {
        title: '관리자 과목 등록 성공',
      },
    },
    {
      path: '/register/student',
      name: 'RegisterStudent',
      component: RegisterStudent,
      meta: {
        title: '관리자 학생 등록',
      },
    },
    {
      path: '/register/student/success',
      name: 'RegisterStudentSuccess',
      component: RegisterStudentSuccess,
      meta: {
        title: '관리자 학생 등록 성공',
      },
    },
    {
      alias: '/student/:code/edit',
      path:'/register/student',
      name: 'RegisterStudent',
      component: RegisterStudent,
      meta: {
        title: '관리자 학생 수정',
      },
    },
    {
      path: '/register/bank',
      name: 'RegisterBank',
      component: RegisterBank,
      meta: {
        title: '관리자 강의은행그룹 등록',
      },
    },
    {
      alias: '/bank/:code/edit',
      path: '/register/bank',
      name: 'RegisterBank',
      component: RegisterBank,
      meta: {
        title: '관리자 강의은행그룹 수정',
      },
    },
    {
      path: '/register/bank/success',
      name: 'RegisterBankSuccess',
      component: RegisterBankSuccess,
      meta: {
        title: '관리자 강의은행그룹 등록 성공',
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
