// import axios from 'axios';
// import config from './config';
import http from './http';

export default {
  fetchingMyClassList() {
    return http.get('/classes/my');
  },
  // TODO: add param
  createClass({
    title,
    description,
    intendedLectureNum,
    teacherIdList,
  }) {
    return http.post('/classes', {
      name: title,
      description,
      intendedLectureNum,
      teachers: teacherIdList,
    });
  },
  fetchClass({ id }) {
    return http.get(`/classes/${id}`);
  },
};
