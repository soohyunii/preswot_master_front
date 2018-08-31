import http from './http';

export default {
  offlineJoin({ // 입장 flag 전송
    lectureId,
  }) {
    return http.get(`/automatic_lectures/offline/join/${lectureId}`, {
      lecture_id: lectureId,
    });
  },
  offlineLeave({ // 퇴장 flag 업로드
    lectureId,
  }) {
    return http.get(`/automatic_lectures/offline/leave/${lectureId}`, {
      lecture_id: lectureId,
    });
  },
  onlineJoin({ // 입장 flag 전송
    lectureId,
  }) {
    return http.get(`/automatic_lectures/online/join/${lectureId}`);
  },
  onlineLeave({ // 퇴장 flag 업로드
    lectureId,
    lectureItemId,
    offset,
  }) {
    return http.post('/automatic_lectures/online/leave', {
      lecture_id: lectureId,
      lecture_item_id: lectureItemId,
      offset,
    });
  },
};
