<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    <h2>{{ getCurrentClass() ? getCurrentClass().name : '' }} > 근대사 1950년대(강의명)</h2>
    lecture id: {{ lectureId }}<br />
    TODO: get lecture name <br />
    {{ getCurrentClass() }}<br />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="기본 정보 수정" name="one">
        강의 기본 정보 수정 부분뷰
      </el-tab-pane>
      <el-tab-pane label="강의 자료 및 키워드 등록" name="two">
        강의 자료 및 키워드 등록 부분뷰
      </el-tab-pane>
      <el-tab-pane label="강의 도구 등록" name="three">
        강의 도구 등록 부분뷰
      </el-tab-pane>
      <el-tab-pane label="강의 허용 프로그램 설정" name="four">
        강의 허용 프로그램 설정 부분뷰
      </el-tab-pane>
      <el-tab-pane label="강의 지식맵 관리" name="five">
        강의 지식맵 관리 부분뷰
      </el-tab-pane>
      <el-tab-pane label="채점 관리" name="six">
        채점 관리 부분뷰
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TeacherLcetureManage',
  data() {
    return {
      activeTab: 'one',
    };
  },
  async mounted() {
    const vm = this;
    // FIXME: TeacherClassShow의 그것이랑 동일한 문제 // getMyClassLists를 다른곳에서 불러서 이미 채워져있는경우면 사실 필요없음
    await vm.getMyClassLists();
    await vm.getClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
  },
  methods: {
    ...mapActions('NNclass', [
      'getMyClassLists',
    ]),
    getCurrentClass() {
      const vm = this;
      if (Array.isArray(vm.teachingClassList)) {
        return vm.teachingClassList.find(item => item.class_id === vm.classId);
      }
      return null;
    },
  },
};
</script>

