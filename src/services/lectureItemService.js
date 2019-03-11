import http from './http';
import utils from '../utils';

export default {
  getLectureItem({
    lectureItemId,
  }) {
    return http.get(`/lecture-items/${lectureItemId}`);
  },
  postLectureItem({
    lectureId,
    lectureItemType,
    lectureItemOrder,
  }) {
    return http.post('/lecture-items', {
      lectureId,
      type: lectureItemType,
      order: lectureItemOrder,
    });
  },
  putLectureItem({
    lectureItemId,
    name,
    description,
    startTime,
    endTime,
    order,
    result, // TODO: get from user
    opened, // TODO: get from user? 이건 좀 애매한데
    sequence,
    offset,
  }) {
    const param = {};

    utils.assignIfNotNil(param, { name });
    utils.assignIfNotNil(param, { description });
    // null이면 null 들어가야함.
    Object.assign(param, { start_time: startTime });
    Object.assign(param, { end_time: endTime });
    utils.assignIfNotNil(param, { order });
    utils.assignIfNotNil(param, { result });
    utils.assignIfNotNil(param, { opened });
    utils.assignIfNotNil(param, { sequence });
    utils.assignIfNotNil(param, { offset });
    // TODO: rename prepare_lesson_review
    // Object.assign(param, {
    //   opened: 3, // TODO: 동일이형이랑 얘기하고 지우려면 지우자
    // });
    // console.log('putLectureItem param', param);
    return http.put(`lecture-items/${lectureItemId}`, param);
  },
  deleteLectureItem({
    lectureItemId,
  }) {
    return http.delete(`/lecture-items/${lectureItemId}`);
  },
  getMaterialKeywords({
    materialId,
  }) {
    return http.get(`/materials/${materialId}/keywords`);
  },
  postMaterialKeywords({
    materialId,
    data,
  }) {
    return http.post(`/materials/${materialId}/keywords`, {
      data,
    });
  },
  deleteMaterialKeywords({
    materialId,
  }) {
    return http.delete(`/materials/${materialId}/keywords`);
  },

  scoringFinish({
    lectureItemId,
  }) {
    return http.put(`lecture-items/${lectureItemId}`, { scoring_finish: 1 });
  },

  makeConnection({ lectureId, iList }) {
    const itemList = iList;
    const item_id = itemList[0]; // eslint-disable-line
    const list = [];
    itemList.forEach((x) => {
      const tmp = {};
      tmp.item_id = x;
      list.push(tmp);
    });
    if (list.length === 0) {
      const tmp = {};
      tmp.item_id = '';
      list.push(tmp);
    }
    return http.post(`/lecture-items/${lectureId}/linked_list`, {
      item_id: item_id, // eslint-disable-line
      list: list, // eslint-disable-line
    });
  },
  showConnection({ lectureId }) {
    return http.get(`/lecture-items/${lectureId}/linked_list`);
  },
  deleteConnection({ lectureItemId }) {
    return http.delete(`/lecture-items/linked_list/${lectureItemId}`);
  },
  makeGroupNo({ lectureId, iList }) {
    const itemList = iList;
    let list = itemList[0];
    itemList.splice(0, 1);
    itemList.forEach((x) => {
      list = list + '<$!<>' + x; // eslint-disable-line
    });
    list = list.toString();
    return http.post(`/lecture-items/${lectureId}/group`, {
      list: list, // eslint-disable-line
    });
  },
  editGroupNo({ lectureId, iList, groupId }) {
    const itemList = iList;
    let list = itemList[0];
    itemList.splice(0, 1);
    itemList.forEach((x) => {
      list = list + '<$!<>' + x; // eslint-disable-line
    });
    list = list.toString();
    return http.put(`/lecture-items/${lectureId}/group/${groupId}`, {
      group_list: list, // eslint-disable-line
    });
  },
  makeGroup({ lectureId, iList, start, end }) {
    const itemList = iList;
    let list = itemList[0];
    itemList.splice(0, 1);
    itemList.forEach((x) => {
      list = list + '<$!<>' + x; // eslint-disable-line
    });
    list = list.toString();
    return http.post(`/lecture-items/${lectureId}/group`, {
      list: list, // eslint-disable-line
      start: start, // eslint-disable-line
      end: end, // eslint-disable-line
    });
  },
  editGroup({ lectureId, iList, groupId, start, end }) {
    const itemList = iList;
    let list = itemList[0];
    itemList.splice(0, 1);
    itemList.forEach((x) => {
      list = list + '<$!<>' + x; // eslint-disable-line
    });
    list = list.toString();
    return http.put(`/lecture-items/${lectureId}/group/${groupId}`, {
      group_list: list, // eslint-disable-line
      start: start, // eslint-disable-line
      end: end, // eslint-disable-line
    });
  },
  showGroup({ lectureId }) {
    return http.get(`/lecture-items/${lectureId}/group`);
  },
  deleteGroup({ groupId }) {
    return http.delete(`/lecture-items/group/${groupId}`);
  },
  getSimilarityScores({ classId }) {
    // return http.get(`/similarity_score/`);
    // return http.get(`/similarity_score/${classId}`);
    return [
      {
        student_id: '1234',
        output_score: '0.3',
        code_score: '0.9',
        datetime: '2019-01-01 00:00:00',
      },
    ];
  },
};
