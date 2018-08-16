import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    theResult: null, // items that need grading
    surveyList: [],
    questionList: [],
    surveyResult: null,
    questionResult: null,
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
    updateSurveyResult(state, { surveyResult }) {
      state.surveyResult = surveyResult;
    },
    updateQuestionResult(state, { questionResult }) {
      state.questionResult = questionResult;
    },
  },
  actions: {
    async getClassTotalResult({ commit }, { classId, isStudent }) {
      let res = null;
      if (isStudent) {
        res = await classService.getClassStudentResult({
          id: classId,
        });
      } else {
        res = await classService.getClassTotalResult({
          id: classId,
        });
      }

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
              comment: item.surveys[0].comment,
              answers: item.surveys[0].student_surveys,
              choice: item.surveys[0].choice,
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
              answers: item.questions[0].student_answer_logs,
              score: item.questions[0].score,
              avgScore,
              itemId: item.lecture_item_id,
              questionId: item.questions[0].question_id,
              question: item.questions[0].question,
              keywords: item.questions[0].question_keywords,
              choice: item.questions[0].choice,
              answer: item.questions[0].answer[0],
              inputDescription: item.questions[0].input_description,
              outputDescription: item.questions[0].output_description,
              sampleInput: item.questions[0].sample_input,
              sampleOutput: item.questions[0].sample_output,
              timeLimit: item.questions[0].time_limit,
              memoryLimit: item.questions[0].memory_limit,
              acceptLanguage: item.questions[0].accept_language,
            });
            n += 1;
          }
        }
      }
      commit('updateQuestionList', {
        question: questions,
      });
    },
    getQuestionResult({ state, commit }, { itemId }) {
      const questionResult = {};
      let theQuestion = null;
      const lectureLen = state.questionList.length;
      for (let i = 0; i < lectureLen; i += 1) {
        const questionLen = state.questionList[i].questions.length;
        for (let j = 0; j < questionLen; j += 1) {
          if (state.questionList[i].questions[j].itemId === itemId) {
            questionResult.lectureName = state.questionList[i].name;
            theQuestion = state.questionList[i].questions[j];
            break;
          }
        }
      }
      if (theQuestion) {
        questionResult.questionId = theQuestion.questionId;
        questionResult.itemName = theQuestion.name;
        questionResult.type = theQuestion.type;
        questionResult.question = theQuestion.question;
        questionResult.keywords = theQuestion.keywords;
        questionResult.score = theQuestion.score;
        questionResult.avgScore = theQuestion.avgScore;
        questionResult.numberOfStudent = theQuestion.numberOfStudent;
        questionResult.summitted = questionResult.numberOfStudent > 0;
        questionResult.answers = theQuestion.answers;
        questionResult.answer = theQuestion.answer;
        questionResult.inputDescription = theQuestion.inputDescription;
        questionResult.outputDescription = theQuestion.outputDescription;
        questionResult.sampleInput = theQuestion.sampleInput;
        questionResult.sampleOutput = theQuestion.sampleOutput;
        questionResult.timeLimit = theQuestion.timeLimit;
        questionResult.memoryLimit = theQuestion.memoryLimit;
        questionResult.acceptLanguage = theQuestion.acceptLanguage;
        if (questionResult.type === '객관') {
          questionResult.choice = theQuestion.choice;
          questionResult.obAnswers = [];
          for (let i = 0; i < questionResult.choice.length; i += 1) {
            questionResult.obAnswers.push({
              choice: questionResult.choice[i],
              number: 0,
            });
          }
          for (let i = 0; i < questionResult.numberOfStudent; i += 1) {
            questionResult
              .obAnswers[Number.parseInt(theQuestion.answers[i].answer, 10) - 1].number += 1;
          }
        } else if (questionResult.type === 'SW') {
          for (let i = 0; i < questionResult.numberOfStudent; i += 1) {
            const temp = questionResult.answers[i].oj_solution.result;
            if (temp === 0) questionResult.answers[i].swResult = '대기중';
            if (temp === 1 || temp === 11) questionResult.answers[i].swResult = '컴파일 에러';
            if (temp === 3) questionResult.answers[i].swResult = '채점중';
            if (temp === 4) questionResult.answers[i].swResult = '맞음';
            if (temp === 6) questionResult.answers[i].swResult = '틀림';
            if (temp === 7) questionResult.answers[i].swResult = '시간 초과';
            if (temp === 8) questionResult.answers[i].swResult = '메모리 초과';
            if (temp === 9) questionResult.answers[i].swResult = '출력 초과';
            if (temp === 10) questionResult.answers[i].swResult = '런타임 에러';
          }
        }
      }
      commit('updateQuestionResult', {
        questionResult,
      });
    },
    getSurveyResult({ state, commit }, { itemId }) {
      const surveyResult = {};
      let theSurvey = null;
      const lectureLen = state.surveyList.length;
      for (let i = 0; i < lectureLen; i += 1) {
        const surveyLen = state.surveyList[i].surveys.length;
        for (let j = 0; j < surveyLen; j += 1) {
          if (state.surveyList[i].surveys[j].itemId === itemId) {
            surveyResult.lectureName = state.surveyList[i].name;
            theSurvey = state.surveyList[i].surveys[j];
            break;
          }
        }
      }
      surveyResult.itemName = theSurvey.name;
      surveyResult.type = theSurvey.type;
      surveyResult.comment = theSurvey.comment;
      surveyResult.numberOfStudent = theSurvey.numberOfStudent;
      if (surveyResult.type === '서술') {
        surveyResult.answers = theSurvey.answers;
      } else if (surveyResult.type === '객관') {
        surveyResult.choice = theSurvey.choice;
        surveyResult.answers = [];
        for (let i = 0; i < surveyResult.choice.length; i += 1) {
          surveyResult.answers.push({
            choice: surveyResult.choice[i],
            number: 0,
          });
        }
        for (let i = 0; i < surveyResult.numberOfStudent; i += 1) {
          surveyResult.answers[Number.parseInt(theSurvey.answers[i].answer, 10)].number += 1;
        }
      }

      commit('updateSurveyResult', {
        surveyResult,
      });
    },
  },
};
