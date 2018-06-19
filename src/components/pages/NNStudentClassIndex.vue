<template>
  <div>
    <resize-observer @notify="handleResize" />
    <p>수강중인 과목</p>
    <class-intro-card-grid
    v-if="studyingClassListTemp.length > 0"
    :onClick="onClick"
    :span="span"
    :classList="studyingClassListTemp"
    />
    <p v-if="studyingClassListTemp.length === 0">
      수강중인 과목이 없습니다.
    </p>
  </div>
</template>

<script>
import deepCopy from 'deep-copy';
import { mapActions, mapState } from 'vuex';
import ClassIntroCard from '../partials/ClassIntroCard';
import ClassIntroCardGrid from '../partials/ClassIntroCardGrid';
import utils from '../../utils';

export default {
  name: 'ClassIndex',
  components: {
    ClassIntroCard,
    ClassIntroCardGrid,
  },
  async mounted() {
    const vm = this;
    await vm.handleResize();
    await vm.getMyClassLists();
    if (vm.studyingClassList !== null) {
      vm.studyingClassListTemp = deepCopy(vm.studyingClassList);
      vm.studyingClassListTemp.forEach((element) => {
        element.title = element.name; // eslint-disable-line
        element.startDateStr = (element.start_time !== undefined) ? element.start_time.slice(0, 10) : undefined // eslint-disable-line
        element.endDateStr = (element.end_time !== undefined) ? element.end_time.slice(0, 10) : undefined // eslint-disable-line
        element.teacherlist = [element.master_id]; // eslint-disable-line
        element.status = 3; // eslint-disable-line
      });
    }
  },
  methods: {
    ...mapActions('NNclass', [
      'getMyClassLists',
    ]),
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        case 'GOTOLECTURE': {
          // TODO
          console.log('강의 보기 페이지로 이동'); // eslint-disable-line
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
  computed: {
    ...mapState('NNclass', [
      'studyingClassList',
    ]),
  },
  data() {
    return {
      span: 0,
      studyingClassListTemp: [],
    };
  },
};
</script>
