import Guid from 'guid';
import classService from '../services/classService';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * Teacher store 공통 변수들
     * @var {Array[class]} teachingClassList
     */
    teachingClassList: [],
    // //////////////////////////절취선////////////////////////// //
    /**
     * TeacherClassIndex 관련 변수들
     * @var {number} currentClassIndex: teachingClassList에서 선택된 과목의 index
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
     * @var {Array[number]} newClass.teacherIdList 강사 (user_id) 목록
     * @var {string} newClass.description: 과목 소개 (설명)
     * @var {Date} newClass.activeStartDate: 과목 활성화 시각
     * @var {Date} newClass.activeEndDate: 과목 비활성화 시각
     */
    newClass: {
      title: null,
      teacherIdList: null,
      description: null,
      activeStartDate: null,
      activeEndDate: null,
    },
    // //////////////////////////절취선////////////////////////// //
    /**
     * TeacherLectureNew / TeacherLectureLive 관련 변수들
     * @var {string} scTitle
     * @var {string} scType
     * @var {string} scStartDatetime: (e.g. "2018-01-31 23:59:59")
     * @var {string} scDescription
     * @var { nodes: Array[node], edges: Array[node] }
     * @var {Array[scItem]} sc: shorthand for Scenario
     * @var {number} currentEditingScItemIndex: 현재 생성/편집 중인 시나리오 아이템 인덱스
     * @var {number} currentTeachingScItemIndex: 강의 중에 현재 진행되고 있는 시나리오 아이템 인덱스
     */
    scTitle: null,
    scType: null,
    scStartDatetime: null,
    scDescription: null,
    scKnowledgeMap: null,
    sc: [],
    currentEditingScItemIndex: null,
    currentTeachingScItemIndex: null,
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
    isNewClassValid(state) {
      const {
        title,
        teacherIdList,
        description,
        activeStartDate,
        activeEndDate,
      } = state.newClass;

      if (!title) {
        return false;
      }
      if (!teacherIdList || teacherIdList.length === 0) {
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
    isTeachingClassListEmpty(state) {
      return state.teachingClassList.length === 0;
    },
    currentClass(state) {
      const index = state.currentClassIndex;
      if (index === null) {
        return null;
      }
      return state.teachingClassList[index];
    },
    isScEmpty(state) {
      return state.sc.length === 0;
    },
    currentEditingScItem(state) {
      return state.sc[state.currentEditingScItemIndex];
    },
    currentTeachingScItem(state) {
      return state.sc[state.currentTeachingScItemIndex];
    },
    DEBUGscenarioServerWillReceive(state) { // TODO: delete
      const res = {};
      res.title = state.scTitle;
      res.type = state.scType;
      res.startDatetime = state.scStartDatetime;
      res.description = state.scDescription;
      res.knowledgeMap = state.scKnowledgeMap;

      res.sc = state.sc;
      return res;
    },
  },
  mutations: {
    updateCurrentClassIndex(state, { currentClassIndex }) {
      state.currentClassIndex = currentClassIndex;
    },
    updateNewClass(state, { newClass }) {
      Object.assign(
        state.newClass,
        newClass,
      );
    },
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScStartDatetime(state, { scStartDatetime }) {
      state.scStartDatetime = scStartDatetime;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
    },
    pushScItem(state, { type }) {
      // TODO: 타입에 따라서 scItem Object에 들어가는 key 조정
      const key = Guid.create().toString();
      const title = null;
      const order = null; // 예습? 본강의? 복습?
      const description = null;
      const activeStartOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 활성화되냐
      const activeEndOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 비활성화되냐
      const isResultVisible = true; // 설문이나 문항을 풀고 나서 수강생중 몇퍼가 1번 선택했고.. 뭐 그런게 결과인데, 결과가 보이냐 마냐
      const fileList = [];
      const survey = { choice: [] };
      const scItem = {
        key,
        title,
        type,
        order,
        activeStartOffsetSec,
        activeEndOffsetSec,
        isResultVisible,
        description,
        fileList,
        survey,
      };
      state.currentEditingScItemIndex = state.sc.length;
      state.sc.push(scItem);
      // TODO: save lectureElementSequence using localForage
    },
    updateCurrentEditingScItem(state, { currentEditingScItem }) {
      // console.log('currentEditingScItem', currentEditingScItem);
      Object.assign(
        state.sc[state.currentEditingScItemIndex],
        currentEditingScItem,
      );
    },
    updateCurrentEditingScItemIndex(state, { currentEditingScItemIndex }) {
      state.currentEditingScItemIndex = currentEditingScItemIndex;
    },
    updateCurrentTeachingScItemIndex(state, { index }) {
      state.currentTeachingScItemIndex = index;
    },
    // FIXME: rename `lectureELementIndex` with `currentEditingScItemIndex`
    deleteScItem(state, { lectureElementIndex }) {
      const isCurrentEditingItem = state.currentEditingScItemIndex === lectureElementIndex;
      const isLastItem = lectureElementIndex === state.sc.length - 1;
      const isBeforeCurrentEditingItem = lectureElementIndex < state.currentEditingScItemIndex;

      if ((isCurrentEditingItem && isLastItem) || isBeforeCurrentEditingItem) {
        state.currentEditingScItemIndex -= 1;
      }
      state.sc.splice(lectureElementIndex, 1);
      // TODO: update localForage
    },
    // TODO: editLectureElement
    updateSc(state, { sc }) {
      state.sc = sc;
    },
    /**
     * 하나 넣거나, 여러개 넣거나
     * @param {object} state
     * @param {object} teachingClass?
     * @param {Array[object]} teachingClassList?
     */
    pushTeachingClass(state, { teachingClass, teachingClassList }) {
      if (teachingClass) {
        state.teachingClassList.push(teachingClass);
      }
      if (teachingClassList) {
        Array.prototype.push.apply(state.teachingClassList, teachingClassList);
      }
    },
    updateTeachingClassList(state, { teachingClassList }) {
      state.teachingClassList = teachingClassList;
    },
    deleteTeachingClass(state, { teachingClassIndex }) {
      state.teachingClassList.splice(teachingClassIndex, 1);
    },
  },
  actions: {
    async createClass({ state, getters }) {
      // console.log('state', state);
      if (!getters.isNewClassValid) {
        throw new Error('invalid');
      }
      // TODO: intendedLectureNum
      // TODO: activeStartDate
      // TODO: activeEndDate
      const res = await classService.createClass(state.newClass);
      console.log('res', res);
    },
  },
};
