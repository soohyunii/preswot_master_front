import utils from '../utils';
import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    lecture: null,
  },
  getters: {
  },
  mutations: {
    updateLecture(state, { lecture }) {
      state.lecture = lecture;
    },
  },
  actions: {
    async getLecture({ state, commit }, { lectureId }) {
      const res = await lectureService.getLecture({
        lectureId,
      });
      // const plist = await lectureService.getLecturePlist({
      //   lectureId,
      // });
      // commit('updateScPlist', {
      //   scPlist: plist.data,
      // });
      // console.log('getSc plist', plist.data); // eslint-disable-line
      // console.log('getSc res', res.data); // eslint-disable-line
      commit('updateLecture', {
        lecture: res.data,
      });
      // // 지식맵 가져오는 부분을 이쪽으로 옮김
      // const res1 = await lectureService.getLectureKeywords({
      //   lectureId: state.scId,
      // });
      // const nodes = res1.data.map(item => ({
      //   value: item.keyword,
      //   id: item.keyword,
      //   name: item.keyword,
      //   _size: item.weight,
      // }));
      // commit('updateNodes', { nodes });
      // const res2 = await lectureService.getLectureKeywordRelations({
      //   lectureId: state.scId,
      // });
      // if (res2) {
      //   const edges = res2.data.map(item => ({
      //     sid: item.node1,
      //     tid: item.node2,
      //     weight: item.weight,
      //   }));
      //   commit('updateEdges', { edges });
      // }
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
