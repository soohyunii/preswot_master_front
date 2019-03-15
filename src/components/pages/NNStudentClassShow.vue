<template>
  <div id="student_lecture_index_wrapper" class="bt-container">
    <h2>{{ currentStudyingClass(classId) ? currentStudyingClass(classId).name : '' }}</h2>
    <div class="right-align margin-bottom-15">
      <!-- <el-button @click="onClick('KNOWLEDGEMAP')">과목지식맵</el-button> -->
      <!-- <el-button @click="onClick('ANALYSIS')">과목저널링</el-button> -->
      <el-button :class="$attachReactablePostfix('btn-board')" @click="onClick('Q&A')">게시판</el-button>
      <el-button :class="$attachReactablePostfix('btn-show-result')" @click="onClick('GRADE')">결과보기</el-button>
    </div>
    <lecture-list
      @row-click="onClickLecture"
      @join="onClickJoin"
      type="STUDENT"
      :list="lectureL"
    />
    <br />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';
import lectureService from '../../services/lectureService';
import { resolve } from 'url';

export default {
  name: 'StudentClassShow',
  components: {
    LectureList,
  },
  data() {
    return {
      lectureL: [],
    };
  },
  async mounted() {
    const vm = this;
    await vm.getMyClassLists();
    await vm.getClass({
      type: 'STUDENT',
      classId: vm.classId,
    });
    // 학생이 본인의 수강 강의들 불러오는 부분 mounted에서 동작
    const currentClass = await vm.currentStudyingClass(Number.parseInt(vm.classId, 10));
    if (currentClass && currentClass.lectures) {
      const lecL = currentClass.lectures;
      for (let i = 0; i < lecL.length; i += 1) {
        const item = lecL[i];
        const type = utils.convertLcType(item.type);
        item.type = type;
        // 수강 완료 - 미완료는 별도의 API 통해 결정
        const res = await lectureService.studentLoginLog({
          lectureId: item.lecture_id,
        });
        if (res.data.login === true) {
          item.heard = '수강완료';
        } else {
          item.heard = '수강미완료';
        }
      }
      vm.lectureL = lecL;
    } else {
      vm.lectureL = [];
    }
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
      return vm.lectureL;
      /*
      return currentClass.lectures.map((item) => {
        const type = utils.convertLcType(item.type);
        // eslint-disable-next-line no-param-reassign
        item.type = type;
        const res = lectureService.studentLoginLog({
          lectureId: item.lecture_id,
        });
        res.then((result) => {
          if (result.data.login === true) {
            item.heard = '수강완료';
          } else {
            item.heard = '수강미완료';
          }
          console.log(item.heard);
        });
        // 수강 완료 or 미완료 기준 변경 -> heartbeat에서 lecture_student_login_logs로
        // eslint-disable-next-line no-param-reassign
        return item;
      }); */
    },
  },
  methods: {
    ...mapActions('NNclass', [
      'getClass',
      'getMyClassLists',
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
        case 'GRADE': {
          vm.$router.push(`/a/student/class/${vm.classId}/grade`);
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
    onClickJoin(index) {
      const vm = this;
      const lectureId = vm.lectureList[index].lecture_id;
      const lectureType = vm.lectureList[index].type;
      const lectureStartTime = Date.parse(vm.lectureList[index].start_time);
      const lectureEndTime = Date.parse(vm.lectureList[index].end_time);
      const classId = vm.classId;
      const currentTime = Date.now();

      if (lectureType !== '[유인]') {
        // 강의 활성화 시간 이전에 강의보기를 클릭한 경우
        if (currentTime < lectureStartTime) {
          vm.$notify({
            title: 'Info',
            message: '해당 강의가 활성화되지 않았습니다.',
            type: 'info',
            duration: 2000,
          });
        // 강의 활성화 시간 이후에 강의보기를 클릭한 경우
        } else if (currentTime > lectureEndTime) {
          vm.$notify({
            title: 'Info',
            message: '해당 강의가 종료되었습니다.',
            type: 'info',
            duration: 2000,
          });
        } else {
          vm.$router.push(`/a/student/NNlecture/${lectureId}/live?classId=${classId}`);
        }
      } else {
        vm.$router.push(`/a/student/NNlecture/${lectureId}/live?classId=${classId}`);
      }
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
}
.btn-board-phone {
  display: none;
}
.btn-show-result-phone {
  display: none;
}
</style>
