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
  putLectureIntendedStart({
    lectureId,
    lectureStartDate,
  }) {
    return http.put(`/lectures/${lectureId}/intended_start`, {
      value: lectureStartDate,
    });
  },
  putLectureIntendedEnd({
    lectureId,
    lectureEndDate,
  }) {
    return http.put(`/lectures/${lectureId}/intended_end`, {
      value: lectureEndDate.toISOString(),
    });
  },
};
