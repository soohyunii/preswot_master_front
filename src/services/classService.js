// import axios from 'axios';
// import config from './config';
import http from './http';

export default {
  fetchingMyClassList() {
    return http.get('/classes/my');
  },
  // TODO: add param
  createClass() {
    return http.post('/classes', {
      name: 'ddddd',
      description: 'dddd',
      intendedLectureNum: 15,
      teachers: [2],
    });
  },
};
