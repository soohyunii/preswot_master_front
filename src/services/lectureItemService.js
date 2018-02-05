import http from './http';

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
  putLectureItemName({
    lectureItemId,
    lectureItemName,
  }) {
    return http.put(`/lecture-items/${lectureItemId}/name`, {
      value: lectureItemName,
    });
  },
};