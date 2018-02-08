import http from './http';
import utils from '../utils';

export default {
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
    // result, // TODO: get from user
    // opened, // TODO: get from user? 이건 좀 애매한데
  }) {
    const param = {};

    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { startTime }, 'start_time');
    utils.assignIfNotNil(param, { endTime }, 'end_time');
    utils.assignIfNotNil(param, { order }, 'prepare_lesson_review');
    // TODO: rename prepare_lesson_review
    Object.assign(param, {
      result: 1,
      opened: 3, // TODO: 동일이형이랑 얘기하고 지우려면 지우자
    });
    return http.put(`lecture-items/${lectureItemId}`, param);
  },
  putLectureItemName({
    lectureItemId,
    lectureItemName,
  }) {
    return http.put(`/lecture-items/${lectureItemId}/name`, {
      value: lectureItemName,
    });
  },
};
