// import utils from '../utils';
import reportService from '../services/reportService';
// import analysisService from '../services/analysisService';

export default {
  namespaced: true,
  state: {
    userId: null,
    /*
    * reports 는 각 아이템이 lecture_id로 구분됨. 한 과목에 해당하는 강의의 보고서
    */
    reports: [],
    currentClassId: null,
    currentClassStat: [],
    resultData: [],
    currentClassAttendee: null,
    attendee: [],
    isAttendeeVisable: false,
  },
  getters: {
    sizeOfReports(state) {
      return state.reports.length;
    },
  },
  mutations: {
    updateUserId(state, { userId }) {
      state.userId = userId;
    },
    updateReports(state, { reports }) {
      state.reports = reports;
    },
    updateCurrentClassId(state, { currentClassId }) {
      state.currentClassId = currentClassId;
    },
    updateCurrentClassStat(state, { classStat }) {
      state.currentClassStat = classStat;
    },
    updateResultData(state, { ResultData }) {
      state.resultData = ResultData;
    },
    updateCurrentClassAttendee(state, { currentClassAttendee }) {
      state.currentClassAttendee = currentClassAttendee;
    },
    updateAttendeeVisable(state) {
      if (state.isAttendeeVisable) {
        state.isAttendeeVisable = false;
      } else {
        state.isAttendeeVisable = true;
      }
    },
  },
  actions: {
    async setStudentClassReport({ state, commit }) {
      const res = await reportService.getStudentClassReport({
        userId: state.userId,
        classId: state.currentClassId,
      });
      commit('updateReports', {
        reports: res.data,
      });
    },
    async setClassStat({ state, commit }) {
      const res = await reportService.getClassStat({
        classId: state.currentClassId,
      });
      commit('updateCurrentClassStat', {
        classStat: res.data,
      });
    },
    async setResultData({ state, commit }) {
      // 보고서 테이블 데이터
      const resultData = [];
      // 등급 만들기
      for (let i = 0; i < state.reports.length; i += 1) {
        const tempLectureId = state.currentClassStat[i * 3].lecture_id;
        let tempReport = [];
        tempReport = state.reports[i];
        // 예습데이터 order 0, -1일 경우에 대한 예외처리 포함
        const preNumberOfStudent = state.currentClassStat[i].number_of_student;
        let preGradeParti;
        if (tempReport.pre_rank_participation_score === -1) {
          preGradeParti = '-';
        } else {
          preGradeParti =
        ((tempReport.pre_rank_participation_score / preNumberOfStudent) * 10).toFixed(1);
        }
        let preGradeUnder;
        if (tempReport.pre_rank_understanding_score === -1) {
          preGradeUnder = '-';
        } else {
          preGradeUnder =
        ((tempReport.pre_rank_understanding_score / preNumberOfStudent) * 10).toFixed(1);
        }
        let preGradeCon;
        if (tempReport.pre_rank_concentration_score === -1) {
          preGradeCon = '-';
        } else {
          preGradeCon =
          ((tempReport.pre_rank_concentration_score / preNumberOfStudent) * 10).toFixed(1);
        }
        // 본강데이터 order 1
        const lecNumberOfStudent = state.currentClassStat[i].number_of_student;
        let lecGradeParti;
        if (tempReport.lec_rank_participation_score === -1) {
          lecGradeParti = '-';
        } else {
          lecGradeParti =
        ((tempReport.lec_rank_participation_score / lecNumberOfStudent) * 10).toFixed(1);
        }
        let lecGradeUnder;
        if (tempReport.lec_rank_understanding_score === -1) {
          lecGradeUnder = '-';
        } else {
          lecGradeUnder =
          ((tempReport.lec_rank_understanding_score / lecNumberOfStudent) * 10).toFixed(1);
        }
        let lecGradeCon;
        if (tempReport.lec_rank_concentration_score === -1) {
          lecGradeCon = '-';
        } else {
          lecGradeCon =
        ((tempReport.lec_rank_concentration_score / lecNumberOfStudent) * 10).toFixed(1);
        }
        // 복습데이터 order 2
        const revNumberOfStudent = state.currentClassStat[i].number_of_student;
        let revGradeParti;
        if (tempReport.rev_rank_participation_score === -1) {
          revGradeParti = '-';
        } else {
          revGradeParti =
          ((tempReport.rev_rank_participation_score / revNumberOfStudent) * 10).toFixed(1);
        }
        let revGradeUnder;
        if (tempReport.rev_rank_understanding_score === -1) {
          revGradeUnder = '-';
        } else {
          revGradeUnder =
        ((tempReport.rev_rank_understanding_score / revNumberOfStudent) * 10).toFixed(1);
        }
        let revGradeCon;
        if (tempReport.rev_rank_concentration_score === -1) {
          revGradeCon = '-';
        } else {
          revGradeCon =
        ((tempReport.rev_rank_concentration_score / revNumberOfStudent) * 10).toFixed(1);
        }
        // score -1인 경우에 대한 처리
        if (tempReport.pre_participation_score === -1) {
          tempReport.pre_participation_score = '-';
        }
        if (tempReport.pre_understanding_score === -1) {
          tempReport.pre_understanding_score = '-';
        }
        if (tempReport.pre_concentration_score === -1) {
          tempReport.pre_concentration_score = '-';
        }
        if (tempReport.lec_participation_score === -1) {
          tempReport.lec_participation_score = '-';
        }
        if (tempReport.lec_understanding_score === -1) {
          tempReport.lec_understanding_score = '-';
        }
        if (tempReport.lec_concentration_score === -1) {
          tempReport.lec_concentration_score = '-';
        }
        if (tempReport.rev_participation_score === -1) {
          tempReport.rev_participation_score = '-';
        }
        if (tempReport.rev_understanding_score === -1) {
          tempReport.rev_understanding_score = '-';
        }
        if (tempReport.rev_concentration_score === -1) {
          tempReport.rev_concentration_score = '-';
        }
        resultData.push({
          // 등급
          lecture_id: tempLectureId,
          parti_pre_gra: preGradeParti,
          unders_pre_gra: preGradeUnder,
          concen_pre_gra: preGradeCon,
          parti_rea_gra: lecGradeParti,
          unders_rea_gra: lecGradeUnder,
          concen_rea_gra: lecGradeCon,
          parti_rev_gra: revGradeParti,
          unders_rev_gra: revGradeUnder,
          concen_rev_gra: revGradeCon,
          // 점수
          concen_pre_score: tempReport.pre_concentration_score,
          concen_rea_score: tempReport.lec_concentration_score,
          concen_rev_score: tempReport.rev_concentration_score,
          unders_pre_score: tempReport.pre_understanding_score,
          unders_rea_score: tempReport.lec_understanding_score,
          unders_rev_score: tempReport.rev_understanding_score,
          parti_pre_score: tempReport.pre_participation_score,
          parti_rea_score: tempReport.lec_participation_score,
          parti_rev_score: tempReport.rev_participation_score,
          // 평균
          concen_pre_avg: state.currentClassStat[i * 3].avg_concentration_score,
          concen_rea_avg: state.currentClassStat[(i * 3) + 1].avg_concentration_score,
          concen_rev_avg: state.currentClassStat[(i * 3) + 2] ?
            state.currentClassStat[(i * 3) + 2].avg_concentration_score : 0,
          unders_pre_avg: state.currentClassStat[i * 3].avg_understanding_score,
          unders_rea_avg: state.currentClassStat[(i * 3) + 1].avg_understanding_score,
          unders_rev_avg: state.currentClassStat[(i * 3) + 2] ?
            state.currentClassStat[(i * 3) + 2].avg_understanding_score : 0,
          parti_pre_avg: state.currentClassStat[i * 3].avg_participation_score,
          parti_rea_avg: state.currentClassStat[(i * 3) + 1].avg_participation_score,
          parti_rev_avg: state.currentClassStat[(i * 3) + 2] ?
            state.currentClassStat[(i * 3) + 2].avg_participation_score : 0,
        });
        commit('updateResultData', {
          ResultData: resultData,
        });
      }
    },
    async setCurrentClassAttendee({ state, commit }) {
      const res = await reportService.getClassAttendeeList({
        classId: state.currentClassId,
      });
      commit('updateCurrentClassAttendee', {
        currentClassAttendee: res.data,
      });
    },
    toggleAttendeeVisable({ commit }) {
      commit('updateAttendeeVisable');
    },
  },
};
