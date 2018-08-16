// import axios from 'axios';
// import config from './config';
import http from './http';
import utils from '../utils';

export default {
  getClassLists() {
    return http.get('/classes');
  },
  getMainClassLists() { // TODO : 필요 없다면 삭제할 것.
    return http.get('/main_classes');
  },
  getMyClassList() { //
    return http.get('/classes/my');
  },
  getClass({ id }) { //
    return http.get(`/classes/${id}`);
  },
  getClassCoverage({ id }) {
    return http.get(`/classes/${id}/coverage`);
  },
  getClassNeedScoring({ id }) {
    return http.get(`/classes/${id}/need-scoring`);
  },
  getClassTotalResult({ id }) {
    return http.get(`/classes/${id}/total-result`);
  },
  getClassStudentResult({ id }) {
    return http.get(`/classes/${id}/student-result`);
  },
  getClassKeywordRelations({ id }) {
    return http.get(`/classes/${id}/keyword-relations`);
  },
  postClass({ //
    title,
    description,
    intendedLectureNum,
    activeStartDate,
    activeEndDate,
    teacherEmailList,
  }) {
    return http.post('/classes', {
      name: title,
      description,
      intendedLectureNum,
      start_time: activeStartDate,
      end_time: activeEndDate,
      teachers: teacherEmailList ? teacherEmailList : [], // eslint-disable-line
    });
  },
  NNpostClass({
    title,
    opened,
    summary,
    activeStartDate,
    activeEndDate,
    capacity,
    teacherDescription,
    description,
  }) {
    return http.post('/classes', {
      name: title,
      opened,
      summary,
      start_time: activeStartDate,
      end_time: activeEndDate,
      capacity,
      teacherDescription,
      description,
      teachers: [], // 현재 프론트에서는 공동 강사 입력 없음 23 May 2018
    });
  },
  putClass({
    name,
    description,
    intendedLectureNum,
    activeStartDate,
    activeEndDate,
    opened,
    id,
  }) {
    const param = {};
    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    utils.assignIfNotNil(param, { intendedLectureNum });
    utils.assignIfNotNil(param, { start_time: activeStartDate });
    Object.assign(param, { end_time: activeEndDate });
    utils.assignIfNotNil(param, { opened });
    return http.put(`/classes/${id}`, param);
  },
  NNputClass({
    id,
    title,
    opened,
    summary,
    activeStartDate,
    activeEndDate,
    capacity,
    teacherDescription,
    description,
  }) {
    return http.put(`/classes/${id}`, {
      name: title,
      opened,
      summary,
      start_time: activeStartDate,
      end_time: activeEndDate,
      capacity,
      teacherDescription,
      description,
    });
  },
  postTeacher({
    id,
    teacherEmail,
  }) {
    return http.post(`/classes/${id}/teacher/${teacherEmail}`, {});
  },
  deleteTeacer({
    id,
    teacherEmail,
  }) {
    return http.delete(`/classes/${id}/teacher/${teacherEmail}`);
  },
  putScore({ id, score }) {
    const param = {};
    utils.assignIfNotNil(param, { score });
    return http.put(`/student/answer/${id}`, param);
  },
  putHomeworkFeedback({ id, feedback }) {
    const param = {};
    utils.assignIfNotNil(param, { feedback });
    return http.put(`/student/homework/${id}`, param);
  },
  delete({
    id,
  }) {
    return http.delete(`/classes/${id}`);
  },
  postClassUser({
    id,
  }) {
    return http.post(`/classes/${id}/user`);
  },
  deleteClassUser({
    classId,
    userId,
  }) {
    return http.delete(`/classes/${classId}/user/${userId}`);
  },
};
