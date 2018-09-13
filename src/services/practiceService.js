import http from './http';

export default {
  postPractice({
                 lectureItemId,
               }) {
    return http.post('/lecture_code_practices', {
      lectureItemId,
    });
  },
  putPractice({
                practiceId,
                code,
              }) {
    return http.put(`/lecture_code_practices/${practiceId}`, {
      code,
    });
  },
  getPracticeKeywords({
    practiceId,
  }) {
    return http.get(`/lecture_code_practices/${practiceId}/keywords`);
  },
  postPracticeKeywords({
    practiceId,
    data,
  }) {
    return http.post(`/lecture_code_practices/${practiceId}/keywords`, {
      data,
    });
  },
  deletePracticeKeywords({
    practiceId,
  }) {
    return http.delete(`/lecture_code_practices/${practiceId}/keywords`);
  },
};
