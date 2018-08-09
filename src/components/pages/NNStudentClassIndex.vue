<template>
  <div id="class_index_wrapper" class="bt-container">
    <h2 class="page-title">수강 중인 과목</h2>
    <student-class-table
      :list="list"
      :onClick="onClick"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import StudentClassTable from '../partials/StudentClassTable';
import utils from '../../utils';

export default {
  name: 'ClassIndex',
  components: {
    StudentClassTable,
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
    ...mapState('NNclass', ['studyingClassList']),
  },
  async created() {
    const vm = this;

    // 새로고침(Refresh, F5) 해도 목록을 가져올 수 있게 하는 부분.
    // TODO: 속도가 눈에 보이게 느려지므로 다른 방법이 있다면 수정 요구.
    await vm.getMyClassLists();

    // 검색 기능 : 서버에서 DB 쿼리로 처리하는 게 효율이 나을 것 같으면 나중에 수정.
    if (vm.studyingClassList !== null) {
      if (vm.$route.query.type !== undefined) {
        vm.searchType = vm.$route.query.type;
      }
      if (vm.$route.query.text !== undefined) {
        vm.searchText = vm.$route.query.text;
      }
      for (let i = 0; i < vm.studyingClassList.length; i += 1) {
        if (vm.searchType === 'name') {
          if (vm.studyingClassList[i].name.includes(vm.searchText)) {
            vm.list.push(vm.studyingClassList[i]);
          }
        }
        if (vm.searchType === 'teacher') {
          if (vm.studyingClassList[i].master.name.includes(vm.searchText)) {
            vm.list.push(vm.studyingClassList[i]);
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'deleteClassUser',
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
              vm.list.splice(arg2, 1);
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
          vm.$router.push({ path: '/a/student/NNclass', query: { type: `${arg.searchType}`, text: `${arg.searchText}` } });
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
