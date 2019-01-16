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
  getDeptLists({name}) {
//   getDeptLists(name) {
    return http.get(`/department/list?university_name=${name}`)
  },

  /*수정할 학과 정보 조회*/
  getMasterDept({university_name , name}) {
    return http.get(`/department?university_name=${university_name}&name=${name}`, /*{
      name : uniname,
      name : name,
    }*/);
  },

  /*강사,학생 정보 조회*/
  getUserLists_b(type,university_name,department_name) {
    return http.get(`/admin_user/list?type=${type}&university_name=${university_name}&department_name=${department_name}`)
  },

  getUserLists(type,university_name,department_name) {
    return http.get('/admin_user/list', {
      params: {
        type,
        university_name,
        department_name,
      },
    })
  },

  /*수정할 강사,학생 정보 조회*/
  getMasterUser({email_id}){
    return http.get(`/admin_user?email_id=${email_id}`)
  },

  /*과목 목록 조회*/
  getClassLists({university_name,department_name,end_date_from,end_date_to}){
    // return http.get(`/admin_class/list?university_name=${university_name}&department_name=${department_name}&end_date_from=${end_date_from}&end_date_to=${end_date_to}`)
    console.log('university_name==',university_name,'department_name==',department_name,'end_date_from==',end_date_from,'end_date_to==',end_date_to);
    return http.get('/admin_class/list', {
      params: {
        university_name,
        department_name,
        end_date_from,
        end_date_to,
      },
    })
  },

  /*수정할 과목 조회*/
  getMasterClass({class_id}){
    return http.get(`/admin_class?class_id=${class_id}`)
  },

  /*강의은행 목록 조회*/
  getBankLists({university_name,department_name}){
    console.log('university_name==',university_name);
    console.log('department_name==',department_name);
    // return http.get(`/admin_bank/list?university_name=${university_name}&department_name=${department_name}`)
    return http.get('/admin_bank/list', {
      params: {
        university_name,
        department_name,
      },
    })
  },
/*수정할 강의은행 조회*/
  getMasterBank({group_id}){
    return http.get(`/admin_bank?group_id=${group_id}`)
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
    old_name,
    name,
    address,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
//    console.log('old_name',old_name,'new_name',name);
    return http.put(`/university?name=${name}`, {
      code,
      old_name,
      new_name : name,
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
    old_name,
    name,
    part,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.put(`/department`, {
      university_name: uniNameList,
      code,
      old_name,
      new_name : name,
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
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.post(`/department`,{
      university_name : uniNameList,
      code,
      name,
      part,
      manager_name,
      manager_email,
      manager_phone_number,     
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
    return http.put(`/admin_user`,{
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
  deleteUser({
    email_id,
  }) {
    console.log('email_id======',email_id);
    return http.delete(`/admin_user?email_id=${email_id}`,{
    });
  },
  NNMasterputClass({
    class_id,
    name,
    isActive,
    university_name,
    department_name,
    teacher_email_id,
    code,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    location,
    day_of_week,  
    capacity,
  }) {
    return http.put(`/admin_class`,{
      class_id,
      name,
      isActive,
      university_name,
      department_name,
      teacher_email_id,
      code,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      day_of_week,  
      capacity,
    })
  },
  NNMasterpostClass({
    university_name,
    department_name,
    teacher_email_id,
    code,
    day_of_week,
    name,
    isActive,
    start_time,
    end_time,
    location,
    start_date,
    end_date,
    capacity,
    description,
  }) {
    return http.post(`/admin_class`,{
      university_name,
      department_name,
      teacher_email_id,
      code,
      day_of_week,
      name,
      isActive,
      start_time,
      end_time,
      location,
      start_date,
      end_date,
      capacity,
      description,
    });
  },
  NNMasterputStudent({
    email_id,
    password,
    name,
    sex,
    birth,
    university_name,
    department_name,
    address,
    phone,
    account_bank,
    account_number,
  }) {
    return http.put(`/admin_user`,{
      email_id,
      password,
      name,
      sex,
      birth,
      university_name,
      department_name,
      address,
      phone,
      account_bank,
      account_number,
    });
  },
  classDelete({
    class_id,
  }) {
    return http.delete(`/admin_class?class_id=${class_id}`,{
    });
  },
  NNMasterpostStudent({
    university_name,
    department_name,
    email_id,
    password,
    name,
    type,
    sex,
    birth,
    address,
    phone,
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
      sex,
      birth,
      address,
      phone,
      account_bank,
      account_number,
    });
  },
  NNMasterputBank({
    group_id,
    university_name,
    department_name,
    new_name,
    email_id_list,
  }) {
    console.log(group_id,university_name,department_name,new_name,email_id_list);
    return http.put(`/admin_bank`, {
      group_id,
      university_name,
      department_name,
      new_name,
      email_id_list,
    });
  },
  NNMasterpostBank({
    university_name,
    department_name,
    name,
    email_id_list,
  }) {
    console.log(university_name,department_name,name,email_id_list);
    return http.post(`/admin_bank`,{
      university_name,
      department_name,
      name,
      email_id_list,
    }); 
  },
  bankDelete({
    group_id
  }){
    return http.delete(`/admin_bank?group_id=${group_id}`,{     
    });
  },


};

