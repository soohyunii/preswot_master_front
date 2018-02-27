import http from './http';
import utils from '../utils';

export default {
  getLectureItem({
    lectureItemId,
  }) {
    return http.get(`/lecture-items/${lectureItemId}`);
  },
  postLectureItem({
    lectureId,
    lectureItemType,
  }) {
    return http.post('/lecture-items', {
      lectureId,
      type: lectureItemType,
    });
  },
  putLectureItem({
    lectureItemId,
    name,
    description,
    startTime,
    endTime,
    order,
    result, // TODO: get from user
    opened, // TODO: get from user? 이건 좀 애매한데
  }) {
    const param = {};

    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { startTime }, 'start_time');
    // utils.assignIfNotNil(param, { endTime }, 'end_time');
    Object.assign(param, { end_time: endTime }); // 얘는 null이면 null 들어가야함
    utils.assignIfNotNil(param, { order });
    utils.assignIfNotNil(param, { result });
    utils.assignIfNotNil(param, { opened });
    // TODO: rename prepare_lesson_review
    // Object.assign(param, {
    //   opened: 3, // TODO: 동일이형이랑 얘기하고 지우려면 지우자
    // });
    // console.log('putLectureItem param', param);
    return http.put(`lecture-items/${lectureItemId}`, param);
  },
  deleteLectureItem({
    lectureItemId,
  }) {
    return http.delete(`/lecture-items/${lectureItemId}`);
  },
  getQuestionKeywords({
    questionId,
  }) {
    return http.get(`/questions/${questionId}/keywords`);
  },
  getMaterialKeywords({
    materialId,
  }) {
    return http.get(`/materials/${materialId}/keywords`);
  },
  postQuestionKeywords({
    questionId,
    data,
  }) {
    return http.post(`/questions/${questionId}/keywords`, {
      data,
    });
  },
  postMaterialKeywords({
    materialId,
    data,
  }) {
    return http.post(`/materials/${materialId}/keywords`, {
      data,
    });
  },
  deleteQuestionKeywords({
    questionId,
  }) {
    return http.delete(`/questions/${questionId}/keywords`);
  },
  deleteMaterialKeywords({
    materialId,
  }) {
    return http.delete(`/materials/${materialId}/keywords`);
  },
};
