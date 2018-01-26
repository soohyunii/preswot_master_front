import axios from 'axios';

export default {
  login({ email, password }) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        axios({
          method: 'post',
          url: 'http://127.0.0.1:3000/auth/login',
          data: {
            email_id: email,
            // eslint-disable-next-line
            password: password,
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        })
        .then((response) => {
          // window.console.log(response);
          resolve({
            status: true,
            jwt: response.data.token,
          });
        })
        // eslint-disable-next-line
        .catch((error) => {
          // window.console.log(error);
          resolve({
            status: false,
          });
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
