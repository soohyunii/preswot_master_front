import deepCopy from 'deep-copy';
import isArray from 'lodash.isarray';
// import utils from '../utils';
import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * 공통 변수들
     * 초기값으로 []를 주니까 서버에서 받아온건데 비어있는건지
     * 아니면 아직 서버로부터 안받아온건지 구분이 안가서 null로 초기화함
     */
    openedClassList: null,
    goingClassList: null,
    finishedClassList: null,
    studyingClassList: null,
    teachingClassList: null,
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
    isTeachingClassListEmpty(state) {
      if (!isArray(state.teachingClassList)) {
        return false;
      }
      return state.teachingClassList.length === 0;
    },
    isStudyingClassListEmpty(state) {
      if (!isArray(state.studyingClassList)) {
        return false;
      }
      return state.studyingClassList.length === 0;
    },
    currentTeachingClass: state => (classId) => {
      if (!Array.isArray(state.teachingClassList)) {
        return null;
      }
      return state.teachingClassList.find(item => item.class_id === classId);
    },
    // currentTeachingClassLectureList(state) {

    // },
  },
  mutations: {
    updateTeachingClassIndex(state, { teachingClassIndex }) {
      state.teachingClassIndex = teachingClassIndex;
    },
    // //////////////////////////////////////////
    updateOpenedClassList(state, { openedClassList }) {
      state.openedClassList = openedClassList;
    },
    updateGoingClassList(state, { goingClassList }) {
      state.goingClassList = goingClassList;
    },
    updateFinishedClassList(state, { finishedClassList }) {
      state.finishedClassList = finishedClassList;
    },
    updateStudyingClassList(state, { studyingClassList }) {
      state.studyingClassList = studyingClassList;
    },
    deleteStudyingClass(state, { studyingClassIndex }) {
      state.studyingClassList.splice(studyingClassIndex, 1);
    },
    updateTeachingClassList(state, { teachingClassList }) {
      state.teachingClassList = teachingClassList;
    },
    deleteTeachingClass(state, { teachingClassIndex }) {
      state.teachingClassList.splice(teachingClassIndex, 1);
    },
  },
  actions: {
    async getClassLists({ commit }) {
      const res = await classService.getClassLists();
      commit('updateOpenedClassList', {
        openedClassList: res.data.openedClasses,
      });
      commit('updateGoingClassList', {
        goingClassList: res.data.goingClasses,
      });
      commit('updateFinishedClassList', {
        finishedClassList: res.data.finishedClasses,
      });
    },
    async getMyClassLists({ commit }) {
      const res = await classService.getMyClassList();

      const sc = res.data.studyingClasses;
      sc.map((item) => {
        // eslint-disable-next-line
        item.scenarioList = null;
        return item;
      });
      if (sc && sc.length !== 0) {
        commit('updateStudyingClassList', {
          studyingClassList: sc,
        });
      }

      const tc = res.data.teachingClasses;
      tc.map((item) => {
        // eslint-disable-next-line
        item.scenarioList = null;
        return item;
      });
      if (tc && tc.length !== 0) {
        commit('updateTeachingClassList', {
          teachingClassList: tc,
        });
      }
    },
    async getClass({ state, commit }, { type, classId }) {
      const res = await classService.getClass({
        id: classId,
      });
      if (type === 'TEACHER') {
        const newTeachingClassList = deepCopy(state.teachingClassList);
        const currentClass = newTeachingClassList.find(item => item.class_id === classId);
        currentClass.scenarioList = res.data.lectures;
        commit('updateTeachingClassList', {
          teachingClassList: newTeachingClassList,
        });
      } else {
        const newStudyingClassList = deepCopy(state.studyingClassList);
        const currentClass = newStudyingClassList.find(item => item.class_id === classId);
        currentClass.scenarioList = res.data.lectures;
        commit('updateStudyingClassList', {
          studyingClassList: newStudyingClassList,
        });
      }
    },
  },
};
