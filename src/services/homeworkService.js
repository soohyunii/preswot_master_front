import http from './http';

export default {
  postHomework({
    lectureItemId,
  }) {
    return http.post('/homework', {
      lectureItemId,
    });
  },
  // 코멘트 필요없는것같은데 일단 주석처리, lecture-item desecription으로 충분한 것 같음
  // putHomework({
  //   homeworkId,
  // }) {
  //   return http.put(`/homework/${homeworkId}`, {
  //   });
  // }
  postHomeworkFile({
    homeworkId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/homework/${homeworkId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHomeworkResult({
    homeworkId,
  }) {
    return http.get(`/homework/${homeworkId}/result`);
  },
};
