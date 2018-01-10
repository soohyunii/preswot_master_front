const savedIsNavCollapsed = JSON.parse(window.localStorage.getItem('isNavCollapsed')) || false;

export default {
  namespaced: true,
  state: {
    isNavCollapsed: savedIsNavCollapsed,
  },
  mutations: {
    updateCollapse(state, { isNavCollapsed }) {
      state.isNavCollapsed = isNavCollapsed;
      window.localStorage.setItem('isNavCollapsed', isNavCollapsed.toString());
    },
  },
};
