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
    utils.assignIfNotNil(param, { inputDescription }, 'input');
    utils.assignIfNotNil(param, { outputDescription }, 'output');
    utils.assignIfNotNil(param, { sampleInput });
    utils.assignIfNotNil(param, { sampleOutput });
    utils.assignIfNotNil(param, { timeLimit });
    utils.assignIfNotNil(param, { memoryLimit });

    return http.put(`/questions/${questionId}`, param);
  },
  putQuestionType({
    questionId,
    type,
  }) {
    return http.put(`/questions/${questionId}/type`, {
      type,
    });
  },
  postQuestionFile({
    questionId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/questions/${questionId}/file`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
