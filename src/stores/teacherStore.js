const Guid = require('guid');

export default {
  namespaced: true,
  /**
   * @var sc: shorthand for Scenario
   * @var currentEditingScItemIndex: 현재 생성/편집 중인 시나리오 아이템 인덱스
   * @var currentTeachingScItemIndex: 강의 중에 현재 진행되고 있는 시나리오 아이템 인덱스
   */
  state: {
    scTitle: null,
    scType: null,
    scDescription: null,
    scKnowledgeMap: null,
    sc: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    // currentEditingScItem: null, // TODO: init from localStorage
    currentEditingScItemIndex: null,
    // TODO: save currentEditingElement into localStorage inside Vue component using watch
    currentTeachingScItemIndex: null,
    teachingClassList: [],
    currentEditingClass: null,
    currentLectureTimeMillisec: null,
    liveStartTime: null,
    scHistoryMode: true,
    isShowingResult: true,
  },
  getters: {
    isScEmpty(state) {
      return state.sc.length === 0;
    },
    currentEditingScItem(state) {
      return state.sc[state.currentEditingScItemIndex];
    },
    currentTeachingScItem(state) {
      return state.sc[state.currentTeachingScItemIndex];
    },
    DEBUGscenarioServerWillReceive(state) { // TODO: delete
      const res = {};
      res.title = state.scTitle;
      res.type = state.scType;
      res.description = state.scDescription;
      res.knowledgeMap = state.scKnowledgeMap;

      res.sc = state.sc;
      return res;
    },
    // 이걸 여기다 추가하니까, state.liveStartTime이 바뀌어야만 vuex getters가 갱신이 일어남.
    // 그냥 component에서 method로 불러야할듯!!
    // elapsedTimeMillisec(state) {
    //   if (state.liveStartTime) {
    //     return Date.now() - state.liveStartTime.getTime();
    //   }
    //   return null;
    // },
  },
  mutations: {
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
    },
    pushScItem(state, { type }) {
      const key = Guid.create().toString();
      const activeTime = new Date(0, 0, 0);
      const activeDurationTime = new Date(0, 0, 0);
      const scHistoryMode = true;
      const isShowingResult = true;
      const title = '';
      const description = '';
      const fileList = [];
      const scItem = {
        title,
        type,
        key,
        activeTime,
        activeDurationTime,
        scHistoryMode,
        isShowingResult,
        description,
        fileList,
      };
      // state.currentEditingScItem = scItem;
      state.currentEditingScItemIndex = state.sc.length;
      state.sc.push(scItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingScItem(state, { currentEditingScItem }) {
      Object.assign(
        state.sc[state.currentEditingScItemIndex],
        currentEditingScItem,
      );
    },
    updateCurrentEditingScItemIndex(state, { currentEditingScItemIndex }) {
      state.currentEditingScItemIndex = currentEditingScItemIndex;
    },
    updateCurrentTeachingScItemIndex(state, { index }) {
      state.currentTeachingScItemIndex = index;
    },
    // FIXME: rename `lectureELementIndex` with `currentEditingScItemIndex`
    deleteScItem(state, { lectureElementIndex }) {
      const isCurrentEditingItem = state.currentEditingScItemIndex === lectureElementIndex;
      const isLastItem = lectureElementIndex === state.sc.length - 1;
      const isBeforeCurrentEditingItem = lectureElementIndex < state.currentEditingScItemIndex;

      if ((isCurrentEditingItem && isLastItem) || isBeforeCurrentEditingItem) {
        state.currentEditingScItemIndex -= 1;
      }
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
    updateHistoryMode(state, { mode }) {
      state.scHistoryMode = mode;
    },
    updateIsShowingResult(state, { mode }) {
      state.isShowingResult = mode;
    },
    updateCurrentLectureTimeMillisec(state, { currentLectureTimeMillisec }) {
      state.currentLectureTimeMillisec = currentLectureTimeMillisec;
    },
    updateLiveStartTime(state, { liveStartTime }) {
      state.liveStartTime = liveStartTime;
    },
  },
};
