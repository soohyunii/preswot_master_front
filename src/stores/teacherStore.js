import classService from '../services/classService';
import lectureService from '../services/lectureService';
import lectureItemService from '../services/lectureItemService';

import utils from '../utils';

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
     * @var {number} scId: 백엔드 디비의 lectures 테이블의 lecture_id에 해당
     * @var {string} scTitle
     * @var {string} scType
     * @var {string} scStartDatetime: (e.g. "2018-01-31 23:59:59")
     * @var {string} scDescription
     * @var { nodes: Array[node], edges: Array[node] }
     * @var {Array[scItem]} sc: shorthand for Scenario
     * @var {number} currentEditingScItemIndex: 현재 생성/편집 중인 시나리오 아이템 인덱스
     * @var {number} currentTeachingScItemIndex: 강의 중에 현재 진행되고 있는 시나리오 아이템 인덱스
     */
    scId: null,
    scTitle: null,
    scType: null,
    scStartDate: null,
    scEndDate: null,
    scDescription: null,
    scKnowledgeMap: null,
    sc: [],
    currentEditingScItemIndex: null,
    currentTeachingScItemIndex: null,
    nodes: [],
    edges: [],
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
      const isTeacherIdListNullOrEmpty = !teacherIdList || teacherIdList.length === 0;
      if (isTeacherIdListNullOrEmpty) {
        return false;
      }
      const isTeacherIdListAllNumber = teacherIdList.every(
        value => (typeof value === 'number'),
      );
      if (!isTeacherIdListAllNumber) {
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
    DEBUGscenarioServerWillReceive(state) {
      // TODO: delete
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
      state.newClass = newClass;
    },
    assignNewClass(state, { newClass }) {
      Object.assign(
        state.newClass,
        newClass,
      );
    },
    assignCurrentClass(state, { currentClass }) {
      const c = state.teachingClassList[state.currentClassIndex];
      Object.assign(
        c,
        currentClass,
      );
    },
    updateScId(state, { scId }) {
      state.scId = scId;
    },
    pinning(state, { pinned, node }) {
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
    addNodes(state, { node }) {
      const lastNode = state.nodes[state.nodes.length - 1];
      let x;
      let y;
      if (lastNode) {
        x = lastNode.x + 50;
        y = lastNode.y + 50;
      } else {
        x = 0;
        y = 0;
      }
      const createNode = {
        value: node.value,
        id: node.id,
        name: '\n',
        _size: node._size, // eslint-disable-line
        x,
        y,
        pinned: false,
      };
      state.nodes.push(createNode);
    },
    addEdges(state, { edge }) {
      state.edges.push(edge);
    },
    deleteNodes(state, { nodeIndex }) {
      state.nodes.splice(nodeIndex, 1);
    },
    deleteEdges(state, { edgeIndex }) {
      state.edges.splice(edgeIndex, 1);
    },
    updateScTitle(state, { scTitle }) {
      state.scTitle = scTitle;
    },
    updateScType(state, { scType }) {
      state.scType = scType;
    },
    updateScStartDate(state, { scStartDate }) {
      state.scStartDate = scStartDate;
    },
    updateScEndDate(state, { scEndDate }) {
      state.scEndDate = scEndDate;
    },
    updateScDescription(state, { scDescription }) {
      state.scDescription = scDescription;
    },
    pushScItem(state, { type, id }) {
      const title = null;
      const order = null; // 예습? 본강의? 복습?
      const description = null;
      const activeStartOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 활성화되냐
      const activeEndOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 비활성화되냐
      const isResultVisible = true; // 설문이나 문항을 풀고 나서 수강생중 몇퍼가 1번 선택했고.. 뭐 그런게 결과인데, 결과가 보이냐 마냐
      const fileList = [];
      const survey = { choice: [] };
      const scItem = {
        id,
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
    assignCurrentEditingScItem(state, { currentEditingScItem }) {
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
      const isCurrentEditingItem =
        state.currentEditingScItemIndex === lectureElementIndex;
      const isLastItem = lectureElementIndex === state.sc.length - 1;
      const isBeforeCurrentEditingItem =
        lectureElementIndex < state.currentEditingScItemIndex;

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
      // TODO: pass intendedLectureNum
      const res = await classService.createClass(state.newClass);
      if (res.data && res.data.success) {
        return res;
      }
      throw new Error(`create class failed ${res.status}`);
    },
    async fetchClass({ state, getters, commit }) {
      if (state.currentClassIndex === null) {
        return;
      }
      const currentClass = getters.currentClass;
      const res = await classService.fetchClass({
        id: currentClass.class_id,
      });
      commit('assignCurrentClass', {
        currentClass: {
          scenarioList: res.data.lectures,
        },
      });
    },
    async getSc({ state, commit }) {
      const res = await lectureService.getLecture({
        lectureId: state.scId,
      });
      console.log('getSc res', res.data.lecture_items[0]); // eslint-disable-line
      commit('updateScTitle', {
        scTitle: res.data.name,
      });
      commit('updateScStartDate', {
        scStartDate: res.data.intended_start,
      });
      commit('updateScEndDate', {
        scEndDate: res.data.intended_end,
      });
      commit('updateScType', {
        scType: utils.convertScType(res.data.type),
      });
      commit('updateScDescription', {
        scDescription: res.data.description,
      });
      // eslint-disable-next-line
      const sc = res.data.lecture_items.map((scItem) => {
        return {
          id: scItem.lecture_item_id,
          title: scItem.name,
          description: scItem.description,
          type: utils.convertScItemType(scItem.type),
          // TODO: map other keys
        };
      });
      commit('updateSc', {
        sc,
      });
      commit('updateCurrentEditingScItemIndex', {
        currentEditingScItemIndex: 0,
      });
    },
    async createSc({ getters, rootGetters }) {
      const userId = rootGetters['auth/userId'];
      const classId = getters.currentClass.class_id;

      const res = await lectureService.postLecture({
        classId,
        teacherId: userId,
      });
      return res.data.lecture_id;
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
      commit('updateSc', {
        sc: [],
      });
    },
    async putScTitle({ commit, state }, { scTitle }) {
      await lectureService.putLectureName({
        lectureId: state.scId,
        lectureName: scTitle,
      });
      commit('updateScTitle', {
        scTitle,
      });
    },
    /**
     * @param {Date} scStartDate
     */
    async putScStartDate({ state }, { scStartDate }) {
      await lectureService.putLectureIntendedStart({
        lectureId: state.scId,
        lectureStartDate: scStartDate,
      });
    },
    /**
     * @param {Date} scEndDate
     */
    async putScEndDate({ state }, { scEndDate }) {
      await lectureService.putLectureIntendedEnd({
        lectureId: state.scId,
        lectureEndDate: scEndDate,
      });
    },
    /**
     * @param {string 강의|숙제|퀴즈|시험} scType
     */
    async putScType({ state }, { scType }) {
      /* eslint-disable no-nested-ternary */
      // TODO: replace '강의'  => 0 mapping according to server definition
      // TODO: you should also change the mapping @ ClassScenario.vue
      // (or.. it will be renamed as ScenarioTabl
      const lectureType = utils.convertScType(scType);
      /* eslint-enable no-nested-ternary */
      if (lectureType instanceof Error) {
        throw lectureType;
      }
      await lectureService.putLectureType({
        lectureId: state.scId,
        lectureType,
      });
    },
    /**
     * @param {string} scDescription
     */
    async putScDescription({ state }, { scDescription }) {
      await lectureService.putLectureDescription({
        lectureId: state.scId,
        lectureDescrption: scDescription,
      });
    },
    /**
     * @param {string 문항|설문|강의자료|숙제} scItemType
     */
    async postScItem({ state }, { scItemType }) {
      const lectureItemType = utils.convertScItemType(scItemType);
      if (lectureItemType instanceof Error) {
        throw lectureItemType;
      }
      const res = await lectureItemService.postLectureItem({
        lectureId: state.scId,
        lectureItemType,
      });
      return res.data.lecture_item_id;
    },
    async putScItemTitle({ getters }, { scItemTitle }) {
      await lectureItemService.putLectureItemName({
        lectureItemId: getters.currentEditingScItem.id,
        lectureItemName: scItemTitle,
      });
    },
  },
};
