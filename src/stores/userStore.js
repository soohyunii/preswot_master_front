/**
 * 지금 store.state에 들어가는거에서나
 * 아니면 백엔드에서 응답하는 값에서나
 * 학생쪽 데이터와 강사쪽 데이터가 겹치는 부분이 있음
 *
 * 예를 들어 지금 auth쪽에 빠져있는 locale도 이쪽으로 가져오면 좋을 것 같고 TODO:
 * api 중에서는 /classes/my 가 TeachingClasses와 studyingClasses가 함꼐 리턴됨
 */
export default {
  namespaced: true,
  state: {
    teachingClassList: null,
    studyingClassList: null,
  },
  mutations: {
    pushTeachingClass(state, { teachingClass, teachingClassList }) {
      if (!state.teachingClassList) {
        state.teachingClassList = [];
      }
      if (teachingClass) {
        state.teachingClassList.push(teachingClass);
      }
      if (teachingClassList) {
        Array.prototype.push.apply(state.teachingClassList, teachingClassList);
      }
    },
    deleteTeachingClass(state, { teachingClassIndex }) {
      state.teachingClassList.splice(teachingClassIndex, 1);
      if (state.teachingClassList.length === 0) {
        state.teachingClassList = null;
      }
    },
    pushStudyingClass(state, { studyingClass, studyingClassList }) {
      if (!state.studyingClassList) {
        state.studyingClassList = [];
      }
      if (studyingClass) {
        state.studyingClassList.push(studyingClass);
      }
      if (studyingClassList) {
        Array.prototype.push.apply(state.studyingClassList, studyingClassList);
      }
    },
    deleteStudyingClass(state, { studyingClassIndex }) {
      state.studyingClassList.splice(studyingClassIndex, 1);
      if (state.studyingClassList.length === 0) {
        state.studyingClassList = null;
      }
    },
  },
  actions: {

  },
};
