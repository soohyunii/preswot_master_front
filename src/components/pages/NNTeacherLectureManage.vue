<template>
  <div id="teacher_lecture_manage_wrapper" class="bt-container">
    <h2>{{ currentTeachingClass(classId) ? currentTeachingClass(classId).name : '' }} > {{ lecture ? lecture.name : '' }}</h2>
    <!-- lecture id: {{ lectureId }} {{ lecture }}<br /> <br /> -->
    <!-- ddd {{ currentTeachingClass(classId) }}<br /> -->

    <el-tabs v-model="activeTab" :before-leave="beforeLeaveTab">
      <el-tab-pane label="기본 정보 수정" name="basic">
        <teacher-lecture-new />
      </el-tab-pane>
      <el-tab-pane label="강의 자료 및 키워드 등록" name="material">
        <tlm-tab-material-and-keyword-edit :onClick="onClick"/>
      </el-tab-pane>
      <el-tab-pane label="강의 아이템 수정" name="item">
        <tlm-tab-lecture-item-edit />
      </el-tab-pane>
      <el-tab-pane label="강의 허용 프로그램 설정" name="program">
        <tlm-tab-allowed-program />
      </el-tab-pane>
      <!-- knowledgeMap 렌더링 시 노드가 캔버스의 범위를 벗어나는 이슈가 발생하여 ':lazy="true" 추가 -->
      <el-tab-pane label="강의 지식맵 관리" name="kmap" lazy>
        <knowledgeMap />
      </el-tab-pane>
      <!-- <knowledgeMap /> -->
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import NNTeacherLectureNew from './NNTeacherLectureNew';
import TlmTabMaterialAndKeywordEdit from '../partials/TlmTabMaterialAndKeywordEdit';
import TlmTabLectureItemEdit from '../partials/TlmTabLectureItemEdit';
import TlmTabAllowedProgram from '../partials/TlmTabAllowedProgram';
// import utils from '../../utils';
// import MaterialUpload from '../partials/MaterialUpload';
// import RecommendKeywords from '../partials/RecommendKeywords';
// import LectureKeywordsEditor from '../partials/LectureKeywordsEditor';
import KnowledgeMap from '../partials/NNKnowledgeMap';


export default {
  name: 'TeacherLectureManage',
  components: {
    TeacherLectureNew: NNTeacherLectureNew,
    TlmTabMaterialAndKeywordEdit,
    TlmTabLectureItemEdit,
    TlmTabAllowedProgram,
    KnowledgeMap,
  },
  data() {
    return {
      activeTab: 'basic',
      isNowledgeMap: false,
    };
  },
  async created() {
    const vm = this;
    // FIXME: TeacherClassShow의 그것이랑 동일한 문제 // getMyClassLists를 다른곳에서 불러서 이미 채워져있는경우면 사실 필요없음
    await vm.getMyClassLists();
    await vm.getClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
    await vm.getLecture({ lectureId: vm.lectureId });
    await vm.getKeywords();
  },
  beforeRouteLeave(to, from, next) {
    const vm = this;
    vm.resetLectureItemEditTab();
    next();
  },
  computed: {
    ...mapGetters('NNclass', [
      'currentTeachingClass',
    ]),
    ...mapState('lc', [
      'lecture',
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
    ...mapMutations('lcItem', [
      'updateCurrentEditingLectureItemId',
      'updateLectureItem',
    ]),
    ...mapActions('NNclass', [
      'getMyClassLists',
      'getClass',
    ]),
    ...mapActions('lc', [
      'getLecture',
    ]),
    ...mapActions('keyword', [
      'deleteLectureKeywords',
      'postLectureKeywords',
      'getKeywords',
    ]),
    beforeLeaveTab() {
      const vm = this;
      if (vm.activeTab === 'item') { // 강의 아이템 등록에서 떠나려는 경우
        vm.resetLectureItemEditTab();
      }
      return true; // false인 경우 탭 전환 안됨
    },
    resetLectureItemEditTab() {
      const vm = this;
      vm.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: null,
      });
      vm.updateLectureItem({
        lectureItem: null,
      });
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'SUBMIT_KEYWORDS': {
          vm.deleteLectureKeywords();
          vm.postLectureKeywords();
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_lecture_manage_wrapper {
  .align-right {
    text-align: right;
  }
}
</style>


