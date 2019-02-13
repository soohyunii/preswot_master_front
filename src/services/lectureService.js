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
  NNpostLectureKeyword({
    lectureId,
    keyword,
    weight,
  }) {
    return http.post(`/lectures/${lectureId}/keyword`, {
      keyword,
      weight,
    });
  },
  NNdeleteLectureKeyword({
    lectureId,
    keywordId,
  }) {
    return http.delete(`/lectures/${lectureId}/keyword/${keywordId}`);
  },
  NNputLectureKeyword({
    lectureId,
    keywordId,
    keyword,
    weight,
  }) {
    return http.put(`/lectures/${lectureId}/keyword/${keywordId}`, {
      keyword,
      weight,
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
    form.append('lecture_Id', lectureId);
    form.append('material_type', 0);
    form.append('file', file, file.name);
    return http.post('/materials', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getLectureMaterial({ lectureId }) {
    return http.get(`/materials/${lectureId}`);
  },
  getOpenedLectureItem({ lectureId }) {
    return http.get(`/lectures/${lectureId}/opened-item`);
  },
  getOpenedGroupItem({ lectureId }) {
    return http.get(`/lectures/group/${lectureId}`);
  },
  deleteMaterial({ id }) {
    return http.delete(`/materials/${id}`);
  },
  getMaterialKeywords({ id }) {
    return http.get(`/materials/${id}/keywords`);
  },
  getWholeStudents({ id }) {  // 전체 수강생 명단 불러오기
    return http.get(`/lectures/${id}/student-list`);
  },
  /* 삭제 - 181214
  getOnStudentCount({ lectureId }) {
    return http.get(`lectures/${lectureId}/on-student-count`);
  },
  */
  postMaterialKeyword({ id, keyword, score }) {
    return http.post(`/materials/${id}/keywords`, {
      keyword,
      score,
    });
  },
  deleteMaterialKeyword({ id, keyword }) {
    return http.delete(`/materials/${id}/keywords`, {
      keyword: keyword, // eslint-disable-line
    });
  },
  getAllFilesUnderLecture({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}/files`);
  },
  autoExtractKeyword({
    lectureId,
    guidList,
    w1,
    w2,
  }) {
    return http.post(`/lectures/${lectureId}/extract-keywords`, {
      guidList,
      w1,
      w2,
    });
  },
  postMainVideoKeyword({
    lectureId,
    type,
    data,
  }) {
    return http.post(`/lectures/${lectureId}/material-keyword`, {
      type,
      data,
    });
  },
  getMainVideoKeyword({
    lectureId,
  }) {
    return http.get(`/lectures/${lectureId}/material-keyword`);
  },
  deleteMainVideoKeyword({
    lectureId,
  }) {
    return http.delete(`/lectures/${lectureId}/material-keyword`);
  },
};
