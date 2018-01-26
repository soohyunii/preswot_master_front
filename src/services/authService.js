import axios from 'axios';

import config from './config';

export default {
  login({ email, password }) {
    return axios({
      method: 'post',
      // TODO: 임시 url 주소 나중에 변경
      url: `${config.serverUrl}/auth/login`,
      data: {
        email_id: email,
        // eslint-disable-next-line
        password: password,
      },
  // // TODO: CSRF 기능 나중에 손보기
  // headers: {
  //   'X-Requested-With': 'XMLHttpRequest',
  //   'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
  // },
    });
      // .then((response) => {
      //   // window.console.log(response);
      //   resolve({
      //     status: true,
      //     jwt: response.data.token,
      //   });
      // })
      // // eslint-disable-next-line
      // .catch((error) => {
      //   // window.console.log(error);
      //   resolve({
      //     status: false,
      //   });
      // });
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
