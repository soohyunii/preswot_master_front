export default {
  namespaced: true,
  state: {
    lectureElementSequence: [], // TODO: fetch(init) from server if exists
    // TODO: Otherwise, init from localStorage (in case of server has no data)
    currentEditingElement: null, // TODO: init from localStorage
    // TODO: save currentEditingElement into localStorage inside Vue component using watch
  },
  mutations: {
    pushLectureElement(state, { lectureElement }) {
      state.lectureElementSequence.push(lectureElement);
      // TODO: save lectureElementSequence using localForage
    },
    deleteLectureElement(state, { lectureElementIndex }) {
      state.lectureElementSequence.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    editLectureElement(state, { evt }) {
      state.lectureElementSequence = evt.slice();
    },
  },
};
