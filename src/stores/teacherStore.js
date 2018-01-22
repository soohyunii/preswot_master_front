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
  mutations: {
    pushLectureElement(state, { type }) {
      const guid = Guid.create();
      state.lectureScenario.push({ type, guid });
      // TODO: save lectureElementSequence using localForage
    },
    deleteLectureElement(state, { lectureElementIndex }) {
      state.lectureScenario.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    editLectureElement(state, { lectureScenarioItems }) {
      state.lectureScenario = lectureScenarioItems.slice();
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
