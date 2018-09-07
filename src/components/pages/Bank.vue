<template>
  <div id="bank" class="bt-container" style="margin: 0 auto;">
    <h1>강의 은행</h1>
    <el-tabs v-model="activeTab" :before-leave="beforeLeaveTab" @tab-click="onClick('TAB_CLICK')">
      <el-tab-pane label="과목 저장소" name="class">
        <bank-class />
      </el-tab-pane>
      <el-tab-pane label="강의 저장소" name="lecture">
        <bank-lecture />
      </el-tab-pane>
      <el-tab-pane label="강의 아이템 저장소" name="item">
        <bank-lecture-item />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BankClass from '../partials/BankClass';
import BankLecture from '../partials/BankLecture';
import BankLectureItem from '../partials/BankLectureItem';


export default {
  name: 'Bank',
  components: {
    BankClass,
    BankLecture,
    BankLectureItem,
  },
  data() {
    return {
      activeTab: 'class',
    };
  },
   /*async created() {
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
        case 'TAB_CLICK': {
          if (vm.activeTab === 'kmap') {
            EventBus.$emit('drawNetwork');
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },*/
};
</script>

<style lang="scss" scoped>
#teacher_lecture_manage_wrapper {
  .align-right {
    text-align: right;
  }
}
</style>