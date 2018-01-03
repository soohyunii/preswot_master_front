export default {
  login({ email, password }) {
    console.log('service email, password', email, password); // eslint-disable-line

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          jwt: 'blahblahblahvalid',
        });
      }, 500);
    });
  },
};
