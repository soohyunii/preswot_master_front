import http from './http';

export default {
  offlineJoin({ // 입장 flag 전송
    lectureId,
    lectureType,
  }) {
    return http.post('/automatic_lectures/offline/join', {
      lecture_id: lectureId,
      lecture_type: lectureType,
    });
  },
  offlineLeave({ // 퇴장 flag 업로드
    lectureId,
    lectureType,
  }) {
    return http.post('/automatic_lectures/offline/leave', {
      lecture_id: lectureId,
      lecture_type: lectureType,
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
