// import axios from 'axios';
// import config from './config';
import http from './http';
import utils from '../utils';

export default {
  getClasses() {
    return http.get('/classes');
  },
  getMyClassList() { //
    return http.get('/classes/my');
  },
  getClass({ id }) { //
    return http.get(`/classes/${id}`);
  },
  postClass({ //
    title,
    description,
    intendedLectureNum,
    startTime,
    endTime,
    teacherEmailList,
  }) {
    return http.post('/classes', {
      name: title,
      description,
      intendedLectureNum,
      startTime,
      endTime,
      teachers: teacherEmailList,
    });
  },
  putClass({
    name,
    description,
    intendedLectureNum,
    startTime,
    endTime,
    opened,
    id,
  }) {
    const param = {};
    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { intendedLectureNum });
    utils.assignIfNotNil(param, { startTime });
    Object.assign(param, { end_time: endTime });
    utils.assignIfNotNil(param, { opened });
    return http.put(`/classes/${id}`, param);
  },
  postTeacher({
    id,
    teacherEmail,
  }) {
    return http.post(`/classes/${id}/teacher/${teacherEmail}`, {});
  },
  deleteTeacer({
    id,
    teacherEmail,
  }) {
    return http.delete(`/classes/${id}/teacher/${teacherEmail}`);
  },
  delete({
    id,
  }) {
    return http.delete(`/classes/${id}`);
  },
};
