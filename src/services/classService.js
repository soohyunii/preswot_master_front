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
    teacherEmailList,
  }) {
    return http.post('/classes', {
      name: title,
      description,
      intendedLectureNum,
      teachers: teacherEmailList,
    });
  },
  fetchClass({ id }) {
    return http.get(`/classes/${id}`);
  },
};
