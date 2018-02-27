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
    studyingClassList: [],
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
  },
  getters: {
    isTeachingClassListEmpty(state) {
      return state.teachingClassList.length === 0;
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
    currentClass(state) {
      const index = state.currentClassIndex;
      if (index === null) {
        return null;
      }
      return state.teachingClassList[index];
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
  },
  actions: {
    async getMyClassLists({ commit }) {
      const res = await classService.getMyClassList();

      const sc = res.data.studyingClasses;
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
        name: getters.currentClass.name,
        description: getters.currentClass.description,
        activeStartDate: getters.currentClass.start_time,
        activeEndDate: getters.currentClass.end_time,
        opened: getters.currentClass.opened,
        id: getters.currentClass.class_id,
      });
    },
    async getClass({ state, getters, commit }) {
      if (state.currentClassIndex === null) {
        return;
      }
      const currentClass = getters.currentClass;
      const res = await classService.getClass({
        id: currentClass.class_id,
      });
      commit('assignCurrentClass', {
        currentClass: {
          scenarioList: res.data.lectures,
        },
      });
    },
    async deleteClass({ getters, commit }) {
      const currentClass = getters.currentClass;
      await classService.delete({
        id: currentClass.class_id,
      });
      commit('updateCurrentClassIndex', {
        currentClassIndex: null,
      });
    },
  },
};
