import http from './http';

export default {
  getHomepageLog({
    pageUrl,
  }) {
    return http.get(`/users/homepage-log/${pageUrl}`);
  },
};
