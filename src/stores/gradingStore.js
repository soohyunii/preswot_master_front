import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    itemList: [], // items that need grading
  },
  mutations: {
    updateItemList(state, { itemList }) {
      state.itemList = itemList;
    },
  },
  actions: {
    async getClassNeedGrading({ commit }, { classId }) {
      const res = await classService.getClassNeedScoring({
        id: classId,
      });
      console.log('getClassNeedGrading', res.data); // eslint-disable-line
      commit('updateItemList', {
        itemList: res.data.items,
      });
    },
  },
};
