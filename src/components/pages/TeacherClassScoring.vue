<template>
  <div class="wrapper">
    <el-container>
      <el-main v-if="currentClass">
asdasdasd
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
  main {
    min-height: 800px;
  }
</style>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

  export default {
    name: 'TeacherClassScoring',
    computed: {
      ...mapState('class', ['teachingClassList', 'currentClassIndex']),
      ...mapGetters('class', [
        'currentTeachingClass',
      ]),
    },
    data() {
      return {
      };
    },
    async created() {
      const vm = this;
      if (!vm.currentTeachingClass) {
        await vm.getMyClassLists();
        vm.updateCurrentClassIndex({
          currentClassId: Number.parseInt(vm.$route.params.classId, 10),
        });
        await vm.getClass({ type: 'TEACH' });
      }
    },
    methods: {
      ...mapMutations('class', [
        'updateCurrentClassIndex',
      ]),
      ...mapActions('class', [
        'getMyClassLists',
        'getClass',
        'getClassCoverage',
      ]),
      ...mapActions('sc', ['getScCoverage']),
    },
  };
</script>
