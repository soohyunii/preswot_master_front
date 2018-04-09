import http from './http';

export default {
  getHomepageLog({
    pageUrl,
  }) {
    return http.get(`/homepage-log/${pageUrl}`);
  },
};
