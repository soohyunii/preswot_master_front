// import axios from 'axios';
// import config from './config';
import http from './http';
import utils from '../utils';

export default {
  getClassCoverage({ id }) {
    return http.get(`/classes/${id}/coverage`);
  },
  getLectureCoverage({ id }) {
    return http.get(`/lectures/${id}/coverage`);
  },
};
