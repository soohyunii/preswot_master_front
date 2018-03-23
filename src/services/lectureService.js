import http from './http';
import utils from '../utils';

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
  postLecturePlist({
    lectureId, movedKeys
  }) {
    return http.post(`/lectures/${lectureId}/plist`, {
      movedKeys,
    });
  },
  getLecturePlist({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}/plist`);
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
    videoLink,
    teacherEmail,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { lectureId });
    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { location });
    utils.assignIfNotNil(param, { startDate }, 'intended_start');
    utils.assignIfNotNil(param, { endDate }, 'intended_end');
    utils.assignIfNotNil(param, { opened });
    utils.assignIfNotNil(param, { videoLink }, 'video_link');
    utils.assignIfNotNil(param, { teacherEmail }, 'teacher_email');

    // console.log('param', param);
    return http.put(`/lectures/${lectureId}`, param);
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
  deleteLectureKeywordRelation({
    lectureId,
    node1,
    node2,
  }) {
    return http.delete(`/lecture/${lectureId}/${node1}/${node2}`);
  },
  getLectureCoverage({ id }) {
    return http.get(`/lectures/${id}/coverage`);
  },
};
