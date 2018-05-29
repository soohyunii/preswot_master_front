import deepCopy from 'deep-copy';
import isArray from 'lodash.isarray';
// import utils from '../utils';
import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * 공통 변수들
     * 초기값으로 []를 주니까 서버에서 받아온건데 비어있는건지
     * 아니면 아직 서버로부터 안받아온건지 구분이 안가서 null로 초기화함
     */
    openedClassList: null,
    goingClassList: null,
    finishedClassList: null,
    studyingClassList: null,
    teachingClassList: null,
    popularClassList: null,
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
    isTeachingClassListEmpty(state) {
      if (!isArray(state.teachingClassList)) {
        return false;
      }
      return state.teachingClassList.length === 0;
    },
    isStudyingClassListEmpty(state) {
      if (!isArray(state.studyingClassList)) {
        return false;
      }
      return state.studyingClassList.length === 0;
    },
    currentTeachingClass: state => (classId) => {
      if (!Array.isArray(state.teachingClassList)) {
        return null;
      }
      return state.teachingClassList.find(item => item.class_id === classId);
    },
  },
  mutations: {
    updateOpenedClassList(state, { openedClassList }) {
      state.openedClassList = openedClassList;
    },
    updateGoingClassList(state, { goingClassList }) {
      state.goingClassList = goingClassList;
    },
    updateFinishedClassList(state, { finishedClassList }) {
      state.finishedClassList = finishedClassList;
    },
    updateStudyingClassList(state, { studyingClassList }) {
      state.studyingClassList = studyingClassList;
    },
    deleteStudyingClass(state, { studyingClassIndex }) {
      state.studyingClassList.splice(studyingClassIndex, 1);
    },
    updateTeachingClassList(state, { teachingClassList }) {
      state.teachingClassList = teachingClassList;
    },
    deleteTeachingClass(state, { teachingClassIndex }) {
      state.teachingClassList.splice(teachingClassIndex, 1);
    },
    deleteScenario(state, { classId, lectureId }) {
      const currentClass = state.teachingClassList.find(item => item.class_id === classId);
      const tIndex = currentClass.lectures.findIndex(item => item.lecture_id === lectureId);
      currentClass.lectures.splice(tIndex, 1);
    },
    updatePopularClassList(state, { popularClassList }) {
      state.popularClassList = popularClassList;
    },
  },
  actions: {
    async getClassLists({ commit }) {
      const res = await classService.getClassLists();
      commit('updateOpenedClassList', {
        openedClassList: res.data.openedClasses,
      });
      commit('updateGoingClassList', {
        goingClassList: res.data.goingClasses,
      });
      commit('updateFinishedClassList', {
        finishedClassList: res.data.finishedClasses,
      });
    },
    async getMyClassLists({ commit }) {
      const res = await classService.getMyClassList();

      const sc = res.data.studyingClasses;
      if (sc && sc.length !== 0) {
        commit('updateStudyingClassList', {
          studyingClassList: sc,
        });
      }

      const tc = res.data.teachingClasses;
      if (tc && tc.length !== 0) {
        commit('updateTeachingClassList', {
          teachingClassList: tc,
        });
      }
    },
    async getClass({ state, commit }, { type, classId }) {
      const res = await classService.getClass({
        id: classId,
      });
      if (type === 'TEACHER') {
        const newTeachingClassList = deepCopy(state.teachingClassList);
        const currentClass = newTeachingClassList.find(item => item.class_id === classId);
        currentClass.lectures = res.data.lectures;
        commit('updateTeachingClassList', {
          teachingClassList: newTeachingClassList,
        });
      } else {
        const newStudyingClassList = deepCopy(state.studyingClassList);
        const currentClass = newStudyingClassList.find(item => item.class_id === classId);
        currentClass.lectures = res.data.lectures;
        commit('updateStudyingClassList', {
          studyingClassList: newStudyingClassList,
        });
      }
    },
    async deleteScenario({ commit }, { classId, lectureId }) {
      commit('deleteScenario', {
        classId,
        lectureId,
      });
    },
    async getPopularClassList({ commit }) {
      commit('updatePopularClassList', {
        popularClassList: [{
          title: '한국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['설민석'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '미국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['미미미'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '중국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['중중중'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '일국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['일일일'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '러국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사2',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사3',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사4',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사5',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사6',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사7',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사8',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사9',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }, {
          title: '국사10',
          description: '과목 소개 불라불라 불라불라불라불라불라불라불라불라',
          classId: 1,
          teacherlist: ['러러러'],
          startDateStr: '2018-01-05',
          endDateStr: '2018-05-09',
        }],
      });
    },
  },
};
