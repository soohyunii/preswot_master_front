import http from './http';

export default {
  putDiscussion({
                id,
                share,
              }) {
    return http.put(`/discussions/${id}`, {
      share,
    });
  },
};
