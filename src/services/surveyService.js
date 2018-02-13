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
    timer,
    inputDescription,
    outputDescription,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { comment });
    utils.assignIfNotNil(param, { type });
    utils.assignIfNotNil(param, { choice });
    utils.assignIfNotNil(param, { timer });
    utils.assignIfNotNil(param, { inputDescription });
    utils.assignIfNotNil(param, { outputDescription });
    utils.assignIfNotNil(param, { sampleInput });
    utils.assignIfNotNil(param, { sampleOutput });
    utils.assignIfNotNil(param, { timeLimit });
    utils.assignIfNotNil(param, { memoryLimit });

    return http.put(`/surveys/${surveyId}`, param);
  },
};
