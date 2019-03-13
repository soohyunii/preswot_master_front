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
    openedTeacherList: [],
    goingTeacherList: [],
    finishedTeacherList: [],
    studyingTeacherList: [],
    teachingTeacherList: [],
    popularTeacherList: [],
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
    isTeachingTeacherListEmpty(state) {
      if (!isArray(state.teachingTeacherList)) {
        return false;
      }
      return state.teachingTeacherList.length === 0;
    },
    isStudyingTeacherListEmpty(state) {
      if (!isArray(state.studyingTeacherList)) {
        return false;
      }
      return state.studyingTeacherList.length === 0;
    },
    currentTeachingTeacher: state => (TeacherId) => {
      if (!Array.isArray(state.teachingTeacherList)) {
        return null;
      }
      return state.teachingTeacherList.find(item => item.Teacher_id === TeacherId);
    },
    currentStudyingTeacher: state => (TeacherId) => {
      if (!Array.isArray(state.studyingTeacherList)) {
        return null;
      }
      return state.studyingTeacherList.find(item => item.Teacher_id === TeacherId);
    },
  },
  mutations: {
    updateOpenedTeacherList(state, { openedTeacherList }) {
      state.openedTeacherList = openedTeacherList;
    },
    updateGoingTeacherList(state, { goingTeacherList }) {
      state.goingTeacherList = goingTeacherList;
    },
    updateFinishedTeacherList(state, { finishedTeacherList }) {
      state.finishedTeacherList = finishedTeacherList;
    },
    updateStudyingTeacherList(state, { studyingTeacherList }) {
      state.studyingTeacherList = studyingTeacherList;
    },
    deleteStudyingTeacher(state, { studyingTeacherIndex }) {
      state.studyingTeacherList.splice(studyingTeacherIndex, 1);
    },
    updateTeachingTeacherList(state, { teachingTeacherList }) {
      state.teachingTeacherList = teachingTeacherList;
    },
    deleteTeachingTeacher(state, { teachingTeacherIndex }) {
      state.teachingTeacherList.splice(teachingTeacherIndex, 1);
    },
    updatePopularTeacherList(state, { popularTeacherList }) {
      state.popularTeacherList = popularTeacherList;
    },
  },
  actions: {
    async putScore({ state }, { id, score }) {
      const res = await MasterService.putScore({
        id, score,
      });
      return res;
    },
    /* async getMasterTeacher({}) {
    }, */
    async getTeacherLists({ commit }) {
      const res = await MasterService.getTeacherLists();
      const sc = res.data;
      commit('updateStudyingTeacherList', {
        studyingTeacherList: sc,
      });
    },
    async getMyTeacherLists({ commit }) {
      const res = await MasterService.getMyTeacherList();
      const sc = res.data.code;
      commit('updateStudyingTeacherList', {
        studyingTeacherList: sc,
      });

      const tc = res.data.teachingTeacheres;
      commit('updateTeachingTeacherList', {
        teachingTeacherList: tc,
      });
    },
    async getTeacher({ state, commit }, { type, TeacherId }) {
      const res = await MasterService.getTeacher({
        id: TeacherId,
      });
      if (type === 'TEACHER') {
        const newTeachingTeacherList = deepCopy(state.teachingTeacherList);
        const currentTeacher = newTeachingTeacherList.find(item => item.Teacher_id === TeacherId);
        currentTeacher.lectures = res.data.lectures;
        commit('updateTeachingTeacherList', {
          teachingTeacherList: newTeachingTeacherList,
        });
      } else {
        const newStudyingTeacherList = deepCopy(state.studyingTeacherList);
        const currentTeacher = newStudyingTeacherList.find(item => item.user_id === TeacherId);
        /* 위 라인의 item => item.user_id === UserId 가 UserId is not defined라서 TeacherId로 임의로 바꿈 */
        currentTeacher.lectures = res.data.lectures;
        commit('updateStudyingTeacherList', {
          studyingTeacherList: newStudyingTeacherList,
        });
      }
    },
    async getPopularTeacherList({ commit }) {
      const res = await MasterService.getMainTeacherLists();
      const mainTeacher = res.data.main_Teacheres;
      for (let i = 0; i < mainTeacher.length; i += 1) {
        mainTeacher[i].TeacherId = mainTeacher[i].Teacher_id;
        mainTeacher[i].title = mainTeacher[i].name;
        mainTeacher[i]['teacher-list'] = [mainTeacher[i].master_name];
        const a = new Date(mainTeacher[i].start_time);
        const b = new Date(mainTeacher[i].end_time);
        mainTeacher[i].startDateStr = a.toLocaleDateString();
        mainTeacher[i].endDateStr = b.toLocaleDateString();
      }
      commit('updatePopularTeacherList', {
        popularTeacherList: mainTeacher,
      });
    },
    async postTeacherUser(_, { TeacherId }) {
      await MasterService.postTeacherUser({
        id: TeacherId,
      });
    },
    async deleteTeacherUser(_, { TeacherId, userId }) {
      await MasterService.deleteTeacherUser({
        TeacherId,
        userId,
      });
    },
  },
};
