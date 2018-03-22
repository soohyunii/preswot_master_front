import http from './http';

export default {
  submitSurvey({
    surveyId,
    answer,
  }) {
    return http.post(`/student/survey/${surveyId}`, {
      answer,
    });
  },
  submitQuestion({
    questionId,
    answers,
    interval,
    codeLanguage,
  }) {
    return http.post('/student/answer', {
      questionId,
      answers,
      interval,
      codeLanguage,
    });
  },
  fetchAttendingClassList() {
    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            className: 'Python',
          },
          {
            className: 'JavaScript',
          },
        ]);
      }, 3000);
    });
  },
  fetchPopularClassList() {
    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([
          {
            name: 'Deep learning',
            description: '딥러닝',
            classId: 1,
            teacherList: ['aa@aa.aa'],
            startDate: '2018-03-01 00:00:00',
            endDate: '계속 활성화',
          },
          {
            name: 'Tensorflow',
            description: '텐서플로우',
            classId: 2,
            teacherList: ['aa@aa.aa'],
            startDate: '2018-03-01 00:00:00',
            endDate: '계속 활성화',
          },
          {
            name: 'C++',
            description: 'OOP',
            classId: 3,
            teacherList: ['aa@aa.aa'],
            startDate: '2018-03-01 00:00:00',
            endDate: '계속 활성화',
          },
          {
            name: 'Vue.js',
            description: '쀼',
            classId: 4,
            teacherList: ['aa@aa.aa'],
            startDate: '2018-03-01 00:00:00',
            endDate: '계속 활성화',
          },
        ]);
      }, 500);
    });
  },
};
