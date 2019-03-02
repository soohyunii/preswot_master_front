import http from './http';

export default {
  getMyGroup() {
    return http.get('/bank/groups');
  },
  getMyClassList() {
    return http.get('/classes/my');
  },
  getLectureInfo({ id }) {
    return http.get(`/lectures/${id}`);
  },
  getClassInfo({ id }) {
    return http.get(`/classes/${id}`);
  },
  getLectureItemKeywords({ id }) {
    return http.get(`/lecture-items/${id}/keywords`);
  },
  getLectureItemByKeyword({ keyArray }) {
    let str = '';
    keyArray.forEach((x) => {
      str = str.concat('keywords=', x, '&');
    });
    const key = str.substr(0, str.length - 1);
    return http.get(`/lecture-items/search?${key}`);
  },
  saveClass({ class_id, group_id }) {
    return http.post('/bank/class', {
      class_id: class_id,  // eslint-disable-line
      group_id: group_id,  // eslint-disable-line
    });
  },
  saveLecture({ lecture_id, group_id }) {
    return http.post('/bank/lecture', {
      lecture_id: lecture_id,  // eslint-disable-line
      group_id: group_id,  // eslint-disable-line
    });
  },
  saveLectureItem({ lecture_item_id, group_id }) {
    return http.post('/bank/lecture-item', {
      lecture_item_id: lecture_item_id,  // eslint-disable-line
      group_id: group_id,  // eslint-disable-line
    });
  },
  bankToClass({ class_id }) {
    return http.post('/bank/to/class', {
      class_id,
    });
  },
  bankToLecture({ lecture_id, target_class_id }) {
    return http.post('/bank/to/lecture', {
      lecture_id: lecture_id,  // eslint-disable-line
      target_class_id: target_class_id,  // eslint-disable-line
    });
  },
  bankToLectureItem({ lecture_item_id, target_lecture_id }) {
    return http.post('/bank/to/lecture-item', {
      lecture_item_id: lecture_item_id,  // eslint-disable-line
      target_lecture_id: target_lecture_id,  // eslint-disable-line
    });
  },
  getBankClass() {
    return http.get('/bank/class');
  },
  getBankLecture() {
    return http.get('/bank/lecture');
  },
  getBankLectureItem({ type }) {
    return http.get(`/bank/lecture-item?type=${type}`);
  },
  getBankClassByName({ name }) {
    return http.get(`/bank/class/search?name=${name}`);
  },
  getBankClassByGroup({ id }) {
    return http.get(`/bank/class/search?groupId=${id}`);
  },
  getBankClassByKeyword({ keyArray }) {
    let str = '';
    keyArray.forEach((x) => {
      str = str.concat(x, ',');
    });
    const key = str.substr(0, str.length - 1);
    return http.get(`/bank/class/search?keywords=${key}`);
  },
  getBankLectureByName({ name }) {
    return http.get(`/bank/lecture/search?name=${name}`);
  },
  getBankLectureByGroup({ id }) {
    return http.get(`/bank/lecture/search?groupId=${id}`);
  },
  getBankLectureByKeyword({ keyArray }) {
    let str = '';
    keyArray.forEach((x) => {
      str = str.concat(x, ',');
    });
    const key = str.substr(0, str.length - 1);
    return http.get(`/bank/lecture/search?keywords=${key}`);
  },
  getBankLectureItemByName({ type, name }) {
    return http.get(`/bank/lecture-item/search?name=${name}&type=${type}`);
  },
  getBankLectureItemByGroup({ type, id }) {
    return http.get(`/bank/lecture-item/search?groupId=${id}&type=${type}`);
  },
  getBankLectureItemByKeyword({ type, keyArray }) {
    let str = '';
    keyArray.forEach((x) => {
      str = str.concat(x, ',');
    });
    const key = str.substr(0, str.length - 1);
    return http.get(`/bank/lecture-item/search?keywords=${key}&type=${type}`);
  },
};
