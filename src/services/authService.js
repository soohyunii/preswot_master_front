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
    return http.post('/users', {
      data: input,
    });
  },
};
