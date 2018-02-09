import http from './http';

export default {
  postFile({
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post('/files', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile({
    fileGuid,
  }) {
    return http.delete(`/files/${fileGuid}`);
  },
};
