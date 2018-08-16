import boardService from '../services/boardService';
import fileService from '../services/fileService';

export default {
  namespaced: true,
  state: {
    postList: [], // 게시판 첫 화면에서 보여줄 post의 목록
    post: {}, // 상세 에서 나타낼 post 1건
    modifyMode: false, // 상세 -> 수정(쓰기) 이동 시 수정상태임을 표시하는 플래그
  },
  mutations: {
    updatePostList(state, { postList }) {
      postList.forEach((element) => {
        element.created_at = element.created_at.substr(0, 10); // eslint-disable-line
      });
      state.postList = postList;
    },
    updatePost(state, { post }) {
      state.post = post;
    },
    addReply(state, { reply }) {
      state.post.board_replies.push(reply);
    },
    deleteReply(state, { replyId }) {
      state.post.board_replies.forEach((element, index) => {
        if (element.board_reply_id === replyId) {
          state.post.board_replies.splice(index,1);  // eslint-disable-line
        }
      });
    },
    setModifyMode(state, { flag }) {
      state.modifyMode = flag;
    },
  },
  actions: {
    async getPostList({ commit }, { type, query, classId, pageNum }) {
      const res = await boardService.getPostList({
        type,
        query,
        classId,
        pageNum,
      });
      commit('updatePostList', {
        postList: res.data,
      });
    },
    async getPost({ commit }, { classId, boardId }) {
      const res = await boardService.getPost({
        classId,
        boardId,
      });
      commit('updatePost', {
        post: res.data,
      });
    },
    async getPostTotalCount(_, { type, query, classId }) {
      const res = await boardService.getPostTotalCount({
        type,
        query,
        classId,
      });
      return res.data.totalNumber;
    },
    async postPost(_, { classId, name, content, fileGuid }) {
      const res = await boardService.postPost({
        classId,
        name,
        content,
        fileGuid,
      });
      return res;
    },
    async postFile(_, { file }) {
      const res = await boardService.postFile({
        file,
      });
      return res;
    },
    async deletePost({ commit }, { classId, boardId }) {
      await boardService.deletePost({
        classId,
        boardId,
      });
      commit('updatePost', {
        post: null,
      });
    },
    async modifyPost(_, { classId, name, content, fileGuid, boardId }) {
      await boardService.modifyPost({
        classId,
        name,
        content,
        fileGuid,
        boardId,
      });
    },
    async postReply({ commit }, { boardId, content }) {
      const res = await boardService.postReply({
        boardId,
        content,
      });
      commit('addReply', {
        reply: res.data,
      });
    },
    async deleteReply({ commit }, { boardId, replyId }) {
      await boardService.deleteReply({
        boardId,
        replyId,
      });
      commit('deleteReply', {
        replyId,
      });
    },
    async deleteFile(_, { fileGuid }) {
      const res = await fileService.deleteFile({
        fileGuid,
      });
      return res;
    },
    async postFileWithID(_, { classId, boardId, file }) {
      const res = await boardService.postFileWithID({
        classId,
        boardId,
        file,
      });
      return res;
    },
    setModifyMode({ commit }, { flag }) {
      commit('setModifyMode', {
        flag,
      });
    },
  },
};
