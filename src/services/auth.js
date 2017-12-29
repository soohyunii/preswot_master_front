export default {
  login() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          jwt: 'blahblahblah',
        });
      }, 500);
    });
  },
};
