import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    nodes: [],
    edges: [],
    drawFlag: false,
  },
  mutations: {
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    updateDrawFlag(state, boolean) {
      state.drawFlag = boolean;
    },
  },
  actions: {
    // 이 함수는 NNTeacherLectureManage.vue의 lc.getKeywords와의 중복을 회피할 목적으로 service와 이름을 다르게 명명하였음.
    async getKeywordsAndWeights({ state, commit }, { lectureId }) {
      const res = await lectureService.getLectureKeywords({
        lectureId,
      });
      const nodes = res.data.map((item) => {
        // 키워드의 중요도 별 색상 구분을 위해 Single-Hue Color Scale을 사용하였음.
        // https://blogs.adobe.com/creativedialogue/ko/design-ko/the-power-of-the-palette-why-color-is-key-in-data-visualization-and-how-to-use-it/
        // https://www.w3schools.com/colors/colors_monochromatic.asp
        let color = '#E4F1F6';
        if (item.weight > 75) {
          color = '#1A3E4C';
        } else if (item.weight > 50) {
          color = '#347B98';
        } else if (item.weight > 25) {
          color = '#67AFCB';
        }

        return {
          id: item.keyword,
          label: item.keyword,
          weight: item.weight,
          color,
          size: 25,
        };
      });
      commit('updateNodes', {
        nodes,
      });
    },
    async getLectureKeywordRelations({ state, commit }, { lectureId }) {
      const res = await lectureService.getLectureKeywordRelations({
        lectureId,
      });
      const edges = res.data.map(item => ({
        id: item.node1.concat(item.node2),
        from: item.node1,
        to: item.node2,
        weight: item.weight,
      }));
      commit('updateEdges', {
        edges,
      });
    },
    async postLectureKeywords({ state }, { lectureId }) {
      const nodes = state.nodes.map(item => ({
        keyword: item.label,
        weight: Number(item.weight), // eslint-disable-line
      }));
      lectureService.postLectureKeywords({
        lectureId,
        lectureKeywords: nodes,
      });
    },
    async postLectureKeywordRelations({ state }, { lectureId }) {
      const edges = state.edges.map(item => ({
        node1: item.from,
        node2: item.to,
        weight: Number(item.weight),
      }));
      lectureService.postLectureKeywordRelations({
        lectureId,
        lectureRelations: edges,
      });
    },
    // deleteList를 따로 만들어서 모았다가 확인 버튼과 함께 지우는 구조를 구상했었는데 sync 문제로 꼬일것같아 보류합니다..
    async deleteLectureKeywordRelation({ state }, { index, lectureId }) {
      console.log(state.edges[index]);
      lectureService.deleteLectureKeywordRelation({
        lectureId,
        node1: state.edges[index].from,
        node2: state.edges[index].to,
      });
      state.edges.splice(index, 1);
    },
    reDrawD3Network({ commit }) { // 알수 없는 이유로 vue-D3-Network의 작동에 버그가 발생해서 임시방편으로 해결해둡니다.
      commit('updateD3Network', false);
      setTimeout(() => { commit('updateD3Network', true); }, 150);
    },
  },
};
