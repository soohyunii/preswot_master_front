import lectureItemService from '../services/lectureItemService';
import fileService from '../services/fileService';
import questionService from '../services/questionService';
import materialService from '../services/materialService';
import surveyService from '../services/surveyService';
import homeworkService from '../services/homeworkService';
import studentService from '../services/studentService';
import practiceService from '../services/practiceService';
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
  },
  mutations: {
    updateItemScore(state, { score }) {
      if (state.sc[state.currentEditingScItemIndex].type === '문항') {
        state.sc[state.currentEditingScItemIndex].question.score = score;
      } else if (state.sc[state.currentEditingScItemIndex].type === '강의자료') {
        state.sc[state.currentEditingScItemIndex].material.score = score;
      }
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
    pushScItem(state, { type, id, order }) {
      const title = null;
      // const order = 0; // 예습 = 0 / 본강의 = 1 / 복습 = 2
      // order 받아오는 형식으로 바꿈, orderFilter에 따라 다른곳에 들어가게!
      const description = null;
      const activeStartOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 활성화되냐
      const activeEndOffsetSec = null; // 강의 활성화 시각 기준으로 몇초 뒤에 비활성화되냐
      const isResultVisible = true; // 설문이나 문항을 풀고 나서 수강생중 몇퍼가 1번 선택했고.. 뭐 그런게 결과인데, 결과가 보이냐 마냐
      // isResultVisible이 서버에서는 result라는 변수에 0 1로 저장됨
      const fileList = [];
      const opened = 0; // 임시활성화 됨 1 / 아님 0
      const survey = {};
      const question = {};
      const homework = {};
      const practice = {};
      const discussion = [];
      const result = {}; // 얘는 서버에 있는 것 기준으로 question, survey, homework 안에 학생이 제출한 걸로 저장됨
      const itemKeywords = [];
      const isSubmitted = false; // 문항이나 설문이 제출되었는지 아닌지
      const submitted = [];
      const scItem = {
        id,
        title,
        type,
        order,
        activeStartOffsetSec,
        activeEndOffsetSec,
        isResultVisible,
        description,
        opened,
        fileList,
        survey,
        question,
        homework,
        practice,
        discussion,
        itemKeywords,
        result,
        isSubmitted,
        submitted,
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
      const scItem = res.data;
      // * Commit mutations from res.data (which is scItem)
      switch (scItem.type) {
        case 0: { // * 문항
          const question = scItem.questions[0];
          let answer = [];
          if (question.answer.length !== 0) {
            answer = question.answer
            .map(token => token.trim())
            .filter(token => token.length !== 0);
          }
          let choice = [];
          if (question.choice.length !== 0) {
            choice = question.choice
            .map(token => token.trim())
            .filter(token => token.length !== 0);
          }
          const SQLiteFile = question.sql_lite_file ? question.sql_lite_file.map(item => ({
            name: item.name,
            url: `${baseUrl}${item.client_path}`,
            guid: item.file_guid,
          })) : [];
          const previousSqliteFiles = (await fileService.previousSqliteFile({ })).data.files;
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              fileList: question.files.map(item => ({
                name: item.name,
                url: `${baseUrl}${item.client_path}`,
                guid: item.file_guid,
              })),
              result: null, // 이건 scItemStore.action.getScItemResult() 로 불러온다
              isSubmitted: question.student_answer_logs.length !== 0, // 설문, 문항, 숙제가 제출되었는지
              submitted: question.student_answer_logs,
              SQLiteFile,
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
                previousSqliteFiles,
                // * order: 이거는 question이 여러개 들어올 때를 가정해서 만들어진거라 패스
                // * showing_order: 위와 같음
                // * timer: 애매해서 일단 뻄
              },
            },
          });
          break;
        }
        case 1: { // * 설문
          const survey = scItem.surveys[0];
          let choice = [];
          if (survey.choice.length !== 0) {
            choice = survey.choice
              .map(token => token.trim())
              .filter(token => token.length !== 0);
          }
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              result: null, // 이건 scItemStore.action.getScItemResult() 로 불러온다
              isSubmitted: survey.student_surveys.length !== 0, // 설문, 문항, 숙제가 제출되었는지
              submitted: survey.student_surveys,
              fileList: survey.files.map(item => ({
                name: item.name,
                url: `${baseUrl}${item.client_path}`,
                guid: item.file_guid,
              })),
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
          const material = scItem.materials[0];
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              fileList: material.files.map(item => ({
                name: item.name,
                url: `${baseUrl}${item.client_path}`,
                guid: item.file_guid,
              })),
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
          const homework = scItem.homework[0];
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              result: null, // 이건 scItemStore.action.getScItemResult() 로 불러온다
              isSubmitted: homework.student_homeworks.length !== 0, // 설문, 문항, 숙제가 제출되었는지
              submitted: homework.student_homeworks,
              fileList: homework.files.map(item => ({
                name: item.name,
                url: `${baseUrl}${item.client_path}`,
                guid: item.file_guid,
              })),
              homework: {
                id: homework.homework_id,
              },
            },
          });
          break;
        }
        case 4: { // * 실습
          const practice = scItem.lecture_code_practices[0];
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              result: null, // 이건 scItemStore.action.getScItemResult() 로 불러온다
              isSubmitted: 0,
              submitted: [],
              practice: {
                id: practice.lecture_code_practice_id,
                code: practice.code,
              },
            },
          });
          break;
        }
        case 5: {  // * 토론
          const discussion = scItem.discussions;
          commit('assignCurrentEditingScItem', {
            currentEditingScItem: {
              id: scItemId,
              title: scItem.name,
              description: scItem.description,
              activeStartOffsetSec: scItem.start_time,
              activeEndOffsetSec: scItem.end_time,
              isResultVisible: scItem.result === 1,
              opened: scItem.opened,
              order: scItem.order,
              type: utils.convertScItemType(scItem.type),
              result: null, // 이건 scItemStore.action.getScItemResult() 로 불러온다
              isSubmitted: 0,
              submitted: [],
              discussion,
            },
          });
          break;
        }
        default: {
          throw new Error(`not defined scItem.type2 ${scItem.type}`);
        }
      }
    },
    /**
     * @param {string 문항|설문|강의자료|숙제} scItemType
     */
    async postScItem({ rootState }, { scItemType, scItemOrder }) {
      const lectureItemType = utils.convertScItemType(scItemType);
      if (lectureItemType instanceof Error) {
        throw lectureItemType;
      }
      const res1 = await lectureItemService.postLectureItem({
        lectureId: rootState.sc.scId,
        lectureItemType,
        lectureItemOrder: scItemOrder,
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
        case 4: { // * 실습
          await practiceService.postPractice({
            lectureItemId: scItemId,
          });
          break;
        }
        case 5: { // * 토론
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
        result: scItem.isResultVisible ? 1 : 0,
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
    async getScItemResult({ getters, commit }) {
      const { type } = getters.currentEditingScItem;
      let res = {}; // undefined이면 자주 터지니까 그거 막으려고
      switch (type) {
        case '문항': {
          res = await questionService.getQuestionResult({
            questionId: getters.currentEditingScItem.question.id,
          });
          break;
        }
        case '설문': {
          res = await surveyService.getSurveyResult({
            surveyId: getters.currentEditingScItem.survey.id,
          });
          break;
        }
        case '숙제': {
          res = await homeworkService.getHomeworkResult({
            homeworkId: getters.currentEditingScItem.homework.id,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
      commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          result: res.data,
        },
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
    async deleteFileSqlite(__empty__, { fileGuid, questionId }) {
      await fileService.deleteFileSqlite({
        fileGuid, questionId,
      });
    },
    async selectPreviousSqlite({ commit, getters }, { guid, questionId }) {
      await questionService.selectPreviousSqlite({
        guid, questionId,
      });
    },
    async postFile({ commit, getters }, { file, SQLite }) {
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
          if (SQLite) {
            res = await questionService.postQuestionSQLiteFile({
              file,
              questionId: getters.currentEditingScItem.question.id,
            });
          } else {
            res = await questionService.postQuestionFile({
              file,
              questionId: getters.currentEditingScItem.question.id,
            });
          }
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
      if (SQLite) {
        const SQLiteFile = getters.currentEditingScItem.SQLiteFile;
        SQLiteFile.push({
          name: res.data.sqlLiteFile.name,
          url: `${baseUrl}${res.data.sqlLiteFile.client_path}`,
          status: 'success',
          uid: file.uid,
          guid: res.data.sqlLiteFile.file_guid,
        });
        commit('assignCurrentEditingScItem', {
          currentEditingScItem: {
            SQLiteFile,
          },
        });
        return;
      }
      const newFileList = getters.currentEditingScItem.fileList;
      newFileList.push({
        name: res.data.file.name,
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
    async putPractice({ getters }) {
      const p = getters.currentEditingScItem.practice;
      await practiceService.putPractice({
        practiceId: p.id,
        code: p.code,
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
    setDeactivated(state) {
      state.commit('assignCurrentEditingScItem', {
        currentEditingScItem: {
          opened: 0,
        },
      });
    },
    async submitQuestion({ getters }, {
      id,
      answers,
      interval,
      codeLanguage,
    }) {
      await studentService.submitQuestion({
        questionId: id,
        answers,
        interval,
        codeLanguage,
      });
    },
    async submitSurvey({ getters }, { id, answer }) {
      await studentService.submitSurvey({
        surveyId: id,
        answer,
      });
    },
    async scoringFinish(_, { lectureItemId }) {
      await lectureItemService.scoringFinish({
        lectureItemId,
      });
    },
  },
};
