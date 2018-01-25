const Guid = require('guid');

export default {
  namespaced: true,
  /**
   * @var Sc: shorthand for Scenario
   */
  state: {
    sc: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    // currentEditingScItem: 현재 저작 중인 시나리오 아이템
    currentEditingScItem: null, // TODO: init from localStorage
    currentEditingScItemIndex: null,
    // TODO: save currentEditingElement into localStorage inside Vue component using watch
    teachingClassList: [],
    currentEditingClass: null,
    // scenarioList: [],
  },
  getters: {
    isScEmpty(state) {
      return state.sc.length === 0;
    },
  },
  mutations: {
    pushScItem(state, { type }) {
      const key = Guid.create().toString();
      const activeTime = new Date(0, 0, 0);
      const activeDurationTime = new Date(0, 0, 0);
      const scItem = { type, key, activeTime, activeDurationTime };
      state.currentEditingScItem = scItem;
      state.currentEditingScItemIndex = state.sc.length;
      state.sc.push(scItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingScItem(state, { currentEditingScItem, lectureElementIndex }) {
      state.currentEditingScItem = currentEditingScItem;
      state.currentEditingScItemIndex = lectureElementIndex;
      if (lectureElementIndex !== -1) {
        Object.assign(
          state.sc[state.currentEditingScItemIndex],
          currentEditingScItem,
        );
      }
    },
    deleteScItem(state, { lectureElementIndex }) {
      state.sc.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    updateSc(state, { sc }) {
      state.sc = sc;
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
