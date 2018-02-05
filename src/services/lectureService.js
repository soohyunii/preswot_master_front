import http from './http';

/**
 * service 관련 documentation은 구글 스프레드 시트를 참조하는게 빠름!
 */
export default {
  getLecture({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}`);
  },
  postLecture({
    classId,
    teacherId,
  }) {
    return http.post('/lectures', {
      classId,
      teacherId,
    });
  },
  deleteLecture({
    lectureId,
  }) {
    return http.delete(`/lectures/${lectureId}`);
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
  putLectureType({
    lectureId,
    lectureType,
  }) {
    return http.put(`/lectures/${lectureId}/type`, {
      value: lectureType,
    });
  },
  putLectureDescription({
    lectureId,
    lectureDescrption,
  }) {
    return http.put(`/lectures/${lectureId}/description`, {
      value: lectureDescrption,
    });
  },
};
