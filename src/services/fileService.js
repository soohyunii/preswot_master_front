import http from './http';

export default {
  deleteFile({
    fileGuid,
  }) {
    return http.delete(`/files/${fileGuid}`);
  },
};
