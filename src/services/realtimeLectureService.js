import http from './http';


/**
 * service 관련 documentation은 구글 스프레드 시트를 참조하는게 빠름!
 */
export default {
  getStudentLectureLog({
               lectureId, opt,
             }) {
    return http.get(`/student_lecture_logs/get_by_lecture/${lectureId}/${opt}`);
  },
};
