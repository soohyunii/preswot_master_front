// import utils from '../utils';
import lectureService from '../services/lectureService';
// TODO: keyword 관련된 애들 따로 store 빼는 게 나을듯.
// state.recommendKeywordList, keywordList, movedKeywordList, addedKeywordList
// getters.isKeywordDuplicated, isRecommendKeyword
// mutations.updateRecommendKeywordList, updateKeywordList, updateMovedKeywordList,
// updateAddedKeywordList
// actions.getKeywords, deleteLectureKeywords, postLectureKeywords, deleteKeyword
// TODO: 끝

export default {
  namespaced: true,
  state: {
    lecture: null, // getLecture로 불러온 정보 여기에 저장
  },
  mutations: {
    updateLecture(state, { lecture }) {
      state.lecture = lecture;
    },
  },
  actions: {
    async getLecture({ state, commit }, { lectureId }) {
      const res = await lectureService.getLecture({
        lectureId,
      });
      commit('updateLecture', {
        lecture: res.data,
      });
    },
  },
};
