// import utils from '../utils';
import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    lecture: null, // getLecture로 불러온 정보 여기에 저장
    // 키워드 관련 변수들 시작 //
    recommendKeywordList: null, // 서버에서 불러온 강의자료에서 추출된 키워드들
    keywordList: null, // 서버에서 불러온 강사가 추가한 키워드들
    movedKeywordList: [], // rkl 에서 kl로 옮겨진 키워드들
    addedKeywordList: [], // 브라우저에서 강사가 직접 추가했으나 아직 서버에 업로드 되진 않은 키워드들
    // 키워드 관련 변수들 끝 //
  },
  getters: {
  },
  mutations: {
    updateLecture(state, { lecture }) {
      state.lecture = lecture;
    },
    // 키워드 관련 뮤테이션들 시작 //
    updateRecommendKeywordList(state, { recommendKeywordList }) {
      state.recommendKeywordList = recommendKeywordList;
    },
    updateKeywordList(state, { keywordList }) {
      state.keywordList = keywordList;
    },
    updateMovedKeywordList(state, { movedKeywordList }) {
      state.movedKeywordList = movedKeywordList;
    },
    updateAddedKeywordList(state, { addedKeywordList }) {
      state.addedKeywordList = addedKeywordList;
    },
    // 키워드 관련 뮤테이션들 끝 //
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
    /**
     * 강의 자료 및 키워드 등록 탭에서 필요한 키워드들 다 가져옴
     */
    async getKeywords({ commit }) {
      /**
       * 여기서부터는 의사-코드
       * const lectureId = state.lecture.lecture_id;
       * const res1 = await lectureService.키워드 가져오는놈();
       * const res2 = await lectureService.추천 키워드 가져오는놈();
       * const leftRecommendKeywordList = res1.data.filter(x => !res2.data.has(x));
       */
      commit('updateKeywordList', {
        keywordList: ['a', 'b', 'c'], // 이게 의사코드에서 res1.data
      });
      commit('updateRecommendKeywordList', {
        recommendKeywordList: ['d', 'e'], // 이게 의사코드에서 leftRecommendKeywordList
      });
    },
  },
};
