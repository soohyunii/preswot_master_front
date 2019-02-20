import http from './http';

export default {
  submitSurvey({
    surveyId,
    lecture_id,
    answer,
    item_id,
    type,
    order,
  }) {
    return http.post(`/student/survey/${surveyId}`, {
      answer,
      lecture_id,
      type,
      item_id,
      order,
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
  deleteQuestionAnswerLog({
    questionId,
  }) {
    return http.delete(`/student/answer/${questionId}`);
  },
  deleteSurveyAnswerLog({
    surveyId,
  }) {
    return http.delete(`/student/survey/${surveyId}`);
  },
  postAnswerLogFile({
    studentAnswerLogId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/student/answer/${studentAnswerLogId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  postLog({ id, lecture_id, item_id, type, order, start_time, end_time, answer }) {
    return http.post(`/student/response/${id}`, {
      lecture_id: lecture_id, // eslint-disable-line
      item_id: item_id, // eslint-disable-line
      type: type, // eslint-disable-line
      order: order, // eslint-disable-line
      start_time: start_time, // eslint-disable-line
      end_time: end_time, // eslint-disable-line
      answer: answer, // eslint-disable-line
    });
  },
  postQuestion({ id, name, question, choice, answer, difficulty, type }) {
    return http.post(`/student/${id}/question`, {
      name,
      question,
      choice,
      answer,
      difficulty,
      type,
    });
  },
  getQuestion({ id }) {
    return http.get(`/student/${id}/question`);
  },
  deleteQuestion({ id, qId }) {
    return http.delete(`/student/${id}/question/${qId}`);
  },
  postKeyword({ id, qId, data }) {
    return http.post(`/student/${id}/question/${qId}/keywords`, {
      data,
    });
  },
  getKeyword({ id }) {
    return http.get(`/lectures/${id}/keywords`);
  },
  putQuestion({ id, qId, name, question, score, difficulty, choice, answer, isCheck }) {
    return http.put(`/student/${id}/question/${qId}`, {
      name,
      question,
      score,
      difficulty,
      choice,
      answer,
      isCheck,
    });
  },
  deleteKeyword({ id, qId }) {
    return http.delete(`/student/${id}/question/${qId}/keywords`);
  },
  postFile({ id, qId, file }) {
    return http.post(`/student/${id}/question/${qId}/file`, {
      file,
    });
  },
};
