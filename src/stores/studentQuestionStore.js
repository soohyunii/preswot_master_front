// import utils from '../utils';
import studentService from '../services/studentService';

export default {
  namespaced: true,
  state: {
    lectureHomework: null,  // 해당 강의 숙제여부 체크
    lectureId: 0,
    mode: 0, // 0 - list, 1 - new, 2 - modify
    post: null,
    put: null,
    index: -1,
    studentQuestionList: [],        // 내가 작성한 문항 리스트
    studentEstimateQuestionList: [], // 평가해야할 문항리스트
    studentQuestionKeywords: [], // 디테일 문항 키워드 리스트
    dialogVisible: false,           // 문항평가하기 컴포넌트 다이얼로그 속성값
    studentEstimateCheck: null,
    modifyQuestion: { student_question_keywords: [] },
    newQuestion: {
      name: null,
      question: null,
      score: 0,
      difficulty: 0,
      choice: [],
      answer: [],
      isCheck: false,
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
    },
    updateStudentQuestionIndex(state, index) {
      state.index = index;
    },
    updateStudentQuestionMode(state, { mode }) {
      state.mode = mode;
    },
    updateStudentEstimateQuestionList(state, { studentEstimateQuestionList }) {
      state.studentEstimateQuestionList = studentEstimateQuestionList;
    },
    updateLectureId(state, { lid }) {
      state.lectureId = lid;
    },
    updateLectureHomework(state, { lectureHomework }) {
      state.lectureHomework = lectureHomework;
    },
    updateStudentEstimateQuestionList(state, { studentEstimateQuestionList }) {
      state.studentEstimateQuestionList = studentEstimateQuestionList;
    },
    updateStudentQuestionKeywords(state, { studentQuestionKeywords }) {
      state.studentQuestionKeywords = studentQuestionKeywords;
    },
    updateDialogVisible(state, { value }) {
      state.dialogVisible = value;
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
    updateStudentQuestionMode1({ commit, dispatch, state }, { mode }) {
      if ( mode === 0 ) {
        dispatch('getQuestionList', { lectureId: state.lectureId });
      }
      commit('updateStudentQuestionMode', { mode });
    },
    pushQuestion({ commit }, { data }) {
      const q = data.data;
      const date = new Date(data.createdAt);
      q.submitTime = date.toString().split(' GMT')[0];
      if (q.type === 0) {
        q.type = '객관';
      } else if (q.type === 1) {
        q.type = '단답';
      } else if (q.type === 2) {
        q.type = '서술';
      }
      commit('pushStudentQuestion', {
        studentQuestion: data,
      });
    },
    async getQuestionList({ commit }, { lectureId }) {
      const results = [];
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
      const res = await studentService.deleteQuestion({ id: lectureId, qId: state.studentQuestionList[index].student_question_id });
      if (res) {
        commit('deleteStudentQuestion', { index });
      }
      // commit('')
    },
    async putQuestion({ state, commit }, { data }) {
      // alert(JSON.stringify(data));
      const r = await studentService.putQuestion({
        id: data.lecture_id,
        qId: data.student_question_id,
        name: data.name,
        question: data.question,
        score: data.score,
        difficulty: data.difficulty,
        choice: data.choice,
        answer: data.answer,
      });
      return r;
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
    },
    async getEstimateQuestion({ commit }, { id }) {
      const results = await studentService.getEstimateQuestion({ id });
      commit('updateStudentEstimateQuestionList', { studentEstimateQuestionList: results });
    },
    async getLectureHomeworkCheck({ commit }, { id }) {
      const result = await studentService.getLectureHomeworkCheck({ id });
      commit('updateLectureHomework', { lectureHomework: result.data });
    },
    async getSudentEstimateQuestionList({ commit }, { id }) {
      const result = await studentService.getStudentEstimateQuestionList({ id });
      if (!result.data.success) {
        return;
      }
      let estimates = [];
      for (let i = 0 ; i < result.data.result.length ; i += 1) {
        estimates.push(result.data.result[i]);
        if (result.data.result[i].type === 0) {
          estimates[i].type = '객관';
        } else if ( result.data.result[i].type === 1) {
          estimates[i].type = '단답';
        } else {
          estimates[i].type = '서술';
        }
      }
      commit('updateStudentEstimateQuestionList', { studentEstimateQuestionList: estimates });
    },
    async getStudentQuestionKeywords({ commit }, { id, qId }) {
      const result = await studentService.getStudentQuestionKeywords({ id, qId });
      commit(`updateStudentQuestionKeywords`, { studentQuestionKeywords: result.data });
    }
  },
};
