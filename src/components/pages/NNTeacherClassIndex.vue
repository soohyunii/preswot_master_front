<template>
  <div id="teacher_class_index_wrapper" class="bt-container">
    <h2 class="page-title">강의중인 과목 목록</h2>
    <div style="height: 50px;" />
    <class-list
      @row-click="onClickClass"
      @delete="onClickDelete"
      type="TEACHER"
      :list="teachingClassList || []"
      class="elTable-font"
      :isPhone="$isPhone"
    />

    <br />

    <div class="right-align">
      <!--
      <router-link to="/a/teacher/NNclass/new">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">과목 개설</div>
        </el-button>
      </router-link>
      -->
      <el-button @click="onClick('NEW')" type="primary" :class="$attachReactablePostfix('right-align-btn')">
        <div class="right-align-btn-layer">과목 개설</div>
      </el-button>
      <!--
      <router-link :to="`/a/teacher/NNclass/newfrombank`">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">과목은행에서 가져오기</div>
        </el-button>
      </router-link>
      -->
    </div>
  </div>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ClassList from '../partials/ClassList';
import classService from '../../services/classService';
import authService from '../../services/authService';
import utils from '../../utils';


export default {
  name: 'TeacherClassIndex',
  async created() {
    const vm = this;
    // 학생이 url로 접근하는 경우 방지
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }
  },
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
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'NEW': {
          vm.$notify({
            title: '알림',
            message: '과목 개설은 관리자를 통해서 진행해주세요.',
            type: 'warning',
            duration: 5000,
          });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
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
      }).then(async () => {
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
      }).catch(() => {
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
  .page-title {
    float:left;
    width: 100%;
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
    width: 100%;
    height: 40px;
    border-radius: 3px;
    border: solid 1px #1989fa;
  }

  .right-align-btn-layer {
    width: 94px;
    height: 12px;
    font-family: SpoqaHanSans;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
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
</style>
