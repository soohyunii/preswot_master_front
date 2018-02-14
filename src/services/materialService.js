import http from './http';

export default {
  postMaterial({
    lectureItemId,
  }) {
    return http.post('/materials', {
      lectureItemId,
    });
  },
  postMaterialFile({
    materialId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/materials/${materialId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  putMaterial({
    materialId,
    score,
  }) {
    return http.put(`/materials/${materialId}`, {
      score,
    });
  },
};
