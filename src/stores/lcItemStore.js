// import lectureItemService from '../services/lectureItemService';
// import fileService from '../services/fileService';
// import questionService from '../services/questionService';
// import materialService from '../services/materialService';
// import surveyService from '../services/surveyService';
// import homeworkService from '../services/homeworkService';
// import studentService from '../services/studentService';
// import practiceService from '../services/practiceService';
// import discussionService from '../services/discussionService';
// import { baseUrl } from '../services/config';

import utils from '../utils';

import QuestionHandler from '../handlers/lcItem/question';
import lectureItemService from '../services/lectureItemService';
import SurveyHandler from '../handlers/lcItem/survey';
import DiscussionHandler from '../handlers/lcItem/discussion';
import PracticeHandler from '../handlers/lcItem/practice';
import NoteHandler from '../handlers/lcItem/note';

export default {
  namespaced: true,
  state: {
    /**
     * state.currentEditingLectureItemId가 state.lectureItem에 있는데도 중복으로 가지는 이유는
     * lectureItem을 서버에서 받아오려면 currentEditingLectureItemId가 있어야하고,
     * 그 Id는 lcStore에서 가지고 있기 떄문~
     * lectureItem은 서버로부터 받아온 값을 그냥 들고만 있는 애라고 생각하자,
     * 브라우저의 form에서 일어나는 모든 변경사항을 여기에 반영하지 말자. 너무 복잡해짐
     */
    currentEditingLectureItemId: null, // -1인 경우는 edit이 아니라 create
    lectureItem: null,
  },
  getters: {
    isEditing(state) {
      return !!state.currentEditingLectureItemId;
    },
    isNewItem(state) {
      return state.currentEditingLectureItemId === -1;
    },
  },
  mutations: {
    updateCurrentEditingLectureItemId(state, { currentEditingLectureItemId }) {
      state.currentEditingLectureItemId = currentEditingLectureItemId;
    },
    updateLectureItem(state, { lectureItem }) {
      state.lectureItem = lectureItem;
    },
  },
  actions: {
    async getLcItem({ state, commit }) {
      const res = await lectureItemService.getLectureItem({
        lectureItemId: state.currentEditingLectureItemId,
      });
      commit('updateLectureItem', {
        lectureItem: res.data,
      });
    },
    async postLcItem({ rootState }, { inputHead, inputBody, inputTail }) {
      // console.log('lcItemType', inputHead);

      const lcItemType = utils.convertLcItemType(inputHead.lcItemType);
      switch (lcItemType) {
        case 0: { // * 문항
          await QuestionHandler.postLcItem({
            lectureId: rootState.lc.lecture.lecture_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 1: { // * 설문
          await SurveyHandler.postLcItem({
            lectureId: rootState.lc.lecture.lecture_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 2: { // * 실습
          await PracticeHandler.postLcItem({
            lectureId: rootState.lc.lecture.lecture_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 3: { // * 토론
          await DiscussionHandler.postLcItem({
            lectureId: rootState.lc.lecture.lecture_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 4: { // * 자료
          await NoteHandler.postLcItem({
            lectureId: rootState.lc.lecture.lecture_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        default: {
          throw new Error(`not defined lcItemType ${lcItemType}`);
        }
      }
    },
    async putLcItem({ state }, { inputHead, inputBody, inputTail }) {
      const lcItemType = utils.convertLcItemType(inputHead.lcItemType);
      switch (lcItemType) {
        case 0: { // * 문항
          await QuestionHandler.putLcItem({
            lectureItemId: state.currentEditingLectureItemId,
            questionId: state.lectureItem.questions[0].question_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 1: { // * 설문
          await SurveyHandler.putLcItem({
            lectureItemId: state.currentEditingLectureItemId,
            surveyId: state.lectureItem.surveys[0].survey_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 2: { // 실습
          await PracticeHandler.putLcItem({
            lectureItemId: state.currentEditingLectureItemId,
            practiceId: state.lectureItem.lecture_code_practices[0].lecture_code_practice_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 3: { // 토론
          await DiscussionHandler.putLcItem({
            lectureItemId: state.currentEditingLectureItemId,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        case 4: { // 자료
          await NoteHandler.putLcItem({
            lectureItemId: state.currentEditingLectureItemId,
            noteId: state.lectureItem.notes[0].note_id,
            inputHead,
            inputBody,
            inputTail,
          });
          break;
        }
        default: {
          throw new Error(`not defined lcItemType ${lcItemType}`);
        }
      }
    },
  },
};
