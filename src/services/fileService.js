import http from './http';

export default {
  postFile({
    file,
  }) {
    return http.post('/files', file);
  },
  deleteFile({
    fileGuid,
  }) {
    return http.delete(`/files/${fileGuid}`);
  },
};
