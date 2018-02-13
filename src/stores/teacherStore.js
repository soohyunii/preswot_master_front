import classService from '../services/classService';
import lectureService from '../services/lectureService';
import lectureItemService from '../services/lectureItemService';
import fileService from '../services/fileService';
import questionService from '../services/questionService';
import materialService from '../services/materialService';
import surveyService from '../services/surveyService';
import homeworkService from '../services/homeworkService';
import { baseURL } from '../services/http';

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
     * @var {number} currentEditingNodeIndex: 현재 편집 중인 노드 인덱스
     * @var {Array[node]} 시나리오 지식맵에서의 키워드
     * @var {Array[edge]} 시나리오 지식맵에서의 릴레이션
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
    currentEditingNodeIndex: null,
    nodes: [],
    edges: [],
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {
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
      const isteacherEmailListNullOrEmpty = !teacherEmailList || teacherEmailList.length === 0;
      if (isteacherEmailListNullOrEmpty) {
        return false;
      }
      const isteacherEmailListAllNumber = teacherEmailList.every(
        value => utils.isValidEmail(value),
      );
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
    currentEditingNode(state) {
      return state.nodes[state.currentEditingNodeIndex];
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
    pushNode(state, { node }) {
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
        _cssClass: '',
        _size: node._size, // eslint-disable-line
        x,
        y,
        pinned: false,
      };
      state.nodes.push(createNode);
    },
    pushItemKeyword(state, { keyword, score }) {
      state.sc[state.currentEditingScItemIndex].itemKeywords.push({
        keyword,
        score,
      });
    },
    updateItemKeywords(state, { keywords }) {
      state.sc[state.currentEditingScItemIndex].itemKeywords = keywords;
      console.log(state.sc[state.currentEditingScItemIndex].itemKeywords); // eslint-disable-line
    },
    assignCurrentEditingNode(state, { currentEditingNode }) {
      Object.assign(
        state.nodes[state.currentEditingNodeIndex],
        currentEditingNode,
      );
    },
    updateNodes(state, { nodes }) {
      state.nodes = nodes;
    },
    assignCurrentEditingNodeIndex(state, { currentEditingNodeIndex }) {
      state.currentEditingNodeIndex = currentEditingNodeIndex;
    },
    pushEdge(state, { edge }) {
      state.edges.push(edge);
    },
    updateEdges(state, { edges }) {
      state.edges = edges;
    },
    updateEdgeId(state, { oldNodeId, newNodeId }) {
      state.edges.forEach((item, index) => {
        if (item.tid === oldNodeId) {
          state.edges[index].tid = newNodeId;
        } else if (item.sid === oldNodeId) {
          state.edges[index].sid = newNodeId;
        }
      });
    },
    deleteNode(state, { nodeIndex }) {
      state.nodes.splice(nodeIndex, 1);
    },
    deleteEdge(state, { edgeIndex }) {
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
      const order = 0; // 예습 = 0 / 본강의 = 1 / 복습 = 2
      const description = null;
      const activeStartOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 활성화되냐
      const activeEndOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 비활성화되냐
      const isResultVisible = true; // 설문이나 문항을 풀고 나서 수강생중 몇퍼가 1번 선택했고.. 뭐 그런게 결과인데, 결과가 보이냐 마냐
      const fileList = [];
      const survey = {};
      const question = {};
      const homework = {};
      const itemKeywords = [];
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
        question,
        homework,
        itemKeywords,
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
    removeScItem(state, { lectureElementIndex }) {
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
    async getSc({ state, commit, dispatch, getters }) {
      const res = await lectureService.getLecture({
        lectureId: state.scId,
      });
      console.log('getSc res', res.data.lecture_items[0]); // eslint-disable-line
      commit('updateScTitle', {
        scTitle: res.data.name,
      });
      commit('updateScStartDate', {
        scStartDate: res.data.intended_start ? new Date(res.data.intended_start) : null,
      });
      commit('updateScEndDate', {
        scEndDate: res.data.intended_end ? new Date(res.data.intended_end) : null,
      });
      commit('updateScType', {
        scType: utils.convertScType(res.data.type),
      });
      commit('updateScDescription', {
        scDescription: res.data.description,
      });
      // eslint-disable-next-line
      const sc = res.data.lecture_items.map((scItem) => {
        // eslint-disable-next-line
        console.log('getSc scItem', scItem);
        return {
          id: scItem.lecture_item_id,
          title: scItem.name,
          description: scItem.description,
          type: utils.convertScItemType(scItem.type),
          activeStartOffsetSec: scItem.start_time,
          activeEndOffsetSec: scItem.end_time,
          order: scItem.order,
          isResultVisible: utils.convertBoolean(scItem.result),
          opened: scItem.opened,
          question: {},
          material: {},
          homework: {},
          survey: {},
          itemKeywords: [],
          fileList: [],
        };
      });
      commit('updateSc', {
        sc,
      });
      if (sc.length !== 0) {
        commit('updateCurrentEditingScItemIndex', {
          currentEditingScItemIndex: 0,
        });
        await dispatch('getScItem', {
          scItemId: getters.currentEditingScItem.id,
        });
        await dispatch('getItemKeywords');
      }
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
        // TODO: add state.scIsOpen,
        opened: true,
        teacherEmail: utils.getEmailFromJwt(),
        type,
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
      commit('updateSc', {
        sc: [],
      });
    },
    /**
     * 서버로부터 scItem을 받아와서 현재 scItem에 갱신한다.
     */
    async getScItem({ commit, state }, { scItemId }) {
      // * Get lectureItem with questions || surveys || homeworks || materials
      const res = await lectureItemService.getLectureItem({
        lectureItemId: scItemId,
      });

      // eslint-disable-next-line
      console.log('getScItem res data', res.data);

      // * Commit mutations from res3.data (which is scItem)
      const lectureItemType = res.data.type;
      switch (lectureItemType) {
        case 0: { // * 문항
          const question = res.data.questions[0];
          let answer = [];
          if (question.answer.length !== 0) {
            answer = question.answer[0].split(',')
            .map(token => token.trim())
            .filter(token => token.length !== 0);
          }
          let choice = [];
          if (question.choice.length !== 0) {
            choice = question.choice[0].split(',')
            .map(token => token.trim())
            .filter(token => token.length !== 0);
          }
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              type: utils.convertScItemType(lectureItemType),
              id: scItemId,
              fileList: question.files,
              question: {
                id: question.question_id,
                type: question.type,
                answer,
                choice,
                question: question.question,
                difficulty: question.difficulty,
                isOrderingAnswer: question.is_ordering_answer,
                score: question.score,
                inputDescription: question.input_description,
                outputDescription: question.output_description,
                memoryLimit: question.memory_limit,
                timeLimit: question.time_limit,
                sampleInput: question.sample_input,
                sampleOutput: question.sample_output,
                // * order: 이거는 question이 여러개 들어올 때를 가정해서 만들어진거라 패스
                // * showing_order: 위와 같음
                // * timer: 애매해서 일단 뻄
              },
            },
          });
          break;
        }
        case 1: { // * 설문
          const survey = res.data.surveys[0];
          let choice = [];
          if (survey.choice.length !== 0) {
            choice = survey.choice[0].split(',')
            .map(token => token.trim())
            .filter(token => token.length !== 0);
          }
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              type: utils.convertScItemType(lectureItemType),
              id: scItemId,
              fileList: survey.files.map((item) => {
                const tokens = item.client_path.split('/')
                  .map(t => t.trim())
                  .filter(t => t.length !== 0);

                const fileName = tokens.pop();
                return {
                  name: fileName,
                  url: `${baseURL}${item.client_path}`,
                  guid: item.file_guid,
                };
              }),
              survey: {
                id: survey.survey_id,
                type: survey.type,
                comment: survey.comment,
                choice,
                // comment 제외
              },
            },
          });
          break;
        }
        case 2: { // * 강의자료
          const material = res.data.materials[0];
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              type: utils.convertScItemType(lectureItemType),
              id: scItemId,
              fileList: material.files.map((item) => {
                const tokens = item.client_path.split('/')
                  .map(t => t.trim())
                  .filter(t => t.length !== 0);

                const fileName = tokens.pop();
                return {
                  name: fileName,
                  url: `${baseURL}${item.client_path}`,
                  guid: item.file_guid,
                };
              }),
              material: {
                id: material.material_id,
                // score ?머 하는거임 이거?
                // comment ? 얘도 머임?
              },
            },
          });
          break;
        }
        case 3: { // * 숙제
          const homework = res.data.homework[0];
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              type: utils.convertScItemType(lectureItemType),
              id: scItemId,
              fileList: homework.files.map((item) => {
                const tokens = item.client_path.split('/')
                  .map(t => t.trim())
                  .filter(t => t.length !== 0);

                const fileName = tokens.pop();
                return {
                  name: fileName,
                  url: `${baseURL}${item.client_path}`,
                  guid: item.file_guid,
                };
              }),
              homework: {
                id: homework.homework_id,
              },
            },
          });
          break;
        }
        default: {
          throw new Error(`not defined lectureItemType2 ${lectureItemType}`);
        }
      }
    },
    /**
     * @param {string 문항|설문|강의자료|숙제} scItemType
     */
    async postScItem({ state }, { scItemType }) {
      const lectureItemType = utils.convertScItemType(scItemType);
      if (lectureItemType instanceof Error) {
        throw lectureItemType;
      }
      const res1 = await lectureItemService.postLectureItem({
        lectureId: state.scId,
        lectureItemType,
      });
      const scItemId = res1.data.lecture_item_id;
      // * Post question || survey || homework || material
      switch (lectureItemType) {
        case 0: { // * 문항
          await questionService.postQuestion({
            lectureItemId: scItemId,
          });
          break;
        }
        case 1: { // * 설문
          await surveyService.postSurvey({
            lectureItemId: scItemId,
          });
          break;
        }
        case 2: { // * 강의자료
          await materialService.postMaterial({
            lectureItemId: scItemId,
          });
          break;
        }
        case 3: { // * 숙제
          await homeworkService.postHomework({
            lectureItemId: scItemId,
          });
          break;
        }
        default: {
          throw new Error(`not defined lectureItemType1 ${lectureItemType}`);
        }
      }
      return scItemId;
    },
    async putScItem({ getters }) {
      const scItem = getters.currentEditingScItem;
      // console.log('putScItem scItem', scItem);
      await lectureItemService.putLectureItem({
        lectureItemId: getters.currentEditingScItem.id,
        name: scItem.title,
        description: scItem.description,
        startTime: scItem.activeStartOffsetSec,
        endTime: scItem.activeEndOffsetSec,
        order: scItem.order,
        result: utils.convertBoolean(scItem.isResultVisible),
      });
    },
    async deleteScItem({ state }, { scItemIndex }) {
      const scItem = state.sc[scItemIndex];
      // console.log(scItem);
      await lectureItemService.deleteLectureItem({
        lectureItemId: scItem.id,
      });
    },
    async putQuestion({ getters }) {
      const q = getters.currentEditingScItem.question;
      await questionService.putQuestion({
        questionId: q.id,
        question: q.question,
        choice: q.choice,
        answer: q.answer,
        isOrderingAnswer: q.isOrderingAnswer,
        score: q.score,
        difficulty: q.difficulty,
        // timer는 건너 뛰고
        inputDescription: q.inputDescription,
        outputDescription: q.outputDescription,
        sampleInput: q.sampleInput,
        sampleOutput: q.sampleOutput,
        memoryLimit: q.memoryLimit,
        timeLimit: q.timeLimit,
      });
    },
    async putQuestionType({ getters }) {
      const q = getters.currentEditingScItem.question;
      await questionService.putQuestionType({
        questionId: q.id,
        type: q.type,
      });
    },
    async deleteFile(__empty__, { fileGuid }) {
      await fileService.deleteFile({
        fileGuid,
      });
    },
    async postFile({ commit, getters }, { file }) {
      let res;
      switch (getters.currentEditingScItem.type) {
        case '강의자료': {
          res = await materialService.postMaterialFile({
            file,
            materialId: getters.currentEditingScItem.material.id,
          });
          break;
        }
        case '설문': {
          res = await surveyService.postSurveyFile({
            file,
            surveyId: getters.currentEditingScItem.survey.id,
          });
          break;
        }
        case '문항': {
          res = await questionService.postQuestionFile({
            file,
            questionId: getters.currentEditingScItem.question.id,
          });
          break;
        }
        case '숙제': {
          res = await homeworkService.postHomeworkFile({
            file,
            homeworkId: getters.currentEditingScItem.homework.id,
          });
          break;
        }
        default: {
          throw new Error(`not defined scItemType ${getters.currentEditingScItem.type}`);
        }
      }
      const newFileList = getters.currentEditingScItem.fileList;
      const tokens = res.data.file.client_path.split('/')
        .map(t => t.trim())
        .filter(t => t.length !== 0);
      const fileName = tokens.pop();
      newFileList.push({
        name: fileName,
        url: `${baseURL}${res.data.file.client_path}`,
        status: 'success',
        uid: file.uid,
        guid: res.data.file.file_guid,
      });
      commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          fileList: newFileList,
        },
      });
      // console.log('teacherStore action postMaterialFile', res);
    },
    async putSurvey({ getters }) {
      const s = getters.currentEditingScItem.survey;
      await surveyService.putSurvey({
        surveyId: s.id,
        comment: s.comment,
        choice: s.choice,
        type: s.type,
      });
    },
    async getKnowledgeMapData({ state, commit }) {
      const res1 = await lectureService.getLectureKeywords({
        lectureId: state.scId,
      });
      console.log('res1', res1); // eslint-disable-line
      const nodes = res1.data.map(item => ({
        value: item.keyword,
        id: item.keyword,
        name: item.keyword,
        _size: item.weight,
      }));
      commit('updateNodes', { nodes });
      const res2 = await lectureService.getLectureKeywordRelations({
        lectureId: state.scId,
      });
      console.log('res2', res2); // eslint-disable-line
      if (res2) {
        const edges = res2.data.map(item => ({
          sid: item.node1,
          tid: item.node2,
          weight: item.weight,
        }));
        commit('updateEdges', { edges });
      }
    },
    async postKnowledgeMapData({ state }) {
      const lectureKeywords = state.nodes.map(item => ({
        keyword: item.name,
        weight: Number.parseInt(item._size, 10), // eslint-disable-line
      }));
      console.log('lectureKeywords', lectureKeywords); // eslint-disable-line
      await lectureService.postLectureKeywords({
        lectureId: state.scId,
        lectureKeywords,
      });
      const lectureRelations = state.edges.map(item => ({
        node1: item.sid,
        node2: item.tid,
        weight: item.weight,
      }));
      console.log('lectureRelations', lectureRelations); // eslint-disable-line
      await lectureService.postLectureKeywordRelations({
        lectureId: state.scId,
        lectureRelations,
      });
    },
    // async deleteKnowledgeEdge({ state }, { edgeIndex }) {
    //   await lectureService.deleteLectureKeywordRelation({
    //     lectureId: state.scId,
    //     node:
    //   });
    // },
    async getItemKeywords({ commit, getters }) {
      const item = getters.currentEditingScItem;
      const lectureItemType = utils.convertScItemType(item.type);
      switch (lectureItemType) {
        case 0: {
          const q = item.question;
          const res = await lectureItemService.getQuestionKeywords({
            questionId: q.id,
          });
          const keywords = res.data.map(element => ({
            keyword: element.keyword,
            score: element.score_portion,
          }));
          commit('updateItemKeywords', { keywords });
          break;
        }
        case 2: {
          const m = item.material;
          const res = await lectureItemService.getMaterialKeywords({
            materialId: m.id,
          });
          const keywords = res.data.map(element => ({
            keyword: element.keyword,
            score: element.score_portion,
          }));
          commit('updateItemKeywords', { keywords });
          break;
        }
        default: {
          throw new Error(`not defined type ${item.type}`);
        }
      }
    },
    async postItemKeywords({ getters }, { id }) {
      const item = getters.currentEditingScItem;
      const data = getters.currentEditingScItem.itemKeywords;
      const lectureItemType = utils.convertScItemType(item.type);
      switch (lectureItemType) {
        case 0: {
          await lectureItemService.postQuestionKeywords({
            questionId: id,
            data,
          });
          break;
        }
        case 2: {
          await lectureItemService.postMaterialKeywords({
            materialId: id,
            data,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${item.type}`);
        }
      }
    },
    async deleteItemKeywords({ getters }, { id }) {
      const item = getters.currentEditingScItem;
      const lectureItemType = utils.convertScItemType(item.type);
      switch (lectureItemType) {
        case 0: {
          await lectureItemService.deleteQuestionKeywords({
            questionId: id,
          });
          break;
        }
        case 2: {
          await lectureItemService.deleteMaterialKeywords({
            materialId: id,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${item.type}`);
        }
      }
    },
  },
};
