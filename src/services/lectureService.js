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
  putLectureName({
    lectureId,
    lectureName,
  }) {
    return http.put(`/lectures/${lectureId}/name`, {
      value: lectureName,
    });
  },
};
