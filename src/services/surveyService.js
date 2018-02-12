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
    type,
    choice,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { choice });
    return http.put(`/surveys/${surveyId}`, param);
  },
};
