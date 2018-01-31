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
};
