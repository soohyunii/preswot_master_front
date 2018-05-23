<template>
  <div id="teacher_class_index_wrapper" class="bt-container">
    <class-list @delete="onClickDelete" type="TEACHER" :list="teachingClassList" />

    <br />

    <div class="right-align">
      <router-link to="/a/teacher/NNclass/new">
        <el-button type="primary">과목 개설</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ClassList from '../partials/ClassList';
import classService from '../../services/classService';


export default {
  name: 'TeacherClassIndex',
  components: {
    ClassList,
  },
  computed: {
    ...mapState('class', [
      'teachingClassList',
    ]),
  },
  async beforeMount() {
    const vm = this;
    await vm.getMyClassLists();
  },
  methods: {
    ...mapMutations('class', [
      'deleteTeachingClass',
    ]),
    ...mapActions('class', [
      'getMyClassLists',
      'NNdeleteClass',
    ]),
    onClickDelete(index) {
      const vm = this;
      const currentTeachingClass = vm.teachingClassList[index];
      vm.$confirm('정말로 이 과목을 삭제하시겠습니까?', `${currentTeachingClass.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            // const index = vm.currentClassIndex;
            const currentClass = vm.teachingClassList[index];
            await classService.delete({
              id: currentClass.class_id,
            });
            vm.deleteTeachingClass({
              teachingClassIndex: index,
            });
            vm.$notify({
              title: '삭제됨',
              message: '과목이 삭제됨',
              type: 'success',
              duration: 3000,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '과목 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '과목 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
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
