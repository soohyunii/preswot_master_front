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
    curLectureId: null,
    openedClassList: null,
    goingClassList: null,
    finishedClassList: null,
    studyingClassList: null,
    teachingClassList: null,
    popularClassList: null,
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
    currentStudyingClass: state => (classId) => {
      if (!Array.isArray(state.studyingClassList)) {
        return null;
      }
      return state.studyingClassList.find(item => item.class_id === classId);
    },
  },
  mutations: {
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
    updatePopularClassList(state, { popularClassList }) {
      state.popularClassList = popularClassList;
    },
    updateCurLectureId(state, { lid }) {
      state.curLectureId = lid;
    },
  },
  actions: {
    updateLectureId({ commit }, { lid }) {
      commit('updateCurLectureId', {
        lid: lid
      })
    },
    async putScore({ state }, { id, score }) {
      const res = await classService.putScore({
        id, score,
      });
      return res;
    },
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
      const tmp = res.data.studyingClasses;
      const sc = [];
      tmp.forEach((x) => {
        if (x.opened !== 1) { // 비공개가 아닌 공개, 마감 강의
          sc.push(x);
        }
      });

      commit('updateStudyingClassList', {
        studyingClassList: sc,
      });

      const tc = res.data.teachingClasses;
      commit('updateTeachingClassList', {
        teachingClassList: tc,
      });
    },
    async getClass({ state, commit }, { type, classId }) {
      const res = await classService.getClass({
        id: classId,
      });
      if (type === 'TEACHER') {
        const newTeachingClassList = deepCopy(state.teachingClassList);
        const currentClass = newTeachingClassList.find(item => item.class_id === classId);
        currentClass.lectures = res.data.lectures;
        commit('updateTeachingClassList', {
          teachingClassList: newTeachingClassList,
        });
      } else {
        const newStudyingClassList = deepCopy(state.studyingClassList);
        const currentClass = newStudyingClassList.find(item => item.class_id === classId);
        currentClass.lectures = res.data.lectures;
        commit('updateStudyingClassList', {
          studyingClassList: newStudyingClassList,
        });
      }
    },
    async getPopularClassList({ commit }) {
      const res = await classService.getMainClassLists();
      const mainClass = res.data.main_classes;
      for (let i = 0; i < mainClass.length; i += 1) {
        mainClass[i].classId = mainClass[i].class_id;
        mainClass[i].title = mainClass[i].name;
        mainClass[i]['teacher-list'] = [mainClass[i].master_name];
        const a = new Date(mainClass[i].start_time);
        const b = new Date(mainClass[i].end_time);
        mainClass[i].startDateStr = a.toLocaleDateString();
        mainClass[i].endDateStr = b.toLocaleDateString();
      }
      commit('updatePopularClassList', {
        popularClassList: mainClass,
      });
    },
    async postClassUser(_, { classId }) {
      await classService.postClassUser({
        id: classId,
      });
    },
    async deleteClassUser(_, { classId, userId }) {
      await classService.deleteClassUser({
        classId,
        userId,
      });
    },
  },
};
