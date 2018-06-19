import http from './http';
// import utils from '../utils';

export default {
  getClassStat({
    classId,
  }) {
    return http.get(`/report/class/${classId}`);
  },
  getStudentClassReport({
    userId,
    classId,
  }) {
    return http.get(`/report/user/${userId}/class/${classId}`);
  },
  getClassAttendeeList({
    classId,
  }) {
    return http.get(`/classes/${classId}/user`);
  },
};
