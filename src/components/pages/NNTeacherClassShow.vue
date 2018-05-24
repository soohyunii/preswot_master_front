<template>
  <div id="teacher_lecture_index_wrapper" class="bt-container">
    <h2>TODO: 과목명 classId: {{ classId }}</h2>

    <!-- teachingClassList: {{ teachingClassList }} -->

    <lecture-list
      @row-click="onClickLecture"
      @delete="onClickDelete"
      type="TEACHER"
      :list="lectureList"
    />

    <br />

    <div class="right-align">
      <router-link to="/a/teacher/NNlecture/new">
        <el-button type="primary">강의 추가</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LectureList from '../partials/LectureList';
import utils from '../../utils';
import lectureService from '../../services/lectureService';

export default {
  name: 'TeacherLectureIndex',
  components: {
    LectureList,
  },
  data() {
    return {
    };
  },
  mounted() {
    const vm = this;
    vm.NNgetClass({
      type: 'TEACHER',
      classId: vm.classId,
    });
  },
  computed: {
    ...mapState('class', [
      'teachingClassList',
    ]),
    lectureList() {
      const vm = this;
      if (!vm.teachingClassList) {
        return [];
      }
      const currentClass = vm.teachingClassList.find(item => item.class_id === vm.classId);
      if (currentClass && currentClass.scenarioList) {
        return currentClass.scenarioList.map((item) => {
          const type = utils.convertScType(item.type);
          item.type = type; // eslint-disable-line no-param-reassign
          return item;
        });
      }
      return [];
    },
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.classId, 10);
    },
  },
  methods: {
    ...mapActions('class', [
      'NNgetClass',
    ]),
    onClickLecture(row, _, column) {
      if (column.label === '-') {
        return;
      }
      const vm = this;
      vm.$router.push(`/a/teacher/NNclass/${row.class_id}`);
    },
    onClickDelete(index) {
      const vm = this;
      vm.$confirm('정말로 이 강의를 삭제하시겠습니까?', `${vm.scTitle || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            const currentClass = vm.teachingClassList.find(item => item.class_id === vm.classId);
            const targetLecture = currentClass.scenarioList[index];
            await lectureService.deleteLecture({ lectureId: targetLecture.lecture_id });
            // await vm.deleteSc();
            vm.$notify({
              title: '삭제됨',
              message: '강의가 삭제됨',
              type: 'success',
              duration: 3000,
            });
            // TODO: delete lecture from scenarioList
          } catch (error) {
            vm.$notify({
              title: '강의 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '강의 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_lecture_index_wrapper {
  .right-align {
    text-align: right;
  }
}
</style>

