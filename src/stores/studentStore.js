export default {
  namespaced: true,
  state: {
    studyingClassList: [],
  },
  mutations: {
    pushStudyingClass(state, { studyingClass, studyingClassList }) {
      if (studyingClass) {
        state.studyingClassList.push(studyingClass);
      }
      if (studyingClassList) {
        Array.prototype.push.apply(state.studyingClassList, studyingClassList);
      }
    },
    deleteStudyingClass(state, { studyingClassIndex }) {
      state.studyingClassList.splice(studyingClassIndex, 1);
    },
  },
};
