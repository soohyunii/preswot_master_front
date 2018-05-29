// import utils from '../utils';
import lectureService from '../services/lectureService';

export default {
  namespaced: true,
  state: {
    lecture: null, // getLecture로 불러온 정보 여기에 저장
    // 키워드 관련 변수들 시작 //
    recommendKeywordList: null, // 서버에서 불러온 강의자료에서 추출된 키워드들
    keywordList: null, // 서버에서 불러온 강사가 추가한 키워드들
    removedKeywordList: null, // 서버에서 불러온 강의자료에서 추출된 키워드들 중에서 삭제될 키워드들
    movedKeywordList: [], // rkl 에서 kl로 옮겨진 키워드들
    addedKeywordList: [], // 브라우저에서 강사가 직접 추가했으나 아직 서버에 업로드 되진 않은 키워드들
    // 키워드 관련 변수들 끝 //
  },
  getters: {
    isKeywordDuplicated: state => keyword =>
      state.recommendKeywordList.includes(keyword) ||
      state.keywordList.includes(keyword) ||
      state.addedKeywordList.includes(keyword),
    isRecommendKeyword: state => keyword => state.recommendKeywordList.includes(keyword),
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
    async getKeywords({ state, commit }) {
      // TODO: 더미로 짜놓은거 api콜로 바꾸기
      /**
       * 여기서부터는 의사-코드
       * const lectureId = state.lecture.lecture_id;
       * const res1 = await lectureService.키워드 가져오는놈();
       * const res2 = await lectureService.추천 키워드 가져오는놈();
       * const leftRecommendKeywordList = res1.data.filter(x => !res2.data.has(x));
       */
      const lectureId = state.lecture.lecture_id;
      const res1 = await lectureService.getLectureKeywords({
        lectureId,
      });
      commit('updateKeywordList', {
        keywordList: res1.data.map(x => x.keyword),
      });
      commit('updateRecommendKeywordList', {
        recommendKeywordList: ['d', 'e'], // 이게 의사코드에서 leftRecommendKeywordList
      });
      state.removedKeywordList = [];
    },
    // 기존에 등록된 키워드를 삭제하고 확인 누르는 경우, 서버에서 삭제
    deleteLectureKeywords({ state }) {
      state.removedKeywordList.forEach((element) => {
        lectureService.deleteLectureKeyword({
          lectureId: state.lecture.lecture_id,
          lectureKeyword: element,
        });
      });
      state.removedKeywordList = [];
    },
    // 키워드를 등록하고 확인 버튼을 누르는 경우, 서버에 등록
    postLectureKeywords({ state }) {
      let mixedList = [];
      mixedList = mixedList.concat(state.movedKeywordList.concat(state.addedKeywordList));
      mixedList = mixedList.map(x => ({ keyword: x }));
      lectureService.postLectureKeywords({
        lectureId: state.lecture.lecture_id,
        lectureKeywords: mixedList,
      });
      // 현재 화면 정리 - 뒤로가기하고 글 다시 누를 경우 값이 겹치는 오류 해결목적
      state.keywordList = state.keywordList.concat(state.addedKeywordList);
      state.addedKeywordList = [];
      state.keywordList = state.keywordList.concat(state.movedKeywordList);
      state.movedKeywordList = [];
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
