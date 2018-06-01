import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    nodes: [],
    edges: [],
    d3DrawFlag: false,
  },
  mutations: {
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    updateD3Network(state, boolean) {
      state.d3DrawFlag = boolean;
    },
  },
  actions: {
    // 이 함수는 NNTeacherLectureManage.vue의 lc.getKeywords와의 중복을 회피할 목적으로 service와 이름을 다르게 명명하였음.
    async getKeywordsAndWeights({ state, commit }, { lectureId }) {
      const res = await lectureService.getLectureKeywords({
        lectureId,
      });
      const nodes = res.data.map(item => ({
        value: item.keyword,
        id: item.keyword,
        name: item.keyword,
        _size: item.weight,
      }));
      commit('updateNodes', {
        nodes,
      });
    },
    async getLectureKeywordRelations({ state, commit }, { lectureId }) {
      const res = await lectureService.getLectureKeywordRelations({
        lectureId,
      });
      const edges = res.data.map(item => ({
        sid: item.node1,
        tid: item.node2,
        weight: item.weight,
      }));
      commit('updateEdges', {
        edges,
      });
    },
    async postLectureKeywords({ state }, { lectureId }) {
      const nodes = state.nodes.map(item => ({
        keyword: item.name,
        weight: Number(item._size), // eslint-disable-line
      }));
      lectureService.postLectureKeywords({
        lectureId,
        lectureKeywords: nodes,
      });
    },
    async postLectureKeywordRelations({ state }, { lectureId }) {
      const edges = state.edges.map(item => ({
        node1: item.sid,
        node2: item.tid,
        weight: item.weight,
      }));
      lectureService.postLectureKeywordRelations({
        lectureId,
        lectureRelations: edges,
      });
    },
    // deleteList를 따로 만들어서 모았다가 확인 버튼과 함께 지우는 구조를 구상했었는데 sync 문제로 꼬일것같아 보류합니다..
    async deleteLectureKeywordRelation({ state }, { index, lectureId }) {
      lectureService.deleteLectureKeywordRelation({
        lectureId,
        node1: state.edges[index].sid,
        node2: state.edges[index].tid,
      });
      state.edges.splice(index, 1);
    },
    reDrawD3Network({ commit }) { // 알수 없는 이유로 vue-D3-Network의 작동에 버그가 발생해서 임시방편으로 해결해둡니다.
      commit('updateD3Network', false);
      setTimeout(() => { commit('updateD3Network', true); }, 150);
    },
  },
};
