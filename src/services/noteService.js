import http from './http';
import utils from '../utils';

export default {
  postNote({
    lectureItemId,
  }) {
    return http.post('/notes', {
      lectureItemId,
    });
  },
  putNote({
    noteId,
    type,
    url,
    youtube_interval,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { url });
    utils.assignIfNotNil(param, { youtube_interval });

    return http.put(`/notes/${noteId}`, param);
  },
  postNoteFile({
    noteId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.put(`/notes/${noteId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getNoteFile({ noteId }) {
    return http.get(`/notes/${noteId}/files`);
  },
  // deleteFile은 FileService에 있는거 사용
};
