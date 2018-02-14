import analysisService from '../services/analysisService';

export default {
  namespaced: true,
  state: {
    analysisData: null,
    classId: null,
    userId: null,
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
  },
  actions: {
    async getAnalysisData({ state, commit }) {
      try {
        var analysisData = await analysisService.getStudentLogAnalysis({
          classId: state.classId, userId: state.userId,
        });
        console.log(analysisData.data);
        commit('updateAnalysisData', {
          analysisData: analysisData.data,
        });
        /* for (var i = 0; i < vm.journalingData.lectures.length; i += 1){

         } */
      } catch (e) {
        throw new Error('request error');
      }
    },
  },
};
