import http from './http';

export default {
  postJoinFlag({ // 입장 flag 전송
    lectureId,
    lectureType,
  }) {
    return http.post('/offline/join', {
      lecture_id: lectureId,
      lecture_type: lectureType,
    });
  },
  postLeaveFlag({ // 퇴장 flag 업로드
    lectureId,
    lectureType,
  }) {
    return http.post('/offline/leave', {
      lecture_id: lectureId,
      lecture_type: lectureType,
    });
  },
};
