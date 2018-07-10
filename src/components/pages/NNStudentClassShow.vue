<template>
  <div id="student_lecture_index_wrapper" class="bt-container">
    <h2 class="page-title">{{ currentStudyingClass(classId) ? currentStudyingClass(classId).name : '' }}</h2>
    <div class="right-align margin-bottom-15">
      <!-- <el-button @click="onClick('KNOWLEDGEMAP')">과목지식맵</el-button> -->
      <!-- <el-button @click="onClick('ANALYSIS')">과목저널링</el-button> -->
      <el-button @click="onClick('Q&A')" class="right-align-btn">게시판</el-button>
    </div>
    <lecture-list
      @row-click="onClickLecture"
      @row-class-name="rowClassName"
      @header-row-class-name="headerRowClassName"
      type="STUDENT"
      :list="lectureList"
    />
    <br />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';

export default {
  name: 'StudentClassShow',
  components: {
    LectureList,
  },
  data() {
    return {
    };
  },
  async mounted() {
    const vm = this;
    await vm.getMyClassLists();
    await vm.getClass({
      type: 'STUDENT',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('NNclass', [
      'studyingClassList',
    ]),
    ...mapGetters('NNclass', [
      'currentStudyingClass',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
    lectureList() {
      const vm = this;
      if (!vm.studyingClassList) {
        return [];
      }
      const currentClass = vm.currentStudyingClass(vm.classId);
      if (currentClass && currentClass.lectures) {
        return currentClass.lectures.map((item) => {
          const type = utils.convertLcItemTypeKor(item.type);
          // eslint-disable-next-line no-param-reassign
          item.type = type;
          // eslint-disable-next-line no-param-reassign
          item.heard = (item.heartbeat_counts.length > 0) ? '수강완료' : '수강미완료';
          return item;
        });
      }
      return [];
    },
  },
  methods: {
    ...mapActions('NNclass', [
      'getClass',
      'getMyClassLists',
      'deleteScenario',
    ]),
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'KNOWLEDGEMAP': {
          // TODO : link
          // vm.$router.push(`/a/teacher/class/${vm.classId}/evaluation`);
          break;
        }
        case 'ANALYSIS': {
          // TODO : link
          // vm.$router.push(`/a/teacher/class/${vm.classId}/journal`);
          break;
        }
        case 'Q&A': {
          vm.$router.push(`/a/class/${vm.classId}/board/0`);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickLecture() {
      // 없으면 LectureList.vue 에러나는데 TeacherClassShow와 같이 쓰고있어서 빈 메소드를 넣어둠.
    },
    rowClassName({rowIndex}){
      // if(rowIndex===1){
      //   return 'rowOne';
      // }
      return 'rowOthers';
    },
    headerRowClassName({rowIndex}){
      return 'headerRow';

    },
  },
};
</script>

<style lang="scss" scoped>
#student_lecture_index_wrapper {
  .right-align {
    text-align: right;
  }
  .margin-bottom-15 {
    margin-bottom: 15px;
  }
  .page-title{
    float:left;
    width:1000px;
    height: 24px;
      
    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;
 
    margin-top : 40px;
    // margin-left : 12px;
    margin-bottom : 25px;
 }
 
.right-align-btn {
    width: 140px;
    height: 40px;
    border-radius: 3px;
    background-color: #ffffff;
    border: solid 1px #1989fa;
    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;


    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #1989fa;
}


}
</style>




