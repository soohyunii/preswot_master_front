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
    return http.get(`/automatic_lectures/online/${lectureId}`);
  },
  onlineLeave({ // 퇴장 flag 업로드
    lectureId,
    offset,
  }) {
    return http.post(`/automatic_lectures/online/${lectureId}`, {
      lecture_id: lectureId,
      lecture_item_group_id: 0,
      offset,
    });
  },
  pastAttendanceData({ // [무인]단체 학생들 출석 정보
    lectureId,
  }) {
    return http.get(`/automatic_lectures/online/${lectureId}/students`);
  },
  deleteOffset({ // [무인]개인 학생 offset 지우기 -> 학생이 처음부터 볼 경우
    lectureId,
  }) {
    return http.post(`/automatic_lectures/online/${lectureId}`);
  },
};
