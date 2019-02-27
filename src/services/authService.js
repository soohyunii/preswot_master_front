import http from './http';

export default {
  test() {
    return http.get('/users');
  },
  login({ email, password }) {
    return http.post('/auth/login', {
      email_id: email,
      password,
    });
  },
  agreeTos() {
    return http.get('/auth/terms');
  },
  findPassword({ email }) {
    return http.get(`/auth/${email}/find-password`);
  },
  putPassword({ newPassword, key, userId }) {
    return http.put(`/auth/${userId}/password`, {
      newPassword,
      key,
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
  register({ input }) {
    return http.post('/users', input);
  },
  checkUserPW({ password }) {
    return http.post('/users/check', {
      password: password,  // eslint-disable-line
    });
  },
  returnUserInfo({ userID }) {
    return http.get(`users/${userID}`);
  },
  editUser({ userID, input }) {
    return http.put(`users/${userID}`, input);
  },
};
