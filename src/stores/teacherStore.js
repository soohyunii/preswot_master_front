const Guid = require('guid');

export default {
  namespaced: true,
  /**
   * @var ls: shorthand for Ls
   */
  state: {
    ls: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    // currentEditingLsItem: 현재 저작 중인 강의 시나리오 아이템
    currentEditingLsItem: null, // TODO: init from localStorage
    currentEditingLsItemIndex: null,
    // TODO: save currentEditingElement into localStorage inside Vue component using watch
    teachingClassList: [],
    currentEditingClass: null,
    // scenarioList: [],
  },
  getters: {
    isLsEmpty(state) {
      return state.ls.length === 0;
    },
  },
  mutations: {
    pushLsItem(state, { type }) {
      const key = Guid.create().toString();
      const lsItem = { type, key };
      state.currentEditingLsItem = lsItem;
      state.currentEditingLsItemIndex = state.ls.length;
      state.ls.push(lsItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingLsItem(state, { currentEditingLsItem, lectureElementIndex }) {
      state.currentEditingLsItem = currentEditingLsItem;
      state.currentEditingLsItemIndex = lectureElementIndex;
      Object.assign(
        state.ls[state.currentEditingLsItemIndex],
        currentEditingLsItem,
      );
    },
    deleteLsItem(state, { lectureElementIndex }) {
      state.ls.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    updateLs(state, { ls }) {
      state.ls = ls;
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
