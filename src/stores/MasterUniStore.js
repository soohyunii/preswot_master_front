import deepCopy from 'deep-copy';
import isArray from 'lodash.isarray';
// import utils from '../utils';
import MasterService from '../services/masterService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * 공통 변수들
     * 초기값으로 []를 주니까 서버에서 받아온건데 비어있는건지
     * 아니면 아직 서버로부터 안받아온건지 구분이 안가서 null로 초기화함
     */
    openedUniList: [],
    goingUniList: [],
    finishedUniList: [],
    studyingUniList: [],
    teachingUniList: [],
    popularUniList: [],
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
    isTeachingUniListEmpty(state) {
      if (!isArray(state.teachingUniList)) {
        return false;
      }
      return state.teachingUniList.length === 0;
    },
    isStudyingUniListEmpty(state) {
      if (!isArray(state.studyingUniList)) {
        return false;
      }
      return state.studyingUniList.length === 0;
    },
    currentTeachingUni: state => (UniId) => {
      if (!Array.isArray(state.teachingUniList)) {
        return null;
      }
      return state.teachingUniList.find(item => item.Uni_id === UniId);
    },
    currentStudyingUni: state => (UniId) => {
      if (!Array.isArray(state.studyingUniList)) {
        return null;
      }
      return state.studyingUniList.find(item => item.Uni_id === UniId);
    },
  },
  mutations: {
    updateOpenedUniList(state, { openedUniList }) {
      state.openedUniList = openedUniList;
    },
    updateGoingUniList(state, { goingUniList }) {
      state.goingUniList = goingUniList;
    },
    updateFinishedUniList(state, { finishedUniList }) {
      state.finishedUniList = finishedUniList;
    },
    updateStudyingUniList(state, { studyingUniList }) {
      state.studyingUniList = studyingUniList;
      // console.log(state.studyingUniList);
    },
    deleteStudyingUni(state, { studyingUniIndex }) {
      state.studyingUniList.splice(studyingUniIndex, 1);
    },
    updateTeachingUniList(state, { teachingUniList }) {
      state.teachingUniList = teachingUniList;
    },
    deleteTeachingUni(state, { teachingUniIndex }) {
      state.teachingUniList.splice(teachingUniIndex, 1);
    },
    updatePopularUniList(state, { popularUniList }) {
      state.popularUniList = popularUniList;
    },
  },
  actions: {
    async putScore({ state }, { id, score }) {
      const res = await MasterService.putScore({
        id, score,
      });
      return res;
    },
    async getUniLists({ commit }) {
      const res = await MasterService.getUniLists();

      const sc = res.data;
      // console.log(res.data);
      commit('updateStudyingUniList', {
        studyingUniList: sc,
      }); 

      /*
      commit('updateOpenedUniList', {
        openedUniList: res.data,
      });
      */
      // console.log(res.data); 
      
      /*
      commit('updateGoingUniList', {
        goingUniList: res.data.name,
      });
      
      commit('updateFinishedUniList', {
        finishedUniList: res.data.address,
      });
      */
    },
    async getMyUniLists({ commit }) {
      const res = await MasterService.getMyUniList();

      /*const sc = res.data.studyingUnies;*/
      const sc = res.data.code;
      commit('updateStudyingUniList', {
        studyingUniList: sc,
      });

      const tc = res.data.teachingUnies;
      commit('updateTeachingUniList', {
        teachingUniList: tc,
      });
    },
    async getUni({ state, commit }, { type, UniId }) {
      const res = await MasterService.getUni({
        id: UniId,
      });
      if (type === 'TEACHER') {
        const newTeachingUniList = deepCopy(state.teachingUniList);
        const currentUni = newTeachingUniList.find(item => item.Uni_id === UniId);
        currentUni.lectures = res.data.lectures;
        commit('updateTeachingUniList', {
          teachingUniList: newTeachingUniList,
        });
      } else {
        const newStudyingUniList = deepCopy(state.studyingUniList);
        const currentUni = newStudyingUniList.find(item => item.Uni_id === UniId);
        currentUni.lectures = res.data.lectures;
        commit('updateStudyingUniList', {
          studyingUniList: newStudyingUniList,
        });
      }
    },
    async getPopularUniList({ commit }) {
      const res = await MasterService.getMainUniLists();
      const mainUni = res.data.main_Unies;
      for (let i = 0; i < mainUni.length; i += 1) {
        mainUni[i].UniId = mainUni[i].Uni_id;
        mainUni[i].title = mainUni[i].name;
        mainUni[i]['teacher-list'] = [mainUni[i].master_name];
        const a = new Date(mainUni[i].start_time);
        const b = new Date(mainUni[i].end_time);
        mainUni[i].startDateStr = a.toLocaleDateString();
        mainUni[i].endDateStr = b.toLocaleDateString();
      }
      commit('updatePopularUniList', {
        popularUniList: mainUni,
      });
    },
    async postUniUser(_, { UniId }) {
      await MasterService.postUniUser({
        id: UniId,
      });
    },
    async deleteUniUser(_, { UniId, userId }) {
      await MasterService.deleteUniUser({
        UniId,
        userId,
      });
    },
  },
};
