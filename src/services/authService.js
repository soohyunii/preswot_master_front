import axios from 'axios';

export default {
  login({ email, password }) {
    axios.post('http://127.0.0.1:3000/auth/login',
      { email_id: email,
        // eslint-disable-next-line
        password: password,
      },
    )
    .then((response) => {
      window.console.log(response);
    })
    .catch((error) => {
      window.console.log(error);
    });

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
