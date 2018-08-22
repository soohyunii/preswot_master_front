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
    lectureType,
  }) {
    return http.post('/automatic_lectures/online/join', {
      lecture_id: lectureId,
      lecture_type: lectureType,
    });
  },
  onlineLeave({ // 퇴장 flag 업로드
    lectureId,
    lectureType,
  }) {
    return http.post('/automatic_lectures/online/leave', {
      lecture_id: lectureId,
      lecture_type: lectureType,
    });
  },
};
