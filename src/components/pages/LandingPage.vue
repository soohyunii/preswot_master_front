<template>
  <div id="landing_page_wrapper" class="bt-container">
    <resize-observer @notify="handleResize" />
    <landing-search-header/>
    <!-- <h3>인기 과목 보기</h3> -->
    <!-- <h3>개설된 과목 목록</h3>
    <class-intro-card-grid
      v-if="openedClassListTemp.length > 0"
      :onClick="onClick"
      :span="span"
      :classList="openedClassListTemp"
    />
    <p v-if="openedClassListTemp.length === 0">
      개설된 과목 목록이 없습니다.
    </p> -->
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import { mapState, mapActions } from 'vuex';
import ClassIntroCard from '../partials/ClassIntroCard';
import ClassIntroCardGrid from '../partials/ClassIntroCardGrid';
import LandingSearchHeader from '../partials/LandingSearchHeader';
import utils from '../../utils';

export default {
  name: 'LandingPage',
  components: {
    ClassIntroCard,
    ClassIntroCardGrid,
    LandingSearchHeader,
  },
  async beforeMount() {
    const vm = this;
    await vm.handleResize();
    await vm.getClassLists();  // FIXME : 추후 기획 문서에 따라 인기 과목 리스트로 바꿀 것
    await vm.getMyClassLists();
    const myClassIdList = (vm.studyingClassList !== null) ?
      vm.studyingClassList.map(element => element.class_id) : [];
    vm.openedClassListTemp = (vm.openedClassList !== null) ?
      deepCopy(vm.openedClassList) : [];
    // FIXME : 추후 server쪽과 ClassIntroCardGird의 변수명과 형식을 완전 일치시켜서 서버에서 받아오자마자 넣는식으로 하면 좋을 것 같습니다.
    // FIXME : 요청드린 서버 추가 개발 완료시, teacherlist에 email주소 대신 실제 이름을 넣고, 인원이 꽉 찬 경우 status = 2 대입할 것.
    vm.openedClassListTemp.forEach((element) => {
      element.title = element.name; // eslint-disable-line
      element.startDateStr = (element.start_time !== undefined) ? element.start_time.slice(0, 10) : undefined // eslint-disable-line
      element.endDateStr = (element.end_time !== undefined) ? element.end_time.slice(0, 10) : undefined // eslint-disable-line
      element.teacherlist = [element.master.email_id]; // eslint-disable-line
      if (myClassIdList.indexOf(element.class_id) !== -1) {
        element.status = 1; // eslint-disable-line
      }
    });
  },
  computed: {
    ...mapState('NNclass', [
      'openedClassList',
      'studyingClassList',
    ]),
  },
  data() {
    return {
      span: 0,
      openedClassListTemp: [],
    };
  },
  methods: {
    ...mapActions('NNclass', [
      'getClassLists',
      'getMyClassLists',
      'postClassUser',
    ]),
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'APPLY': {
          try {
            await vm.postClassUser({
              classId: data,
            });
            vm.$notify({
              title: '수강 신청 요청 성공',
              message: '메세지',
              type: 'success',
            });
          } catch (error) {
            vm.$notify({
              title: '수강 신청 요청 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
          break;
        }
        case 'DETAIL': {
          vm.$router.push(`/class/${data}/classdetail`);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    handleResize() {
      const vm = this;
      switch (utils.getViewportSize()) {
        case 'xs':
          vm.span = 12;
          break;
        case 'sm':
          vm.span = 8;
          break;
        case 'md':
          vm.span = 6;
          break;
        default:
          vm.span = 4;
          break;
      }
    },
  },
};
</script>

<style lang="scss">
#landing_page_wrapper h3{
  margin-top:45px;
}



</style>
