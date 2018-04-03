import http from './http';

export default {
  deleteFile({
    fileGuid,
  }) {
    return http.delete(`/files/${fileGuid}`);
  },
  deleteFileSqlite({
    fileGuid,
    questionId,
  }) {
    return http.delete(`/files/${fileGuid}/sqlite/${questionId}`);
  },
  previousSqliteFile({}) {
    return http.get('/files/previous-sqlite-file');
  },
};
