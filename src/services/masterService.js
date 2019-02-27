/* eslint-disable camelcase */
import http from './http';

export default {
  getMasterUni({ name }) {
    return http.get(`/university?name=${name}`);
  },
  getUniLists({ category, search_word, page }) {
    return http.get('/university/list', {
      params: {
        category,
        search_word,
        page,
      },
    });
  },
  getUniNameLists() {
    return http.get('/university/namelist');
  },
  getDeptLists({ university_name, category, search_word, page }) {
    return http.get('/department/list', {
      params: {
        university_name,
        category,
        search_word,
        page,
      },
    });
  },
  getMasterDept({ university_name, name }) {
    return http.get(`/department?university_name=${university_name}&name=${name}`);
  },
  getUserLists_b(type, university_name, department_name) {
    return http.get(`/admin_user/list?type=${type}&university_name=${university_name}&department_name=${department_name}`);
  },

  getUserLists(type, university_name, department_name) {
    return http.get('/admin_user/list', {
      params: {
        type,
        university_name,
        department_name,
      },
    });
  },

  getMasterUser({ email_id }) {
    return http.get(`/admin_user?email_id=${email_id}`);
  },
  getClassLists({ university_name, department_name, end_date_from, end_date_to, isActive }) {
    return http.get('/admin_class/list', {
      params: {
        university_name,
        department_name,
        end_date_from,
        end_date_to,
        isActive,
      },
    });
  },

  getMasterClass({ class_id }) {
    return http.get(`/admin_class?class_id=${class_id}`);
  },
  getBankLists({ university_name, department_name }) {
    return http.get('/admin_bank/list', {
      params: {
        university_name,
        department_name,
      },
    });
  },
  getMasterBank({ group_id }) {
    return http.get(`/admin_bank?group_id=${group_id}`);
  },
  NNMasterputUni({
    code,
    old_name,
    name,
    address,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.put(`/university?name=${name}`, {
      code,
      old_name,
      new_name: name,
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
  },
  delete({
    name,
  }) {
    return http.delete(`/university?name=${name}`, {
    });
  },
  NNMasterputDept({
    old_university_name,
    uniNameList,
    code,
    old_name,
    name,
    part,
    manager_name,
    manager_email,
    manager_phone_number,
  }) {
    return http.put('/department', {
      old_university_name,
      university_name: uniNameList,
      code,
      old_name,
      new_name: name,
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
    return http.post('/department', {
      university_name: uniNameList,
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
    return http.delete(`/department?name=${name}&university_name=${university_name}`, {
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
    return http.put('/admin_user', {
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
    return http.post('/admin_user', {
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
  deleteUser({
    email_id,
  }) {
    return http.delete(`/admin_user?email_id=${email_id}`, {
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
    return http.put('/admin_class', {
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
    });
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
    return http.post('/admin_class', {
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
    return http.put('/admin_user', {
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
    return http.delete(`/admin_class?class_id=${class_id}`, {
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
    return http.post('/admin_user', {
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
    return http.put('/admin_bank', {
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
    return http.post('/admin_bank', {
      university_name,
      department_name,
      name,
      email_id_list,
    });
  },
  bankDelete({
    group_id,
  }) {
    return http.delete(`/admin_bank?group_id=${group_id}`, {
    });
  },


};

