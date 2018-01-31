import axios from 'axios';
import config from './config';

export default {
  fetchingMyClassList() {
    return axios({
      method: 'get',
      url: `${config.serverUrl}/classes/my`,
      headers: config.getHeaders(),
    });
  },
  // TODO: add param
  createClass() {
    return axios({
      method: 'post',
      url: `${config.serverUrl}/classes`,
      headers: config.getHeaders(),
      data: {
        name: 'ddddd',
        description: 'dddd',
        intendedLectureNum: 15,
        teachers: [2],
      },
    });
  },
};
