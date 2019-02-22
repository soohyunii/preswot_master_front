import utils from '../utils';
import studentService from '../services/studentService';
export default {
  namespace: true,
  state: {
    lectureId: null,
    mode: null,
    post: null,
    put: null,
    index: null,
    studentQuestionList: [],
    studentQuestion: null,
    newQuestion: {
      name: null,
      question: null,
      score: null,
      difficulty: null,
      choice: null,
      answer: null,
      isCheck: null
    }
  },
  mutations: {
    updateStudentQuestionList(state, { studentQuestionList }) {
      state.studentQuestionList = studentQuestionList;
    }
  },
  getters: {

  },
  actions: {
    async getQuestionList() {
      // const lectureId = getters.lectureId;
      // const lectureId = 10;
      // alert(lectureId);
      const lectureId = 10;
      let results = []
      const questions = await studentService.getQuestionList({ id: lectureId });
      alert(questions);
      // for (let i = 0; i < questions.data.length; i += 1) {
      //   results.push(questions.data[i]);
      //   const date = new Date(questions.data[i].createdAt);
      //   results[i].submitTime = date.toString().split(' GMT')[0];
      //   if (questions.data[i].type === 0) {
      //     results[i].type = '객관';
      //   } else if (questions.data[i].type === 1) {
      //     results[i].type = '단답';
      //   } else if (questions.data[i].type === 2) {
      //     results[i].type = '서술';
      //   }
      // }
      // alert('a');

      // commit('updateStudentQuestionList', {
      //   studentQuestionList: questions.data,
      // });
      this.state.studentQuestionList = questions;
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
    async putQuestion({ state, getters }) {
      
    }
  }

}