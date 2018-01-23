const Guid = require('guid');

export default {
  namespaced: true,
  state: {
    lectureScenario: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    // currentEditingLectureScenarioItem: 현재 저작 중인 강의 시나리오 아이템
    currentEditingLectureScenarioItem: null, // TODO: init from localStorage
    currentEditingLectureScenarioItemIndex: null,
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
      const lectureScenarioItem = { type, key };
      state.currentEditingLectureScenarioItem = lectureScenarioItem;
      state.currentEditingLectureScenarioItemIndex = state.lectureScenario.length;
      state.lectureScenario.push(lectureScenarioItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingLectureScenarioItem(state, { currentEditingLectureScenarioItem }) {
      state.currentEditingLectureScenarioItem = currentEditingLectureScenarioItem;
      Object.assign(
        state.lectureScenario[state.currentEditingLectureScenarioItemIndex],
        currentEditingLectureScenarioItem,
      );
    },
    changeCurrentEditingLectureScenarioItem(state, { lectureElementIndex }) {
      state.currentEditingLectureScenarioItem = state.lectureScenario[lectureElementIndex];
    },
    changeCurrentEditingLectureScenarioItemIndex(state, { lectureElementIndex }) {
      state.currentEditingLectureScenarioItemIndex = lectureElementIndex;
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
