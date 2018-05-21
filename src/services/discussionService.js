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
  postDiscussionFile({
    file,
    lectureItemId,
  }) {
    const form = new FormData();
    form.append('file', file, 'aa.mpeg');
    return http.post(`/discussions/file/${lectureItemId}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
