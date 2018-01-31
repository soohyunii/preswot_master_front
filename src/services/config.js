import store from '../stores';

// setTimeout(() => {
//   console.log('store', store);

// }, 500);

export default {
  serverUrl: 'http://localhost:3000',
  getHeaders() {
    return {
      'x-access-token': store.state.auth.jwt,
    };
  },
};
