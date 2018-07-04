import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    theResult: null, // items that need grading
    surveyList: [],
    questionList: [],
  },
  mutations: {
    updateTheResult(state, { result }) {
      state.theResult = result;
    },
    updateSurveyList(state, { survey }) {
      state.surveyList = survey;
    },
    updateQuestionList(state, { question }) {
      state.questionList = question;
    },
  },
  actions: {
    async getClassTotalResult({ commit }, { classId }) {
      const res = await classService.getClassTotalResult({
        id: classId,
      });
      commit('updateTheResult', {
        result: res.data.result,
      });

      if (res.data.result === null) {
        return;
      }

      const surveys = [];
      for (let i = 0; i < res.data.result.lectures.length; i += 1) {
        const lec = res.data.result.lectures[i];
        surveys.push({
          lectureId: lec.lecture_id,
          name: lec.name,
          surveys: [],
        });
        let n = 1;
        for (let j = 0; j < lec.lecture_items.length; j += 1) {
          const item = lec.lecture_items[j];
          if (item.type === 1) {
            surveys[i].surveys.push({
              no: n,
              type: item.surveys[0].type === 0 ? '객관' : '서술',
              name: item.name,
              numberOfStudent: item.surveys[0].student_surveys.length,
              itemId: item.lecture_item_id,
            });
            n += 1;
          }
        }
      }
      commit('updateSurveyList', {
        survey: surveys,
      });
      const questions = [];
      for (let i = 0; i < res.data.result.lectures.length; i += 1) {
        const lec = res.data.result.lectures[i];
        questions.push({
          lectureId: lec.lecture_id,
          name: lec.name,
          questions: [],
        });
        let n = 1;
        for (let j = 0; j < lec.lecture_items.length; j += 1) {
          const item = lec.lecture_items[j];
          if (item.type === 0) {
            let type;
            if (item.questions[0].type === 0) type = '객관';
            else if (item.questions[0].type === 1) type = '단답';
            else if (item.questions[0].type === 2) type = '서술';
            else if (item.questions[0].type === 3) type = 'SW';
            else if (item.questions[0].type === 4) type = 'SQL';
            let numberOfScored = 0;
            let avgScore = 0;
            for (let k = 0; k < item.questions[0].student_answer_logs.length; k += 1) {
              if (item.questions[0].student_answer_logs[k].score !== null) {
                numberOfScored += 1;
                avgScore += item.questions[0].student_answer_logs[k].score;
              }
            }
            if (numberOfScored !== 0) avgScore /= numberOfScored;
            questions[i].questions.push({
              no: n,
              type,
              name: item.name,
              numberOfStudent: item.questions[0].student_answer_logs.length,
              numberOfScored,
              score: item.questions[0].score,
              avgScore,
              itemId: item.lecture_item_id,
            });
            n += 1;
          }
        }
      }
      commit('updateQuestionList', {
        question: questions,
      });
    },
    getQuestionResult() {

    },
  },
};
