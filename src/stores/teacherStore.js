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
      console.log(evt);
      console.log(state.lectureElementSequence);
      const draggedIndex = evt.draggedContext.index / 3;
      const relatedIndex = evt.relatedContext.index / 3;
      console.log(draggedIndex);
      console.log(relatedIndex);
      const temp = state.lectureElementSequence[0];
      console.log(temp);
      // eslint-disable-next-line
      state.lectureElementSequence[draggedIndex] = state.lectureElementSequence[relatedIndex];
      state.lectureElementSequence[relatedIndex] = temp;
    },
  },
};
