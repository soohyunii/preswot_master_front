import analysisService from '../services/analysisService';

export default {
  namespaced: true,
  state: {
    analysisData: {},
    classId: null,
    userId: null,
    isStudent: false,
  },
  getters: {
    // eslint-disable-next-line
    getAnalysisData: function (state) {
      return state.analysisData;
    },
  },
  mutations: {
    updateAnalysisData(state, { analysisData }) {
      state.analysisData = analysisData;
    },
    updateClassId(state, { classId }) {
      state.classId = classId;
    },
    updateUserId(state, { userId }) {
      state.userId = userId;
    },
    updateIsStudent(state, { isStudent }) {
      state.isStudent = isStudent;
    },
  },
  actions: {
    async getAnalysisData({ state, commit }) {
      try {
        const res = await analysisService.getLogAnalysis({
          classId: state.classId, userId: state.userId, isStudent: state.isStudent,
        });
        commit('updateAnalysisData', {
          analysisData: res.data,
        });
      } catch (e) {
        throw new Error('request error');
      }
    },
  },
};
