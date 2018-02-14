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
    currentEditingNodeIndex: null,
    nodes: [],
    edges: [],
  },
  getters: {
    currentEditingNode(state) {
      return state.nodes[state.currentEditingNodeIndex];
    },
  },
  mutations: {
    updateScId(state, { scId }) {
      state.scId = scId;
    },
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScStartDate(state, { scStartDate }) {
      state.scStartDate = scStartDate;
    },
    updateScEndDate(state, { scEndDate }) {
      state.scEndDate = scEndDate;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
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
        _size: node._size, // eslint-disable-line
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
  },
  actions: {
    async getSc({ state, commit }) {
      const res = await lectureService.getLecture({
        lectureId: state.scId,
      });
      console.log('getSc res', res.data.lecture_items[0]); // eslint-disable-line
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
      // eslint-disable-next-line
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
          itemKeywords: [],
          fileList: [],
        };
      });
      commit('teacher/updateSc', {
        sc,
      }, {
        root: true,
      });
      // FIXME:
      // if (sc.length !== 0) {
      //   commit('updateCurrentEditingScItemIndex', {
      //     currentEditingScItemIndex: 0,
      //   });
      //   await dispatch('getScItem', {
      //     scItemId: getters.currentEditingScItem.id,
      //   });
      //   await dispatch('getItemKeywords');
      // }
    },
    async createSc({ rootGetters }) {
      const userId = rootGetters['auth/userId'];
      const classId = rootGetters['class/currentClass'].class_id;

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
        // TODO: add state.scIsOpen,
        opened: true,
        teacherEmail: utils.getEmailFromJwt(),
        type,
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
      commit('teacher/updateSc', {
        sc: [],
      }, {
        root: true,
      });
    },
    async getKnowledgeMapData({ state, commit }) {
      const res1 = await lectureService.getLectureKeywords({
        lectureId: state.scId,
      });
      console.log('res1', res1); // eslint-disable-line
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
      console.log('res2', res2); // eslint-disable-line
      if (res2) {
        const edges = res2.data.map(item => ({
          sid: item.node1,
          tid: item.node2,
          weight: item.weight,
        }));
        commit('updateEdges', { edges });
      }
    },
    async postKnowledgeMapData({ state }) {
      const lectureKeywords = state.nodes.map(item => ({
        keyword: item.name,
        weight: Number.parseInt(item._size, 10), // eslint-disable-line
      }));
      console.log('lectureKeywords', lectureKeywords); // eslint-disable-line
      await lectureService.postLectureKeywords({
        lectureId: state.scId,
        lectureKeywords,
      });
      const lectureRelations = state.edges.map(item => ({
        node1: item.sid,
        node2: item.tid,
        weight: item.weight,
      }));
      console.log('lectureRelations', lectureRelations); // eslint-disable-line
      await lectureService.postLectureKeywordRelations({
        lectureId: state.scId,
        lectureRelations,
      });
    },
  },
};
