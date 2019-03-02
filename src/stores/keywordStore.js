/**
 * Keyword (and Material) Store
 * 강사 강의 관리 페이지 > 강의 자료 및 키워드 등록에 쓰이는 vuex store
 */
import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    recommendKeywordList: null, // 서버에서 불러온 강의자료에서 추출된 키워드들
    keywordList: [], // 서버에서 불러온 강사가 추가한 키워드들
    removedKeywordList: [], // 서버에서 불러온 강의자료에서 추출된 키워드들 중에서 삭제될 키워드들
    movedKeywordList: [], // rkl 에서 kl로 옮겨진 키워드들
    addedKeywordList: [], // 브라우저에서 강사가 직접 추가했으나 아직 서버에 업로드 되진 않은 키워드들
  },
  getters: {
    isKeywordDuplicated: state => (keyword) => {
      let check = false;
      for (const property in state.keywordList) { // eslint-disable-line
        if (state.keywordList[property].keyword === keyword) {
          check = true;
        }
      }
      return check;
    },
    // isRecommendKeyword: state => keyword => state.recommendKeywordList.includes(keyword),
  },
  mutations: {
    updateKeywordList(state, { keywordList }) {
      state.keywordList = keywordList;
    },
    updateMovedKeywordList(state, { movedKeywordList }) {
      state.movedKeywordList = movedKeywordList;
    },
    updateAddedKeywordList(state, { addedKeywordList }) {
      state.addedKeywordList = addedKeywordList;
    },
    updateRecommendKeywordList(state, { recommendKeywordList }) {
      state.recommendKeywordList = recommendKeywordList;
    },
  },
  actions: {
    /**
     * 강의 자료 및 키워드 등록 탭에서 필요한 키워드들 다 가져옴
     */
    async getKeywords({ rootState, state, commit }) {
      // TODO: 더미로 짜놓은거 api콜로 바꾸기
      /**
       * 여기서부터는 의사-코드
       * const lectureId = state.lecture.lecture_id;
       * const res1 = await lectureService.키워드 가져오는놈();
       * const res2 = await lectureService.추천 키워드 가져오는놈();
       * const leftRecommendKeywordList = res1.data.filter(x => !res2.data.has(x));
       */
      const lectureId = rootState.lc.lecture.lecture_id;
      const res1 = await lectureService.getLectureKeywords({
        lectureId,
      });
      commit('updateKeywordList', {
        keywordList: res1.data.map(x => ({
          keyword: x.keyword,
          weight: x.weight,
          keywordId: x.id,
          edit: false,
        })),
      });
      commit('updateRecommendKeywordList', {
        // recommendKeywordList: ['d', 'e'], // 이게 의사코드에서 leftRecommendKeywordList
        recommendKeywordList: [],
      });
      state.removedKeywordList = [];
    },
    // 기존에 등록된 키워드를 삭제하고 확인 누르는 경우, 서버에서 삭제
    deleteLectureKeywords({ state, rootState }) {
      state.removedKeywordList.forEach((element) => {
        const dictKeyword = {};
        dictKeyword.keyword = element.keyword;
        dictKeyword.weight = element.weight;
        lectureService.deleteLectureKeyword({
          lectureId: rootState.lc.lecture.lecture_id,
          lectureKeyword: dictKeyword.keyword,
        });
      });
      state.removedKeywordList = [];
    },
    // 기존에 등록된 키워드를 삭제하고 확인 누르는 경우, 서버에서 삭제
    // 기존 - 삭제후 남은 키워드 목록을 서버에 전달
    // 신규 - 삭제될 키워드만 서버에 전달, 리턴값 반환
    NNdeleteLectureKeyword({ state, rootState }, { keywordId }) {
      return lectureService.NNdeleteLectureKeyword({
        lectureId: rootState.lc.lecture.lecture_id,
        keywordId,
      });
    },
    // 키워드를 등록하고 확인 버튼을 누르는 경우, 서버에 등록
    postLectureKeywords({ state, rootState }) {
      // mixedList = mixedList.map(x => ({ keyword: x, weight: 20 }));
      lectureService.postLectureKeywords({
        lectureId: rootState.lc.lecture.lecture_id,
        lectureKeywords: state.keywordList,
      });
      /*
      // 현재 화면 정리 - 뒤로가기하고 글 다시 누를 경우 값이 겹치는 오류 해결목적
      state.keywordList = state.keywordList.concat(state.addedKeywordList);
      state.addedKeywordList = [];
      state.keywordList = state.keywordList.concat(state.movedKeywordList);
      state.movedKeywordList = [];
      */
    },
    // 키워드를 등록하고 확인 버튼을 누르는 경우, 서버에 등록
    // 기존에 state에 존재하는 모든 키워드를 넣는것에서, 새로 추가한 키워드만 넣는걸로 변경
    NNpostLectureKeyword({ state, rootState }, { keyword, weight }) {
      // mixedList = mixedList.map(x => ({ keyword: x, weight: 20 }));
      return lectureService.NNpostLectureKeyword({
        lectureId: rootState.lc.lecture.lecture_id,
        keyword,
        weight,
      });
    },

    NNputLectureKeyword({ state, rootState }, { keyword, weight, keywordId }) {
      return lectureService.NNputLectureKeyword({
        lectureId: rootState.lc.lecture.lecture_id,
        keywordId,
        keyword,
        weight,
      });
    },
    // 키워드에 x키를 눌렀을 때 vuex단에서만 삭제
    deleteKeyword({ state }, { payload }) {
      if (state.keywordList.includes(payload)) {
        state.keywordList.splice(state.keywordList.indexOf(payload), 1);
        state.removedKeywordList.push(payload);
      } else if (state.addedKeywordList.includes(payload)) {
        state.addedKeywordList.splice(state.addedKeywordList.indexOf(payload), 1);
      } else if (state.recommendKeywordList.includes(payload)) {
        state.movedKeywordList.splice(state.movedKeywordList.indexOf(payload), 1);
      } else {
        throw new Error('@IcStore.js/action/deleteKeyword : where are you from..?');
      }
    },
  },
};
