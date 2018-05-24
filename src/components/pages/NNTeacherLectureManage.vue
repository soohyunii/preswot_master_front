<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    <h2>{{ getCurrentClass().name }} > 근대사 1950년대(강의명)</h2>
    lecture id: {{ lectureId }}<br />
    TODO: get lecture name <br />

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
import { mapState } from 'vuex';

export default {
  name: 'TeacherLcetureManage',
  data() {
    return {
      activeTab: 'one',
    };
  },
  computed: {
    ...mapState('class', [
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
    getCurrentClass() {
      const vm = this;
      console.log('getCurrentClass classId', vm.classId, vm.teachingClassList);
      return vm.teachingClassList.find(item => item.class_id === vm.classId);
    },
  },
};
</script>

