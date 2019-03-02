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
  getDiscussion({
    id,
  }) {
    return http.get(`/discussions/${id}`);
  },
  getDiscussionKeywords({
    discussionId,
  }) {
    return http.get(`/discussions/${discussionId}/keywords`);
  },
  postdiscussionKeywords({
    discussionId,
    data,
  }) {
    return http.post(`/discussions/${discussionId}/keywords`, {
      data,
    });
  },
  deleteDiscussionKeywords({
    discussionId,
  }) {
    return http.delete(`/discussions/${discussionId}/keywords`);
  },
};
