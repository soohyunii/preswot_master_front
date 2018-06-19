<template>
  <div id="tlm_tab_allowed_program">
    <el-transfer
      v-model="tempAllowedProgramPlistIdList"
      filterable
      :titles="['프로그램 리스트', '허용된 프로그램']"
      :data="programList"
    >
    </el-transfer>
    <br />
    <el-button
      type="primary"
      :disabled="!hasChange"
      @click="onClick('SAVE')"
    >
      저장
    </el-button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import isEqual from 'lodash.isequal';

export default {
  name: 'TlmTabAllowedProgram',
  data() {
    return {
      tempAllowedProgramPlistIdList: [], // 아직 서버에 올라가진 않음
    };
  },
  methods: {
    ...mapActions('allowedProgram', [
      'getProgramLists',
      'postProgramList',
    ]),
    async onClick(type) {
      const vm = this;
      switch (type) {
        case 'SAVE': {
          try {
            await vm.postProgramList({
              tempAllowedProgramPlistIdList: vm.tempAllowedProgramPlistIdList,
            });
            vm.$notify({
              title: '허용 프로그램 수정 성공',
              message: '성공적으로 저장됨',
              type: 'success',
            });
            const lectureId = Number.parseInt(vm.$route.params.lectureId, 10);
            await vm.getProgramLists({
              lectureId,
            });
          } catch (error) {
            vm.$notify({
              title: '허용 프로그램 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
  computed: {
    ...mapState('allowedProgram', [
      'allowedProgramList',
    ]),
    programList() {
      const vm = this;
      const list = vm.$store.state.allowedProgram.programList;
      if (!list) {
        return [];
      }
      return list.map(x => ({
        key: x.plist_id,
        label: x.name,
      }));
    },
    hasChange() {
      const vm = this;
      const originalAllowedPlistIdSet = new Set(vm.allowedProgramList.map(x => x.plist_id));
      const currentSet = new Set(vm.tempAllowedProgramPlistIdList);
      return !isEqual(originalAllowedPlistIdSet, currentSet);
    },
  },
  async mounted() {
    const vm = this;
    const lectureId = Number.parseInt(vm.$route.params.lectureId, 10);
    await vm.getProgramLists({
      lectureId,
    });
    vm.tempAllowedProgramPlistIdList = vm.allowedProgramList.map(x => x.plist_id);
  },
};
</script>

