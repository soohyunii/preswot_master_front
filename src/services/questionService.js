import http from './http';
import utils from '../utils';

export default {
  postQuestion({
    lectureItemId,
  }) {
    return http.post('/questions', {
      lectureItemId,
    });
  },
  putQuestion({
    questionId,
    question,
    choice,
    answer,
    isOrderingAnswer,
    score,
    difficulty,
    timer,
    inputDescription,
    outputDescription,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { question });
    utils.assignIfNotNil(param, { choice });
    utils.assignIfNotNil(param, { answer });
    utils.assignIfNotNil(param, { isOrderingAnswer });
    utils.assignIfNotNil(param, { score });
    utils.assignIfNotNil(param, { difficulty });
    utils.assignIfNotNil(param, { timer });
    utils.assignIfNotNil(param, { inputDescription });
    utils.assignIfNotNil(param, { outputDescription });
    utils.assignIfNotNil(param, { sampleInput });
    utils.assignIfNotNil(param, { sampleOutput });
    utils.assignIfNotNil(param, { timeLimit });
    utils.assignIfNotNil(param, { memoryLimit });

    return http.put(`/questions/${questionId}`, param);
  },
};
