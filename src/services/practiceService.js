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
};
