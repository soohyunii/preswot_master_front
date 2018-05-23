import { shallow } from 'vue-test-utils';
import ClassList from '@/components/partials/ClassList';

describe('ClassList.vue', () => {
  it('type TEACHER, should render empty if list.length === 0', () => {
    const wrapper = shallow(ClassList, {
      context: {
        props: {
          type: 'TEACHER',
          list: [],
        },
      },
    });

    const hasText = wrapper.text().includes('강의 중인 과목이 없습니다.');
    expect(hasText).toBeTruthy();
  });

  it('type TEACHER, should render element table if not empty', () => {
    const wrapper = shallow(ClassList, {
      context: {
        props: {
          type: 'TEACHER',
          list: [
            {
              class_id: 1,
              name: 'asdf',
              description: 'sdfsdf',
              intended_lecture_num: 0,
              start_time: '2018-05-02T06:03:05.000Z',
              end_time: null,
              opened: 1,
              created_at: '2018-05-15T06:03:06.000Z',
              updated_at: '2018-05-15T07:12:08.000Z',
              master_id: 11,
              user_class: {
                role: 'teacher',
                class_id: 1,
                user_id: 11,
              },
            },
          ],
        },
      },
    });
    const hasElTable = wrapper.html().includes('el-table');
    expect(hasElTable).toBeTruthy();
  });
});
