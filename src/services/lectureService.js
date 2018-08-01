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
    type,
    name,
    start_time,
    end_time,
  }) {
    return http.post('/lectures', {
      classId,
      type,
      name,
      start_time,
      end_time,
    });
  },
  postLecturePlist({
    lectureId, movedKeys,
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
    startTime,
    endTime,
    opened,
    videoLink,
    teacherEmail,
    keywordState,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { lectureId });
    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { location });
    utils.assignIfNotNil(param, { startTime }, 'start_time');
    utils.assignIfNotNil(param, { endTime }, 'end_time');
    utils.assignIfNotNil(param, { opened });
    utils.assignIfNotNil(param, { videoLink }, 'video_link');
    utils.assignIfNotNil(param, { teacherEmail }, 'teacher_email');
    utils.assignIfNotNil(param, { keywordState }, 'keyword_state');

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
  deleteLectureKeyword({
    lectureId,
    lectureKeyword,
  }) {
    return http.delete(`/lectures/${lectureId}/keywords/${lectureKeyword}`);
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
    return http.delete(`/lectures/${lectureId}/keyword-relations/${node1}/${node2}`);
  },
  getLectureCoverage({ id }) {
    return http.get(`/lectures/${id}/coverage`);
  },
  executeExtractor({ id, numberOfKeyword, keywordLength }) {
    const param = {
      numberOfKeyword,
      minKeywordLength: keywordLength,
      isFast: true,
    };
    return http.post(`/lectures/${id}/keyword-extractor`, param);
  },
  postLectureMaterial({ lectureId, file }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/lecture-items/${lectureId}/material`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getLectureMaterialAdditional({ lectureId }) {
    return http.get(`/lecture-items/${lectureId}/materials`);
  },
  getOpenedLectureItem({ lectureId }) {
    return http.get(`/lectures/${lectureId}/opened-item`);
  },
};
