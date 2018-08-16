import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    programList: null, // 서버로부터 받아온 윈도우에서 주로 쓰이는 프로그램들
    allowedProgramList: null, // programList로부터 강사가 허용한 프로그램들
  },
  mutations: {
    updateProgramList(state, { programList }) {
      state.programList = programList;
    },
    updateAllowedProgramList(state, { allowedProgramList }) {
      state.allowedProgramList = allowedProgramList;
    },
  },
  actions: {
    async getProgramLists({ commit }, { lectureId }) {
      const res = await lectureService.getLecturePlist({
        lectureId,
      });
      // console.log('res', res.data); // eslint-disable-line
      commit('updateProgramList', {
        programList: res.data.plist_all,
      });
      commit('updateAllowedProgramList', {
        allowedProgramList: res.data.lecture_accept_plist.map(
          x => x.plist,
        ),
      });
    },
    async postProgramList({ rootState }, { tempAllowedProgramPlistIdList }) {
      await lectureService.postLecturePlist({
        lectureId: rootState.lc.lecture.lecture_id,
        movedKeys: tempAllowedProgramPlistIdList,
      });
    },
  },
};
