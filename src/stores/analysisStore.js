import analysisService from '../services/analysisService';

export default {
  namespaced: true,
  state: {
    analysisData: {},
    classId: null,
    userId: null,
    isStudent: false,
    isActiveInfo: false,
    lectureId: 1,
    analysisOpt: 0,
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
    updateIsActiveInfo(state, { isActiveInfo }) {
      state.isActiveInfo = isActiveInfo;
    },
    updateLectureId(state, { lectureId }) {
      state.lectureId = lectureId;
    },
    updateAnalysisOpt(state, { analysisOpt }) {
      state.analysisOpt = analysisOpt;
    },
  },
  actions: {
    async getAnalysisData({ state, commit }) {
      let res = null;
      switch (state.analysisOpt) {
        case (0): {
          res = await analysisService.getClassLogAnalysis({
            classId: state.classId, userId: state.userId, isStudent: state.isStudent,
          });
          break;
        }
        case (1): {
          res = await analysisService.getLectureLogAnalysis({
            lectureId: state.lectureId, userId: state.userId, isStudent: state.isStudent,
          });
          break;
        }
        default: {
          res = await analysisService.getClassLogAnalysis({
            classId: state.classId, userId: state.userId, isStudent: state.isStudent,
          });
          break;
        }
      }
      commit('updateAnalysisData', {
        analysisData: res.data,
      });
    },
  },
};
