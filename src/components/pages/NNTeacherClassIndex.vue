<template>
  <div id="teacher_class_index_wrapper" class="bt-container">
    <class-list type="TEACHER" :list="[
            {
              class_id: 1,
              name: 'asdf',
              description: 'sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf',
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
            {
              class_id: 1,
              name: 'asdf2',
              description: 'sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf',
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
          ]" />

    <br />

    <div class="right-align">
      <router-link to="/a/teacher/class/new">
        <el-button type="primary">과목 개설</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ClassList from '../partials/ClassList';

export default {
  name: 'TeacherClassIndex',
  components: {
    ClassList,
  },
  computed: {
    ...mapState('class', [
      'currentClassIndex',
      'teachingClassList',
      'studyingClassList',
    ]),
  },
  methods: {
    ...mapMutations('class', [
      'updateCurrentClassIndex',
    ]),
    ...mapActions('class', [
      'getMyClassLists',
      'getKnowledgeMapData',
    ]),
  },
};
</script>

<style lang="scss" scoped>
#teacher_class_index_wrapper {
  .right-align {
    text-align: right;
  }
}
</style>
