<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">조회하기 > 대학</h2>
    <master-uni-table
      :list="list"
      :onClick="onClick"
    />
    <br/>
    <div class="right-align">
      <router-link to="/a/register/uni">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">대학 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 49%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MasterUniTable from '../partials/MasterUniTable';
import masterServie from '../../services/masterService';
import utils from '../../utils';

export default {
  name: 'ViewDept',
  components: {
    MasterUniTable,
  },
  data() {
    return {
      userId: utils.getUserIdFromJwt(),
      searchType: 'name',
      searchText: '',
      list: [],
    };
  },
  computed: {
    /* ...mapState('MasterUni', ['MasterUni']),
    */
    ...mapState('MasterUni', ['studyingUniList']),
  },
  async created() {
    const vm = this;

    // 새로고침(Refresh, F5) 해도 목록을 가져올 수 있게 하는 부분.
    // TODO: 속도가 눈에 보이게 느려지므로 다른 방법이 있다면 수정 요구.
    await vm.getUniLists();

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    // console.log("studyingUniList= "+vm.studyingUniList);
  
    if (vm.studyingUniList !== null) {
      if (vm.$route.query.type !== undefined) {
        vm.searchType = vm.$route.query.type;
      }
      if (vm.$route.query.text !== undefined) {
        vm.searchText = vm.$route.query.text;
      }
      for (let i = 0; i < vm.studyingUniList.length; i += 1) {
        if (vm.searchType === 'name') {
          if (vm.studyingUniList[i].name.includes(vm.searchText)) {
            vm.list.push(vm.studyingUniList[i]);
          }
        }
        if (vm.searchType === 'teacher') {
          if (vm.studyingUniList[i].master.name.includes(vm.searchText)) {
            vm.list.push(vm.studyingUniList[i]);
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('MasterUni', [
      /*
      'getClassLists',
      'getMyClassLists',
      */
      /*'deleteClassUser',*/
      'getUniLists',
    ]),
    formatDate: utils.formatDate,
    async onClick(type, arg, arg2) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          vm.$router.push(`/class/${arg.class_id}/classdetail`);
          break;
        }
        case 'LISTEN': {
          vm.$router.push(`/a/student/NNclass/${arg.class_id}`);
          break;
        }
        /*
        case 'CANCEL': {
          vm.$confirm('정말로 이 학과를 삭제하시겠습니까?', `${arg.name || ''} 수강 취소`, {
            confirmButtonText: '예, 삭제합니다.',
            cancelButtonText: '아니요, 삭제하지 않습니다.',
            type: 'warning',
          })
          .then(async () => {
            try {
              await vm.deleteClassUser({
                classId: arg.class_id,
                userId: vm.userId,
              });

              vm.$notify({
                title: '학과 삭제 성공',
                message: '학과가 삭제됨',
                type: 'success',
                duration: 3000,
              });
            } catch (error) {
              vm.$notify({
                title: '학과 삭제 실패',
                message: error.toString(),
                type: 'error',
                duration: 3000,
              });
            }

            try {
              await vm.getMyClassLists();
              vm.list.splice(arg2, 1);
            } catch (error) {
              vm.$notify({
                title: '학과 삭제 실패',
                message: error.toString(),
                type: 'error',
                duration: 0,
              });
            }
          })
          .catch(() => {
            vm.$notify({
              title: '중단됨',
              message: '학과 삭제 중단됨',
              type: 'info',
              duration: 3000,
            });
          });

          break;
        }
        */
        case 'SEARCH': {
          vm.$router.push({ path: '/a/view/uni', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    onClickDelete(index) {
      const vm = this;
      const currentTeachingClass = vm.teachingClassList[index];
      vm.$confirm('정말로 이 대학을 삭제하시겠습니까?', `${currentTeachingClass.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            // const index = vm.currentClassIndex;
            const currentClass = vm.teachingClassList[index];
            await masterServie.delete({
              id: currentClass.class_id,
            });
            vm.deleteTeachingClass({
              teachingClassIndex: index,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '대학 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '대학 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>


<style lang="scss" scoped>

#class_index_wrapper {
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
}
</style>
