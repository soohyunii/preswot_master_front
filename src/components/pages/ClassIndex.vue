<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">과목 목록</h2>

    <class-intro-table
      :list="list"
      :studyingClassList="studyingClassList || []"
      :onClick="onClick"
    />

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ClassIntroTable from '../partials/ClassIntroTable';
import utils from '../../utils';

export default {
  name: 'ClassIndex',
  components: {
    ClassIntroTable,
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
    ...mapState('NNclass', ['openedClassList', 'finishedClassList', 'studyingClassList']),
    authType() {
      const jwt = this.$store.state.auth.jwt;
      return utils.getAuthTypeFromJwt(jwt);
    },
  },
  async created() {
    const vm = this;

    // TODO: 새로고침(F5)을 하면 opendClassList 및 studyingClassList를 받아오지 못해서 에러가 발생합니다.
    //       vuex의 문제점으로 보이긴 하는데 추후에 해결이 필요해보입니다.
    vm.getClassLists();
    vm.getMyClassLists();

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    if (vm.$route.query.type !== undefined) {
      vm.searchType = vm.$route.query.type;
    }
    if (vm.$route.query.text !== undefined) {
      vm.searchText = vm.$route.query.text;
    }
    // 열린 강의 탐색
    if (vm.openedClassList !== null) {
      for (let i = 0; i < vm.openedClassList.length; i += 1) {
        if (vm.searchType === 'name') {
          if (vm.openedClassList[i].name.includes(vm.searchText)) {
            vm.list.push(vm.openedClassList[i]);
          }
        }
        if (vm.searchType === 'teacher') {
          if (vm.openedClassList[i].master.name.includes(vm.searchText)) {
            vm.list.push(vm.openedClassList[i]);
          }
        }
      }
    }
    // 마감된 강의 탐색
    if (vm.finishedClassList !== null) {
      for (let i = 0; i < vm.finishedClassList.length; i += 1) {
        if (vm.finishedClassList[i].opened === 2) {
          if (vm.searchType === 'name') {
            if (vm.finishedClassList[i].name.includes(vm.searchText)) {
              vm.list.push(vm.finishedClassList[i]);
            }
          }
          if (vm.searchType === 'teacher') {
            if (vm.finishedClassList[i].master.name.includes(vm.searchText)) {
              vm.list.push(vm.finishedClassList[i]);
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'postClassUser',
      'deleteClassUser',
    ]),
    formatDate: utils.formatDate,
    async onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'DETAIL': {
          vm.$router.push(`/class/${arg.class_id}/classdetail`);
          break;
        }
        case 'APPLY': {
          if (vm.authType !== 0) {
            vm.$notify({
              title: '로그인이 필요합니다',
              message: '학생 계정만 수강 신청을 할 수 있습니다.',
              type: 'warning',
              duration: 0,
            });
            vm.$router.push('/login');
          } else {
            try {
              await vm.postClassUser({
                classId: arg.class_id,
              });
              vm.$notify({
                title: '수강 신청 요청 성공',
                message: '수강 신청 완료',
                type: 'success',
              });

              try {
                await vm.getMyClassLists();
              } catch (error) {
                vm.$notify({
                  title: '과목 목록 가져오기 실패',
                  message: error.toString(),
                  type: 'error',
                  duration: 0,
                });
              }
            } catch (error) {
              vm.$notify({
                title: '수강 신청 요청 실패',
                message: error.toString(),
                type: 'error',
                duration: 0,
              });
            }
          }
          break;
        }
        case 'CANCEL': {
          vm.$confirm('정말로 이 과목의 수강을 취소하시겠습니까?', `${arg.name || ''} 수강 취소`, {
            confirmButtonText: '예, 취소합니다.',
            cancelButtonText: '아니요, 취소하지 않습니다.',
            type: 'warning',
          })
          .then(async () => {
            try {
              await vm.deleteClassUser({
                classId: arg.class_id,
                userId: vm.userId,
              });

              vm.$notify({
                title: '수강 취소 성공',
                message: '수강이 취소됨',
                type: 'success',
                duration: 3000,
              });
            } catch (error) {
              vm.$notify({
                title: '수강 취소 실패',
                message: error.toString(),
                type: 'error',
                duration: 3000,
              });
            }

            try {
              await vm.getMyClassLists();
              await vm.getClassLists();
            } catch (error) {
              vm.$notify({
                title: '과목 목록 가져오기 실패',
                message: error.toString(),
                type: 'error',
                duration: 0,
              });
            }
          })
          .catch(() => {
            vm.$notify({
              title: '중단됨',
              message: '수강 취소 중단됨',
              type: 'info',
              duration: 3000,
            });
          });

          break;
        }
        case 'SEARCH': {
          vm.$router.push({ path: '/classes', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
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
