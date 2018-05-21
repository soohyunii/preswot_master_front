import utils from '../utils';
import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * 공통 변수들
     * @var {Array[class]} teachingClassList
     */
    openedClassList: [],
    goingClassList: [],
    finishedClassList: [],
    studyingClassList: [],
    teachingClassList: [],
    // //////////////////////////절취선////////////////////////// //
    /**
     * ClassListAside 관련 변수들
     * @var {number} currentClassIndex: ClassListAside에서 선택된 과목의 index
     */
    currentClassIndex: null,
    // //////////////////////////절취선////////////////////////// //
    /**
     * TeacherClassNew 관련 변수들
     * ... 은 막 엄청 필요있을 것 같지가 않아서
     * 일단 만들고 바로 서버로 생성되는 애들인데 굳이
     * store에 귀찮게 하나하나 필드를 만들고 싶지 않고,
     * 그냥 하나의 object @var {object} newClass 에 퉁치는 것으로!
     * @var {string} newClass.title: 과목 제목
     * @var {Array[string]} newClass.teacherEmailList 강사 이메일 목록
     * @var {string} newClass.description: 과목 소개 (설명)
     * @var {Date} newClass.activeStartDate: 과목 활성화 시각
     * @var {Date} newClass.activeEndDate: 과목 비활성화 시각
     */
    newClass: {
      title: null,
      teacherEmailList: null,
      description: null,
      activeStartDate: null,
      activeEndDate: null,
    },
    /**
     * coverage 변수
     */
    currentClassCoverage: null,
    currentClassNeedScoring: null,
    // //////////////////////////절취선////////////////////////// //
    /**
     * ClassKnowledgeMap 관련 변수들
     * 과목 전체에 대한 키워드, 릴레이션 정보
     * @var {Array[class]}
     * @var {Array[class]}
     */
    nodes: [],
    edges: [],
  },
  getters: {
    isTeachingClassListEmpty(state) {
      return state.teachingClassList.length === 0;
    },
    isStudyingClassListEmpty(state) {
      return state.studyingClassList.length === 0;
    },
    isNewClassValid(state) {
      const {
        title,
        teacherEmailList,
        description,
        activeStartDate,
        activeEndDate,
      } = state.newClass;

      if (!title) {
        return false;
      }
      /*
      const isteacherEmailListNullOrEmpty = !teacherEmailList || teacherEmailList.length === 0;
      if (isteacherEmailListNullOrEmpty) {
        return false;
      } */
      const isteacherEmailListAllNumber = teacherEmailList ? teacherEmailList.every(
        value => utils.isValidEmail(value),
      ) : true;
      if (!isteacherEmailListAllNumber) {
        return false;
      }
      if (!description) {
        return false;
      }
      if (!activeStartDate) {
        return false;
      }
      if (activeEndDate) {
        const start = activeStartDate.getTime();
        const end = activeEndDate.getTime();
        return start < end;
      }
      return true;
    },
    currentTeachingClass(state) {
      const index = state.currentClassIndex;
      if (index === null) {
        return null;
      }
      return state.teachingClassList[index];
    },
    currentStudyingClass(state) {
      const index = state.currentClassIndex;
      if (index === null) {
        return null;
      }
      return state.studyingClassList[index];
    },
  },
  mutations: {
    updateCurrentClassIndex(state, { currentClassIndex, currentClassId }) {
      if (currentClassIndex === 0 || currentClassIndex) {
        state.currentClassIndex = currentClassIndex;
      }
      if (currentClassId) {
        for (let i = 0; i < state.teachingClassList.length; i += 1) {
          if (state.teachingClassList[i].class_id === currentClassId) {
            state.currentClassIndex = i;
          }
        }
      }
    },
    setNodesPinned(state, { pinned, node }) {
      let index = -1;
      state.nodes.forEach((item, idx) => {
        if (item.id === node.id) {
          index = idx;
        }
      });
      if (index < 0) {
        return;
      }
      // state.nodes[index].pinned = pinned;
      if (pinned) {
        state.nodes[index].pinned = true;
        state.nodes[index].fx = state.nodes[index].x;
        state.nodes[index].fy = state.nodes[index].y;
      } else {
        state.nodes[index].pinned = false;
        state.nodes[index].fx = null;
        state.nodes[index].fy = null;
      }
    },
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    updateOpenedClassList(state, { openedClassList }) {
      state.openedClassList = openedClassList;
    },
    updateGoingClassList(state, { goingClassList }) {
      state.goingClassList = goingClassList;
    },
    updateFinishedClassList(state, { finishedClassList }) {
      state.finishedClassList = finishedClassList;
    },
    updateNewClass(state, { newClass }) {
      state.newClass = newClass;
    },
    assignNewClass(state, { newClass }) {
      Object.assign(
        state.newClass,
        newClass,
      );
    },
    assignCurrentStudyingClass(state, { currentStudyingClass }) {
      const c = state.studyingClassList[state.currentClassIndex];
      Object.assign(
        c,
        currentStudyingClass,
      );
    },
    assignCurrentTeachingClass(state, { currentTeachingClass }) {
      const c = state.teachingClassList[state.currentClassIndex];
      Object.assign(
        c,
        currentTeachingClass,
      );
    },
    // pushStudyingClass(state, { studyingClass, studyingClassList }) {
    //   if (studyingClass) {
    //     state.studyingClassList.push(studyingClass);
    //   }
    //   if (studyingClassList) {
    //     Array.prototype.push.apply(state.studyingClassList, studyingClassList);
    //   }
    // },
    updateStudyingClassList(state, { studyingClassList }) {
      state.studyingClassList = studyingClassList;
    },
    deleteStudyingClass(state, { studyingClassIndex }) {
      state.studyingClassList.splice(studyingClassIndex, 1);
    },
    // /**
    //  * 하나 넣거나, 여러개 넣거나
    //  * @param {object} state
    //  * @param {object} teachingClass?
    //  * @param {Array[object]} teachingClassList?
    //  */
    // pushTeachingClass(state, { teachingClass, teachingClassList }) {
    //   if (teachingClass) {
    //     state.teachingClassList.push(teachingClass);
    //   }
    //   if (teachingClassList) {
    //     Array.prototype.push.apply(state.teachingClassList, teachingClassList);
    //   }
    // },
    updateTeachingClassList(state, { teachingClassList }) {
      state.teachingClassList = teachingClassList;
    },
    deleteTeachingClass(state, { teachingClassIndex }) {
      state.teachingClassList.splice(teachingClassIndex, 1);
    },
    updateCurrentClassCoverage(state, { currentClassCoverage }) {
      state.currentClassCoverage = currentClassCoverage;
    },
    updateCurrentClassNeedScoring(state, { currentClassNeedScoring }) {
      state.currentClassNeedScoring = currentClassNeedScoring;
    },
  },
  actions: {
    async getKnowledgeMapData({ getters, commit }, { isTeacher }) {
      const id = isTeacher ? getters.currentTeachingClass.class_id
        : getters.currentStudyingClass.class_id;
      const res1 = await classService.getClassCoverage({ id });
      window.console.log('res1', res1);
      const nodes = res1.data.keyword_coverages.map(item => ({
        value: item.keyword,
        id: item.keyword,
        name: item.keyword,
        _size: item.weight,
      }));
      commit('updateNodes', { nodes });

      // TODO: API 추가 시 주석 제거
      /*
      const res2 = await classService.getClassKeywordRelations({ id });
      const edges = res2.data.map(item => ({
        sid: item.node1,
        tid: item.node2,
        weight: item.weight,
      }));
      commit('updateEdges', { edges });
      */
    },
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
      sc.map((item) => {
        // eslint-disable-next-line
        item.scenarioList = null;
        return item;
      });
      if (sc && sc.length !== 0) {
        commit('updateStudyingClassList', {
          studyingClassList: sc,
        });
      }

      const tc = res.data.teachingClasses;
      tc.map((item) => {
        // eslint-disable-next-line
        item.scenarioList = null;
        return item;
      });
      // Object.assign(tc, {
      //   scenarioList: null,
      // });
      if (tc && tc.length !== 0) {
        commit('updateTeachingClassList', {
          teachingClassList: tc,
        });
      }
    },
    async postClass({ state, getters }) {
      // console.log('state', state);
      if (!getters.isNewClassValid) {
        throw new Error('invalid');
      }
      // TODO: pass intendedLectureNum
      await classService.postClass(state.newClass);
    },
    async putClass({ getters }) {
      await classService.putClass({
        name: getters.currentTeachingClass.name,
        description: getters.currentTeachingClass.description,
        activeStartDate: getters.currentTeachingClass.start_time,
        activeEndDate: getters.currentTeachingClass.end_time,
        opened: getters.currentTeachingClass.opened,
        id: getters.currentTeachingClass.class_id,
      });
    },
    async putScore({ state }, { id, score }) {
      await classService.putScore({
        id, score,
      });
    },
    async putHomeworkFeedback({ state }, { id, feedback }) {
      await classService.putHomeworkFeedback({
        id, feedback,
      });
    },
    async getClass({ state, getters, commit }, { type }) {
      if (state.currentClassIndex === null) {
        return;
      }
      // TODO: currentClass => currentTeaching(Studying)Class
      let currentClass;
      if (type === 'TEACHER') {
        currentClass = getters.currentTeachingClass;
      } else {
        currentClass = getters.currentStudyingClass;
      }
      const res = await classService.getClass({
        id: currentClass.class_id,
      });
      if (type === 'TEACHER') {
        commit('assignCurrentTeachingClass', {
          currentTeachingClass: {
            scenarioList: res.data.lectures,
          },
        });
      } else {
        commit('assignCurrentStudyingClass', {
          currentStudyingClass: {
            scenarioList: res.data.lectures,
          },
        });
      }
    },
    async deleteClass({ getters, commit }) {
      const currentClass = getters.currentTeachingClass;
      await classService.delete({
        id: currentClass.class_id,
      });
      commit('updateCurrentClassIndex', {
        currentClassIndex: null,
      });
    },
    async NNdeleteClass({ state }, { index }) {
      const currentClass = state.teachingClassList[index];
      await classService.delete({
        id: currentClass.class_id,
      });
    },
    async getClassCoverage({ state, getters, commit }, { type }) {
      if (state.currentClassIndex === null) {
        return;
      }
      let currentClass;
      if (type === 'TEACHER') {
        currentClass = getters.currentTeachingClass;
      } else {
        currentClass = getters.currentStudyingClass;
      }
      const res = await classService.getClassCoverage({
        id: currentClass.class_id,
      });
      commit('updateCurrentClassCoverage', {
        currentClassCoverage: res.data,
      });
    },
    async getClassNeedScoring({ state, getters, commit }, { type }) {
      if (state.currentClassIndex === null) {
        return;
      }
      let currentClass;
      if (type === 'TEACHER') {
        currentClass = getters.currentTeachingClass;
      } else {
        currentClass = getters.currentStudyingClass;
      }
      const res = await classService.getClassNeedScoring({
        id: currentClass.class_id,
      });
      commit('updateCurrentClassNeedScoring', {
        currentClassNeedScoring: res.data,
      });
    },
    async postClassUser(_, { classId }) {
      await classService.postClassUser({
        id: classId,
      });
    },
  },
};
