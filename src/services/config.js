// import axios from 'axios';
import store from '../stores';

export default {
  serverUrl: 'http://localhost:3000',
  getHeaders() {
    return {
      'x-access-token': store.state.auth.jwt,
    };
  },
};
