import isNil from 'lodash.isnil';
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
  putLecture({
    lectureId,
    type,
    name,
    description,
    location,
    startDate,
    endDate,
    opened,
    teacherEmail,
  }) {
    const param = {};
    /* eslint-disable no-unused-expressions */
    const oa = Object.assign;
    !isNil(type) ? oa(param, { type }) : null;
    !isNil(name) ? oa(param, { name }) : null;
    !isNil(description) ? oa(param, { description }) : null;
    !isNil(location) ? oa(param, { location }) : null;
    !isNil(startDate) ? oa(param, { intended_start: startDate }) : null;
    !isNil(endDate) ? oa(param, { intended_end: endDate }) : null;
    !isNil(opened) ? oa(param, { opened }) : null;
    !isNil(teacherEmail) ? oa(param, { teacher_email: teacherEmail }) : null;
    /* eslint-enable no-unused-expressions */

    // console.log('param', param);
    return http.put(`/lectures/${lectureId}`, param);
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
  getLectureKeywords({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}/keywords`);
  },
  postLectureKeywords({
    lectureId,
    lectureKeywords,
  }) {
    return http.post(`/lectures/${lectureId}/keywords`, {
      data: lectureKeywords,
    });
  },
  getLectureKeywordRelations({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}/keyword-relations`);
  },
  postLectureKeywordRelations({
    lectureId,
    lectureRelations,
  }) {
    return http.post(`/lectures/${lectureId}/keyword-relations`, {
      data: lectureRelations,
    });
  },
};
