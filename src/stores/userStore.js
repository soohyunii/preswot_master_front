import classService from '../services/classService';
/**
 * 지금 store.state에 들어가는거에서나
 * 아니면 백엔드에서 응답하는 값에서나
 * 학생쪽 데이터와 강사쪽 데이터가 겹치는 부분이 있음
 *
 * 예를 들어 지금 auth쪽에 빠져있는 locale도 이쪽으로 가져오면 좋을 것 같고 TODO:
 * api 중에서는 /classes/my 가 TeachingClasses와 studyingClasses가 함꼐 리턴됨
 * 이런 경우에 `/classes/my` 를 두 번 부르는건 개짓거리고
 * 이 userStore에서 부른 뒤에 그 결과를 각각 teacherStore, studentStore에 나눠 저장하는 것으로 한다.
 */
export default {
  namespaced: true,
  actions: {
    async fetchMyClassLists({ commit }) {
      const res = await classService.fetchingMyClassList();

      const sc = res.data.studyingClasses;
      if (sc && sc.length !== 0) {
        commit('student/pushStudyingClass', {
          studyingClassList: res.data.studyingClasses,
        }, {
          root: true,
        });
      }

      const tc = res.data.teachingClasses;
      if (tc && tc.length !== 0) {
        commit('teacher/pushTeachingClass', {
          teachingClassList: res.data.teachingClasses,
        }, {
          root: true,
        });
      }
    },
  },
};
