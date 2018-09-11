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
    note_type,
    url,
    youtube_interval,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { note_type });
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
    return http.post(`/notes/${noteId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // deleteFile은 FileService에 있는거 사용

  getNoteKeywords({
    noteId,
  }) {
    return http.get(`/notes/${noteId}/keywords`);
  },
  postNoteKeywords({
    noteId,
    data,
  }) {
    return http.post(`/notes/${noteId}/keywords`, {
      data,
    });
  },
  deleteNoteKeywords({
    noteId,
  }) {
    return http.delete(`/notes/${noteId}/keywords`);
  },
};
