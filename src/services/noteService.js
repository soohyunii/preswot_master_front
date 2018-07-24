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
    URL,
    video_start,
    video_end,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { URL });
    utils.assignIfNotNil(param, { video_start });
    utils.assignIfNotNil(param, { video_end });

    return http.put(`/notes/${noteId}`, param);
  },
  putNoteFile({
    noteId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.put(`/notes/${noteId}/files`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getNoteFile({ noteId }) {
    return http.get(`/notes/${noteId}/files`);
  },
  deleteNoteFile({ noteId }) {
    return http.delete(`/notes/${noteId}/files`);
  },
};
