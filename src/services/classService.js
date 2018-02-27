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
  getClassCoverage({ id }) {
    return http.get(`/classes/${id}/coverage`);
  },
  getClassKeywordRelation({ id }) {
    return http.get(`/classes/${id}/keyword-relation`);
  },
  postClass({ //
    title,
    description,
    intendedLectureNum,
    activeStartDate,
    activeEndDate,
    teacherEmailList,
  }) {
    return http.post('/classes', {
      name: title,
      description,
      intendedLectureNum,
      start_time: activeStartDate,
      end_time: activeEndDate,
      teachers: teacherEmailList ? teacherEmailList : [], // eslint-disable-line
    });
  },
  putClass({
    name,
    description,
    intendedLectureNum,
    activeStartDate,
    activeEndDate,
    opened,
    id,
  }) {
    const param = {};
    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { intendedLectureNum });
    utils.assignIfNotNil(param, { start_time: activeStartDate });
    Object.assign(param, { end_time: activeEndDate });
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
