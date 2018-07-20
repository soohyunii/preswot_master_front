import http from './http';
import utils from '../utils';

export default {
  postMaterial({
    lectureItemId,
  }) {
    return http.post('/materials', {
      lectureItemId,
    });
  },
  // postMaterialFile({
  //   materialId,
  //   file,
  // }) {
  //   const form = new FormData();
  //   form.append('file', file, file.name);
  //   return http.post(`/materials/${materialId}/file`, form, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // },
  putMaterial({
    materialId,
    link,
    clip_start,
    clip_end,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { link });
    utils.assignIfNotNil(param, { clip_start });
    utils.assignIfNotNil(param, { clip_end });

    return http.put(`/materials/${materialId}`, param);
  },
  putMaterialType({
    materialId,
    type,
  }) {
    return http.put(`/materials/${materialId}/type`, {
      type,
    });
  },
};
