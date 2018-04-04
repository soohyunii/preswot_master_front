import { createLocalVue, mount } from 'vue-test-utils';
import Vuex from 'vuex';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ko';

import TeacherClassIndex from '../../../../../src/components/pages/TeacherClassIndex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Element, {
  locale,
});

const dummyCurrentClassObject = {
  class_id: 1, name: 'class1', description: 'alwejr', intended_lecture_num: 0, start_time: '2018-03-01T00:40:41.000Z', end_time: null, opened: 1, created_at: '2018-03-16T00:40:43.000Z', updated_at: '2018-03-16T01:44:00.000Z', master_id: 1, user_class: { role: 'teacher', class_id: 1, user_id: 1 }, scenarioList: [{ lecture_id: 1, name: 'lecture 1', description: null, location: null, type: 0, intended_start: '2018-03-08T06:23:32.000Z', intended_end: '2018-03-27T01:03:48.000Z', opened: 1, video_link: 'https://www.youtube.com/embed/undefined?autoplay=1', keyword_state: 0, created_at: '2018-03-16T00:40:58.000Z', updated_at: '2018-03-28T01:58:59.000Z', class_id: 1, teacher_id: 1 }, { lecture_id: 3, name: null, description: null, location: null, type: 0, intended_start: null, intended_end: null, opened: 1, video_link: 'https://www.youtube.com/embed/undefined?autoplay=1', keyword_state: 0, created_at: '2018-03-21T05:23:37.000Z', updated_at: '2018-03-22T05:35:44.000Z', class_id: 1, teacher_id: 1 }],
};

describe('TeacherClassIndex conditional rendering', () => {
  test('TeachingClassList가 비었을 때', () => {
    const wrapper = mount(TeacherClassIndex, {
      store: new Vuex.Store({
        modules: {
          class: {
            namespaced: true,
            getters: {
              isTeachingClassListEmpty: () => true,
            },
          },
        },
      }),
      localVue,
    });
    const text = wrapper.find('.info-box').text();
    expect(text).toBe('강의 중인 과목이 없음');
  });

  test('선택된 과목이 없을 때', () => {
    const wrapper = mount(TeacherClassIndex, {
      store: new Vuex.Store({
        modules: {
          class: {
            namespaced: true,
            getters: {
              currentTeachingClass: () => null,
            },
          },
        },
      }),
      localVue,
    });
    const text = wrapper.find('.info-box').text();
    expect(text).toBe('왼쪽의 과목 목록으로부터 선택하세요');
  });

  test('선택된 과목이 없을 때', () => {
    const wrapper = mount(TeacherClassIndex, {
      store: new Vuex.Store({
        modules: {
          class: {
            namespaced: true,
            getters: {
              currentTeachingClass: () => dummyCurrentClassObject,
            },
          },
        },
      }),
      localVue,
    });
    const text = wrapper.find('h3').text();
    expect(text).toBe('class1');
  });
});
