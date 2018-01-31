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
    scStartDatetime: null,
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
    nodes: [],
    edges: [],
  },
  getters: {
    isScEmpty(state) {
      return state.sc.length === 0;
    },
    isNodesEmpty(state) {
      return state.nodes.length === 0;
    },
    currentEditingScItem(state) {
      return state.sc[state.currentEditingScItemIndex];
    },
    currentTeachingScItem(state) {
      return state.sc[state.currentTeachingScItemIndex];
    },
    DEBUGscenarioServerWillReceive(state) {
      // TODO: delete
      const res = {};
      res.title = state.scTitle;
      res.type = state.scType;
      res.startDatetime = state.scStartDatetime;
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
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    addNodes(state, { node }) {
      state.nodes.push(node);
    },
    deleteNodes(state, { nodeIndex }) {
      state.nodes.splice(nodeIndex, 1);
    },
    deleteEdges(state, { edgeIndex }) {
      state.nodes.splice(edgeIndex, 1);
    },
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScStartDatetime(state, { scStartDatetime }) {
      state.scStartDatetime = scStartDatetime;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
    },
    pushScItem(state, { type }) {
      const key = Guid.create().toString();
      const activeStartDatetime = null;
      const activeEndDatetime = null;
      const isResultVisible = true;
      const title = null;
      const description = null;
      const order = null;
      const fileList = [];
      const survey = { choice: [] };
      const scItem = {
        key,
        title,
        type,
        order,
        activeStartDatetime,
        activeEndDatetime,
        isResultVisible,
        description,
        fileList,
        survey,
      };
      state.currentEditingScItemIndex = state.sc.length;
      state.sc.push(scItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingScItem(state, { currentEditingScItem }) {
      // console.log('currentEditingScItem', currentEditingScItem);
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
      const isCurrentEditingItem =
        state.currentEditingScItemIndex === lectureElementIndex;
      const isLastItem = lectureElementIndex === state.sc.length - 1;
      const isBeforeCurrentEditingItem =
        lectureElementIndex < state.currentEditingScItemIndex;

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
    updateCurrentLectureTimeMillisec(state, { currentLectureTimeMillisec }) {
      state.currentLectureTimeMillisec = currentLectureTimeMillisec;
    },
    updateLiveStartTime(state, { liveStartTime }) {
      state.liveStartTime = liveStartTime;
    },
  },
};
