import http from './http';


/**
 * service 관련 documentation은 구글 스프레드 시트를 참조하는게 빠름!
 */
export default {
  getClassLogAnalysis({
                         userId, classId, isStudent,
                       }) {
    return http.get(`/journalings/student_class_logs/${userId}/${classId}/${isStudent}`);
  },
  getLectureLogAnalysis({
                   userId, lectureId, isStudent,
                 }) {
    return http.get(`/journalings/${userId}/${lectureId}/${isStudent}`);
  },
};
