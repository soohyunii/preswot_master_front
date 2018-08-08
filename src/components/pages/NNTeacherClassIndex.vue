<template>
  <div id="teacher_class_index_wrapper" class="bt-container" oncontextmenu="return false">
    <h2 class="page-title">강의 중인 과목</h2>
    <div class="right-align">
      <router-link to="/a/teacher/NNclass/new">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')">
           <div class="right-align-btn-layer">과목 개설</div>
        </el-button>
      </router-link>
    </div>

    <class-list
      @row-click="onClickClass"
      @delete="onClickDelete"
      type="TEACHER"
      :list="teachingClassList || []"
      class="elTable-font"
      :isPhone="$isPhone"
    />

    <br />

    <!-- <div class="right-align"> --><!-- soohyun -->
      <div class="center-align">
      <router-link to="/a/teacher/NNclass/new">
        <el-button :class="$attachReactablePostfix('btn-add-lecture')" type="primary">강의 추가</el-button>
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
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
  },
  async beforeMount() {
    const vm = this;
    await vm.getMyClassLists();
  },
  methods: {
    ...mapMutations('NNclass', [
      'deleteTeachingClass',
    ]),
    ...mapActions('NNclass', [
      'getMyClassLists',
    ]),
    onClickClass(row, _, column) {
      if (column.label === '-') {
        return;
      }
      const vm = this;
      vm.$router.push(`/a/teacher/NNclass/${row.class_id}`);
    },
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
    margin-left : 12px;
    margin-bottom : 25px;
  }
  .right-align {
      text-align: right;
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
  }

  .right-align-btn-layer {
    width: 47px;
    height: 12px;
    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #1989fa;
    
    margin-left: auto;
    margin-right: auto;
  }
  .el-table th{
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
  }

  .el-table td{
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #1989fa;
  }
}

.right-align-btn-phone {
  display: none;
}

.btn-add-lecture-phone {
  display: none;
}
</style>
