import http from './http';

export default {
  putDiscussion({
                id,
                share,
                topic,
              }) {
    return http.put(`/discussions/${id}`, {
      share,
      topic,
    });
  },
};
