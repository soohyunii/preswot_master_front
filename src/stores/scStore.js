import utils from '../utils';
import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * TeacherLectureNew / TeacherLectureLive 관련 변수들
     * @var {number} scId: 백엔드 디비의 lectures 테이블의 lecture_id에 해당
     * @var {string} scTitle
     * @var {string} scType
     * @var {string} scStartDatetime: (e.g. "2018-01-31 23:59:59")
     * @var {string} scDescription
     * @var { nodes: Array[node], edges: Array[node] }
     * @var {number} currentEditingNodeIndex: 현재 편집 중인 노드 인덱스
     * @var {Array[node]} 시나리오 지식맵에서의 키워드
     * @var {Array[edge]} 시나리오 지식맵에서의 릴레이션
     */
    scId: null,
    scTitle: null,
    scType: null,
    scStartDate: null,
    scEndDate: null,
    scDescription: null,
    scKnowledgeMap: null,
    scVideoLink: null,
    afterStartDateOffsetSec: null,
    afterStartDateOffsetSecInterval: 0,
    currentEditingNodeIndex: null,
    nodes: [],
    edges: [],
    scAcceptPlist: [],
    scAvailablePlist: [],
    scKnowledgeMapState: null,
    scOrderFilter: null, // null이면 모두 / 0이면 예습 / 1이면 본강 / 2이면 복습
    /**
     * coverage 변수
     */
    scCoverage: null,
  },
  getters: {
    currentEditingNode(state) {
      return state.nodes[state.currentEditingNodeIndex];
    },
  },
  mutations: {
    updateAfterStartDateOffsetSec(state, { diff }) {
      state.afterStartDateOffsetSec = diff;
    },
    updateScId(state, { scId }) {
      state.scId = scId;
    },
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScPlist(state, { scPlist }) {
      // state.scAcceptPlist = scPlist.lecture_accept_plist;
      state.scAvailablePlist = [];
      state.scAcceptPlist = [];
      for (let i = 0; i < scPlist.plist_all.length; i += 1) {
        state.scAvailablePlist.push({
          key: scPlist.plist_all[i].plist_id,
          label: scPlist.plist_all[i].name,
        });
      }
      for (let i = 0; i < scPlist.lecture_accept_plist.length; i += 1) {
        state.scAcceptPlist.push(scPlist.lecture_accept_plist[i].plist_id);
      }
    },
    updateScAcceptPlist(state, { scAcceptPlist }) {
      state.scAcceptPlist = scAcceptPlist;
    },
    updateScStartDate(state, { scStartDate }) {
      state.scStartDate = scStartDate;
    },
    updateScEndDate(state, { scEndDate }) {
      state.scEndDate = scEndDate;
    },
    updateScVideoLink(state, { scVideoLink }) {
      state.scVideoLink = scVideoLink;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
    },
    updateScOrderFilter(state, { scOrderFilter }) {
      state.scOrderFilter = scOrderFilter;
    },
    setNodesPinned(state, { pinned, node }) {
      let index = -1;
      state.nodes.forEach((item, idx) => {
        if (item.id === node.id) {
          index = idx;
        }
      });
      if (index < 0) {
        return;
      }
      // state.nodes[index].pinned = pinned;
      if (pinned) {
        state.nodes[index].pinned = true;
        state.nodes[index].fx = state.nodes[index].x;
        state.nodes[index].fy = state.nodes[index].y;
      } else {
        state.nodes[index].pinned = false;
        state.nodes[index].fx = null;
        state.nodes[index].fy = null;
      }
    },
    pushNode(state, { node }) {
      const lastNode = state.nodes[state.nodes.length - 1];
      let x;
      let y;
      if (lastNode) {
        x = lastNode.x + 50;
        y = lastNode.y + 50;
      } else {
        x = 0;
        y = 0;
      }
      const createNode = {
        value: node.value,
        id: node.id,
        name: '\n',
        _cssClass: '',
        _size: node._size, // eslint-disable-line no-underscore-dangle
        x,
        y,
        pinned: false,
      };
      state.nodes.push(createNode);
    },
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    updateCurrentEditingNodeIndex(state, { currentEditingNodeIndex }) {
      state.currentEditingNodeIndex = currentEditingNodeIndex;
    },
    pushEdge(state, { edge }) {
      state.edges.push(edge);
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    updateEdgeId(state, { oldNodeId, newNodeId }) {
      state.edges.forEach((item, index) => {
        if (item.tid === oldNodeId) {
          state.edges[index].tid = newNodeId;
        } else if (item.sid === oldNodeId) {
          state.edges[index].sid = newNodeId;
        }
      });
    },
    deleteNode(state, { nodeIndex }) {
      state.nodes.splice(nodeIndex, 1);
    },
    deleteEdge(state, { edgeIndex }) {
      state.edges.splice(edgeIndex, 1);
    },
    assignCurrentEditingNode(state, { currentEditingNode }) {
      Object.assign(
        state.nodes[state.currentEditingNodeIndex],
        currentEditingNode,
      );
    },
    updateScCoverage(state, { scCoverage }) {
      state.scCoverage = scCoverage;
    },
    updateScKnowledgeMapState(state, { scKnowledgeMapState }) {
      state.scKnowledgeMapState = scKnowledgeMapState;
    },
  },
  actions: {
    updateOffsetSecNowDate({ state, commit }) {
      const startDate = state.scStartDate.getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - startDate) / 1000);
      commit('updateAfterStartDateOffsetSec', { diff });

      state.afterStartDateOffsetSecInterval = setInterval(() => {
        const now2 = new Date().getTime();
        const diff2 = Math.floor((now2 - startDate) / 1000);
        commit('updateAfterStartDateOffsetSec', { diff: diff2 });
      }, 1000);
    },
    clearOffsetSecNowDate({ state }) {
      clearInterval(state.afterStartDateOffsetSecInterval);
    },
    async getSc({ state, commit }) {
      const res = await lectureService.getLecture({
        lectureId: state.scId,
      });
      const plist = await lectureService.getLecturePlist({
        lectureId: state.scId,
      });
      commit('updateScPlist', {
        scPlist: plist.data,
      });
      console.log('getSc plist', plist.data); // eslint-disable-line
      console.log('getSc res', res.data); // eslint-disable-line
      commit('updateScTitle', {
        scTitle: res.data.name,
      });
      commit('updateScStartDate', {
        scStartDate: res.data.intended_start ? new Date(res.data.intended_start) : null,
      });
      commit('updateScEndDate', {
        scEndDate: res.data.intended_end ? new Date(res.data.intended_end) : null,
      });
      commit('updateScType', {
        scType: utils.convertScType(res.data.type),
      });
      commit('updateScDescription', {
        scDescription: res.data.description,
      });
      commit('updateScVideoLink', {
        scVideoLink: res.data.video_link,
      });
      commit('updateScKnowledgeMapState', {
        scKnowledgeMapState: res.data.keyword_state,
      });
      const sc = res.data.lecture_items.map((scItem) => {
        // eslint-disable-next-line
        console.log('getSc scItem', scItem);
        return {
          id: scItem.lecture_item_id,
          title: scItem.name,
          description: scItem.description,
          type: utils.convertScItemType(scItem.type),
          activeStartOffsetSec: scItem.start_time,
          activeEndOffsetSec: scItem.end_time,
          order: scItem.order,
          isResultVisible: utils.convertBoolean(scItem.result),
          opened: scItem.opened,
          question: {},
          material: {},
          homework: {},
          survey: {},
          practice: {},
          discussion: [],
          itemKeywords: [],
          fileList: [],
        };
      });
      commit('scItem/updateSc', {
        sc,
      }, {
        root: true,
      });
      // 지식맵 가져오는 부분을 이쪽으로 옮김
      const res1 = await lectureService.getLectureKeywords({
        lectureId: state.scId,
      });
      const nodes = res1.data.map(item => ({
        value: item.keyword,
        id: item.keyword,
        name: item.keyword,
        _size: item.weight,
      }));
      commit('updateNodes', { nodes });
      const res2 = await lectureService.getLectureKeywordRelations({
        lectureId: state.scId,
      });
      if (res2) {
        const edges = res2.data.map(item => ({
          sid: item.node1,
          tid: item.node2,
          weight: item.weight,
        }));
        commit('updateEdges', { edges });
      }
    },
    async postScplist({ state }) {
      // console.log(state.scAcceptPlist, '@@@@@@@@@');
      await lectureService.postLecturePlist({
        lectureId: state.scId,
        movedKeys: state.scAcceptPlist,
      });
    },
    async createSc({ rootGetters }) {
      const userId = rootGetters['auth/userId'];
      const classId = rootGetters['class/currentTeachingClass'].class_id;

      const res = await lectureService.postLecture({
        classId,
        teacherId: userId,
      });
      return res.data.lecture_id;
    },
    async putSc({
      state,
      // commit,
    }) {
      const type = utils.convertScType(state.scType);
      if (type instanceof Error) {
        throw type;
      }
      await lectureService.putLecture({
        lectureId: state.scId,
        name: state.scTitle,
        description: state.scDescription,
        startDate: state.scStartDate,
        endDate: state.scEndDate,
        // TODO: add state.scLocation
        location: null,
        opened: true,
        videoLink: state.scVideoLink,
        teacherEmail: utils.getEmailFromJwt(),
        type,
        keywordState: state.scKnowledgeMapState,
      });
    },
    async deleteSc({ state, commit }) {
      await lectureService.deleteLecture({
        lectureId: state.scId,
      });
      // TODO: replace here if sc related variables are grouped together
      commit('updateScId', {
        scId: null,
      });
      commit('updateScTitle', {
        scTitle: null,
      });
      commit('updateScType', {
        scType: null,
      });
      commit('updateScStartDate', {
        scStartDate: null,
      });
      commit('updateScEndDate', {
        scEndDate: null,
      });
      commit('updateScDescription', {
        scDescription: null,
      });
      commit('updateCurrentEditingScItemIndex', {
        currentEditingScItemIndex: null,
      });
      commit('scItem/updateSc', {
        sc: [],
      }, {
        root: true,
      });
    },
    async postKnowledgeMapData({ state }) {
      const lectureKeywords = state.nodes.map(item => ({
        keyword: item.name,
        weight: Number.parseFloat(item._size), // eslint-disable-line no-underscore-dangle
      }));
      // console.log('lectureKeywords', lectureKeywords); // eslint-disable-line
      await lectureService.postLectureKeywords({
        lectureId: state.scId,
        lectureKeywords,
      });
      const lectureRelations = state.edges.map(item => ({
        node1: item.sid,
        node2: item.tid,
        weight: item.weight,
      }));
      // console.log('lectureRelations', lectureRelations); // eslint-disable-line
      await lectureService.postLectureKeywordRelations({
        lectureId: state.scId,
        lectureRelations,
      });
    },
    async getScCoverage({ commit }, { id }) {
      const res = await lectureService.getLectureCoverage({ id });
      commit('updateScCoverage', {
        scCoverage: res.data,
      });
    },
    async executeExtractor({ state, commit }, { numberOfKeyword, keywordLength }) {
      await lectureService.executeExtractor({
        id: state.scId,
        numberOfKeyword,
        keywordLength,
      });
      commit('updateScKnowledgeMapState', {
        scKnowledgeMapState: 1,
      });
    },
  },
};
