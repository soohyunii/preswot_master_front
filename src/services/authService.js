export default {
  login({ email, password }) {
    console.log('service email, password', email, password); // eslint-disable-line

    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          jwt: 'blahblahblah_unexpired',
        });
      }, 500);
    });
  },
  checkEmailDuplicated({ email }) {
    // TODO: Replace dummy with axios
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const duplicated = email === 'adoji92@gmail.com';
        resolve({
          duplicated,
        });
      }, 500);
    });
  },
};
