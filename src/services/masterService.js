// import axios from 'axios';
// import config from './config';
import http from './http';
import utils from '../utils';

export default {
  
/*getClassLists() {
    return http.get('/classes');
  },
  getMainClassLists() { // TODO : 필요 없다면 삭제할 것.
    return http.get('/main_classes');
  },
  getMyClassList() { //
    return http.get('/classes/my');
  },*/
  /*수정할 대학 정보 조회*/
    getMasterUni({name}) {
    return http.get(`/university?name=${name}`);
  },
/*  getClassCoverage({ id }) {
    return http.get(`/classes/${id}/coverage`);
  },
  getClassNeedScoring({ id }) {
    return http.get(`/classes/${id}/need-scoring`);
  },
  getClassTotalResult({ id }) {
    return http.get(`/classes/${id}/total-result`);
  },
  NNgetClassTotalResult({ id, classId }) {
    return http.get(`/classes/${id}/${classId}/total-result`);
  },
  getClassStudentResult({ id }) {
    return http.get(`/classes/${id}/student-result`);
  },
  getClassKeywordRelations({ id }) {
    return http.get(`/classes/${id}/keyword-relations`);
  },
  */
  /*대학 정보 모두 불러오기*/
  getUniLists() {
    return http.get(`/university/list`);
  },

  /*학과 등에서 선택하기위한 대학 이름 리스트 불러오기*/
  getUniNameLists() {
    return http.get(`/university/namelist`);
  },

  /*학과 정보 모두 불러오기*/
  // getDeptLists({name}) {
  getDeptLists(name) {
    return http.get(`/department/list?university_name=${name}`)
  },

  /*수정할 학과 정보 조회*/
  getMasterDept({university_name , name}) {
    return http.get(`/department?university_name=${university_name}&name=${name}`, /*{
      name : uniname,
      name : name,
    }*/);
  },

  /*강사 정보 조회*/
  getTeacherLists(university_name,department_name) {
    return http.get(`/admin_user?type=${type}`)

  },
  /*postClass({ 
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
    lecturerDescription,
    description,
  }) {
    return http.post('/classes', {
      name: title,
      opened,
      summary,
      start_time: activeStartDate,
      end_time: activeEndDate,
      capacity,
      lecturer_description: lecturerDescription,
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
    lecturerDescription,
    description,
  }) {
    return http.put(`/classes/${id}`, {
      name: title,
      opened,
      summary,
      start_time: activeStartDate,
      end_time: activeEndDate,
      capacity,
      lecturer_description: lecturerDescription,
      description,
    });
  },
  postTeacher({
    id,
    teacherEmail,
  }) {
    return http.post(`/classes/${id}/teacher/${teacherEmail}`, {});
  },
  deleteTeacher({
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
  regradeQuestion({
    questionId,
  }) {
    return http.get(`/student_lecture_logs/re/${questionId}`);
  },*/

// 행정 관리자 methods
  NNMasterputUni({
    code,
    name,
    address,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    /*return http.put(`/university/${code}`, {*/
    return http.put(`/university?name=${name}`, {
      code,
      name,
      address,
      manager_name,
      manager_email,
      manager_phone_number,
    });
  },
  NNMasterpostUni({
    code,
    name,
    address,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.post('/university', {
      code,
      name,
      address,
      manager_name,
      manager_email,
      manager_phone_number,
    });
    return {
      success: true,
    };
  },
  delete({
    name,
  }) {
    console.log('@@@name = ', name);
    return http.delete(`/university?name=${name}`,{
    /*return http.delete(`/university`,{*/
    });
  },
  NNMasterputDept({
    uniNameList,
    code,
    name,
    part,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.put(`/department`, {
      university_name: uniNameList,
      code,
      name,
      part,
      manager_name,
      manager_email,
      manager_phone_number,
    });
  },
  NNMasterpostDept({
    uniNameList,
    code,
    name,
    part,
    manager,
    email,
    phone,
  }) {
    return http.post(`/department`,{
      university_name : uniNameList,
      code,
      name,
      part,
      manager_name: manager,
      manager_email: email,
      manager_phone_number: phone,     
    });
  },
  deptDelete({
    university_name,
    name,
  }) {
    console.log('##university_name###',university_name);
    console.log('@@@name = ', name);
    return http.delete(`/department?name=${name}&university_name=${university_name}`,{
    /*return http.delete(`/university`,{*/
    });
  },
  NNMasterputTeacher({
    email,
    password,
    passwordConfirm,
    name,
    sex,
    career,
    birth,
    choiceUni,
    choiceDept,
    address,
    phone,
    account,
    bank,
  }) {
    return http.put(`view/teacher`,{
      email,
      password,
      passwordConfirm,
      name,
      sex,
      career,
      birth,
      choiceUni,
      choiceDept,
      address,
      phone,
      account,
      bank,
    });
  },
  NNMasterpostTeacher({
    university_name,
    department_name,
    email_id,
    password,
    name,
    type,
    birth,
    sex,
    address,
    phone,
    major,
    career,
    account_bank,
    account_number,
  }) {
    return http.post(`/admin_user`,{
      university_name,
      department_name,
      email_id,
      password,
      name,
      type,
      birth,
      sex,
      address,
      phone,
      major,
      career,
      account_bank,
      account_number,
    })
  },
  NNMasterputClass({
    choiceUni,
    choiceDept,
    choiceTeacher,
    code,
    frequency,
    name,
    time,
    classRoom,
    activeStartDate,
    activeEndDate,
    capacity,
    lecturerDescription,
    description,
  }) {
    return http.put(`/view/class`,{
      choiceUni,
      choiceDept,
      choiceTeacher,
      code,
      frequency,
      name,
      time,
      classRoom,
      activeStartDate,
      activeEndDate,
      capacity,
      lecturerDescription,
      description,
    })
  },
  NNMasterpostClass({
    choiceUni,
    choiceDept,
    choiceTeacher,
    code,
    frequency,
    name,
    time,
    classRoom,
    activeStartDate,
    activeEndDate,
    capacity,
    lecturerDescription,
    description,
  }) {
    return {
      success:true,
    };
  },
  NNMasterputStudent({
    email,
    password,
    passwordConfirm,
    name,
    sex,
    birth,
    choiceUni,
    choiceDept,
    address,
    phone,
    account,
    bank,
  }) {
    return http.put(`view/student`,{
      email,
      password,
      passwordConfirm,
      name,
      sex,
      birth,
      choiceUni,
      choiceDept,
      address,
      phone,
      account,
      bank,
    });
  },
  NNMasterpostStudent({
    email,
    password,
    passwordConfirm,
    name,
    sex,
    birth,
    choiceUni,
    choiceDept,
    address,
    phone,
    account,
    bank,
  }) {
    return {
      success: true,
    };
  },
  NNMasterputBank({
    code,
    name,
    capacity,
    choiceTeacher,
  }) {
    return (http.put(`view/bank`), {
      code,
      name,
      capacity,
      choiceTeacher,
    });
  },
  NNMasterpostBank({
    code,
    name,
    capacity,
    choiceTeacher,
  }) {
    return {
      success: true,
    };
  },


};

