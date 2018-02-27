import lectureItemService from '../services/lectureItemService';
import fileService from '../services/fileService';
import questionService from '../services/questionService';
import materialService from '../services/materialService';
import surveyService from '../services/surveyService';
import homeworkService from '../services/homeworkService';
import { baseUrl } from '../services/config';

import utils from '../utils';

export default {
  namespaced: true,
  state: {
    // //////////////////////////절취선////////////////////////// //
    /**
     * TeacherLectureNew / TeacherLectureLive 관련 변수들
     * @var {Array[scItem]} sc: shorthand for Scenario
     * @var {number} currentEditingScItemIndex: 현재 생성/편집 중인 시나리오 아이템 인덱스
     * @var {number} currentTeachingScItemIndex: 강의 중에 현재 진행되고 있는 시나리오 아이템 인덱스
     */
    sc: [],
    currentEditingScItemIndex: null,
    currentTeachingScItemIndex: null,
    // //////////////////////////절취선////////////////////////// //
  },
  getters: {

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

      const {
        orderSortedSc,
        changedCurrentEditingScItemIndex,
      } = utils.sortSc(state.sc, state.currentEditingScItemIndex);
      state.sc = orderSortedSc;
      state.currentEditingScItemIndex = changedCurrentEditingScItemIndex;
      // TODO: save lectureElementSequence using localForage
    },
    assignCurrentEditingScItem(state, { currentEditingScItem }) {
      Object.assign(
        state.sc[state.currentEditingScItemIndex],
        currentEditingScItem,
      );
      const {
        orderSortedSc,
        changedCurrentEditingScItemIndex,
      } = utils.sortSc(state.sc, state.currentEditingScItemIndex);
      state.sc = orderSortedSc;
      state.currentEditingScItemIndex = changedCurrentEditingScItemIndex;
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
    updateSc(state, { sc }) {
      state.sc = sc;
    },
  },
  actions: {
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
                languageList: question.accept_language || [],
                testCaseList: question.problem_testcases || [],
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
                  url: `${baseUrl}${item.client_path}`,
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
                  url: `${baseUrl}${item.client_path}`,
                  guid: item.file_guid,
                };
              }),
              material: {
                id: material.material_id,
                score: material.score,
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
                  url: `${baseUrl}${item.client_path}`,
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
    async postScItem({ rootState }, { scItemType }) {
      const lectureItemType = utils.convertScItemType(scItemType);
      if (lectureItemType instanceof Error) {
        throw lectureItemType;
      }
      const res1 = await lectureItemService.postLectureItem({
        lectureId: rootState.sc.scId,
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
        opened: scItem.opened,
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
        languageList: q.languageList,
      });
    },
    async putQuestionType({ getters }) {
      const q = getters.currentEditingScItem.question;
      await questionService.putQuestionType({
        questionId: q.id,
        type: q.type,
      });
    },
    async postQuestionTestCase({ getters, commit }) {
      const q = getters.currentEditingScItem.question;
      const res = await questionService.postQuestionTestCase({
        questionId: q.id,
      });
      // console.log('postQuestionTestCase res', res);
      const newTestCaseList = q.testCaseList;
      newTestCaseList.push({
        num: res.data.num,
        input: null,
        output: null,
      });
      commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          question: {
            ...q,
            testCaseList: newTestCaseList,
          },
        },
      });
    },
    async putQuestionTestCase({ getters, commit }, { index }) {
      const q = getters.currentEditingScItem.question;
      const tc = q.testCaseList[index];
      await questionService.putQuestionTestCase({
        questionId: q.id,
        num: tc.num,
        input: tc.input,
        output: tc.output,
      });
      // console.log('putQuestionTestCase', res);
    },
    async deleteQuestionTestCase({ getters, commit }, { index }) {
      const q = getters.currentEditingScItem.question;
      const tc = q.testCaseList[index];
      await questionService.deleteQuestionTestCase({
        questionId: q.id,
        num: tc.num,
      });
      const newTestCaseList = q.testCaseList;
      newTestCaseList.splice(index, 1);
      commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          question: {
            ...q,
            testCaseList: newTestCaseList,
          },
        },
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
        url: `${baseUrl}${res.data.file.client_path}`,
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
    async putMaterial({ getters }) {
      const m = getters.currentEditingScItem.material;
      await materialService.putMaterial({
        materialId: m.id,
        score: m.score,
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
    setActivated(state) {
      state.commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          opened: 1,
        },
      });
    },
    setDeActivated(state) {
      state.commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          opened: 0,
        },
      });
    },
  },
};
