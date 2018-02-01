import http from './http';

export default {
  postLecture({
    classId,
    teacherId,
  }) {
    return http.post('/lectures', {
      classId,
      teacherId,
    });
  },
};
