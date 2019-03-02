import utils from '../utils';
import studentService from '../services/studentService';
export default {
  namespaced: true,
  state: {
    lectureId: null,
    mode: 0, // 0 - list, 1 - new, 2 - modify
    post: null,
    put: null,
    index: -1,
    studentQuestionList: [],
    modifyQuestion: { student_question_keywords: [] },
    newQuestion: {
      name: null,
      question: null,
      score: 0,
      difficulty: 0,
      choice: [],
      answer: [],
      isCheck: false
    }
  },
  mutations: {
    updateStudentQuestionList(state, { studentQuestionList }) {
      state.studentQuestionList = studentQuestionList;
    },
    pushStudentQuestion(state, { studentQuestion }) {
      state.studentQuestionList.push(studentQuestion);
    },
    deleteStudentQuestion(state, { index }) {
      state.studentQuestionList.splice(index, 1);
    },
    transferStudentQuestion(state, { index }) {
      state.modifyQuestion = state.studentQuestionList[index];
      // alert(JSON.stringify(state.modifyQuestion));
    },
    updateStudentQuestionIndex( state, index ) {
      state.index = index;
    },
    updateStudentQuestionMode( state, { mode } ) {
      state.mode = mode;
    }
  },
  getters: {
    getIndex: function (state) {
      return state.index;
    },
  },
  actions: {
    transferStudentQuestion({ commit }, { index }) {
      commit('transferStudentQuestion', { index });
    },
    pushQuestion({ commit }, { data }) {
      data = data.data;
      const date = new Date(data.createdAt);
      data.submitTime = date.toString().split(' GMT')[0];
      if (data.type === 0) {
        data.type = '객관';
      } else if (data.type === 1) {
        data.type = '단답';
      } else if (data.type === 2) {
        data.type = '서술';
      }
      commit('pushStudentQuestion', {
        studentQuestion: data,
      });
    },
    async getQuestionList({ commit }, { lectureId }) {
      let results = []
      const questions = await studentService.getQuestionList({ id: lectureId });
      
      for (let i = 0; i < questions.data.length; i += 1) {
        results.push(questions.data[i]);
        const date = new Date(questions.data[i].createdAt);
        results[i].submitTime = date.toString().split(' GMT')[0];
        if (questions.data[i].type === 0) {
          results[i].type = '객관';
        } else if (questions.data[i].type === 1) {
          results[i].type = '단답';
        } else if (questions.data[i].type === 2) {
          results[i].type = '서술';
        }
      }
      commit('updateStudentQuestionList', {
        studentQuestionList: results,
      });
    },
    async deleteQuestion({ state, commit }, { lectureId, index }) {
      let res = await studentService.deleteQuestion({ id: lectureId, qId: state.studentQuestionList[index].student_question_id });
      if (res) {
        commit('deleteStudentQuestion', { index });
      }
      // commit('')
    },
    async putQuestion({ state, commit }, { data }) {
      // alert(JSON.stringify(data));
      let res = await studentService.putQuestion({
        id: data.lecture_id,
        qId: data.student_question_id,
        name: data.name,
        question: data.question,
        score: data.score,
        difficulty: data.difficulty,
        choice: data.choice,
        answer: data.answer
      });
      return res;
    },
    async postQuestion({ state, getters }) {
      // console.log('state', state);
      // if (!getters.isNewClassValid) {
      //   throw new Error('invalid');
      // }
      // TODO: pass intendedLectureNum
      // if (getters.)
      // if (state.name === null) {

      // }
      // if (state.choice.length === 0) {

      // }
      // if (state.answer.length === 0) {

      // }
      await studentService.postQuestion(state.newQuestion)
    },
    async deleteKeyword({ state }, { id, qId }) {
      alert(`delete -${id}, ${qId}`);
      let res = await studentService.deleteKeyword({ id, qId });
      return res;
    },
    async postKeyword({ state }, { id, qId, data }) {
      let res = await studentService.postKeyword({ id, qId, data });
      if (res) {
        // alert(JSON.stringify(res));
      } else {
        // alert('post keywords failure');
      }
      return res;
      // await studentService.postKeyword({ id, qId, data });
    }
  }

}