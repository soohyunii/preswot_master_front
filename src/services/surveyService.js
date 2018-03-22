import http from './http';
import utils from '../utils';

export default {
  postSurvey({
    lectureItemId,
  }) {
    return http.post('/surveys', {
      lectureItemId,
    });
  },
  putSurvey({
    surveyId,
    comment,
    type,
    choice,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { comment });
    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { choice });

    return http.put(`/surveys/${surveyId}`, param);
  },
  postSurveyFile({
    surveyId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/surveys/${surveyId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSurveyResult({
    surveyId,
  }) {
    return http.get(`/surveys/${surveyId}/result`);
  },
};
