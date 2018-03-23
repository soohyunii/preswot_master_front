<template>
  <div>
    <el-row>
      <el-transfer
    v-model="scAcceptPlist"
    filterable
    :titles="['프로그램 리스트', '허용된 프로그램']"
    @change="handleChange"
    :data="scAvailablePlist">
  </el-transfer>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'ScAcceptPlist',
  data() {
    return {
      value3: [1],
    };
  },
  methods: {
    ...mapActions('sc', [
      'getSc', 'postScplist',
    ]),
    ...mapMutations('sc', [
      'updateScAcceptPlist',
    ]),
    handleChange() {
      const vm = this;
      vm.postScplist();
    },
  },
  computed: {
    ...mapState('sc', [
      'scAvailablePlist',
    ]),
    scAcceptPlist: {
      get() {
        const vm = this;
        return vm.$store.state.sc.scAcceptPlist;
      },
      set(scAcceptPlist) {
        const vm = this;
        vm.updateScAcceptPlist({
          scAcceptPlist,
        });
      },
    },
  },
};
</script>
