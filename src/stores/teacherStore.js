const Guid = require('guid');

export default {
  namespaced: true,
  state: {
    lectureScenario: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    currentEditingElement: null, // TODO: init from localStorage
    // TODO: save currentEditingElement into localStorage inside Vue component using watch
    teachingClassList: [],
    currentEditingClass: null,
    // scenarioList: [],
  },
  getters: {
    isLectureScenarioEmpty(state) {
      return state.lectureScenario.length === 0;
    },
  },
  mutations: {
    pushLectureScenarioItem(state, { type }) {
      const key = Guid.create().toString();
      state.lectureScenario.push({ type, key });
      // TODO: save lectureElementSequence using localForage
    },
    deleteLectureScenarioItem(state, { lectureElementIndex }) {
      state.lectureScenario.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    updateLectureScenario(state, { lectureScenario }) {
      state.lectureScenario = lectureScenario;
    },
    updateCurrentEditingClass(state, { editingClass }) {
      state.currentEditingClass = editingClass;
    },
    updateTeachingClassList(state, { classList }) {
      state.teachingClassList = classList;
    },
    /* updatescenarioList(state, { scenarioList }) {
      state.scenarioList = scenarioList;
    }, */
  },
};
