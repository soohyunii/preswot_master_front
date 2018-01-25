<template>
  <div>
    <!-- TODO: translation -->
    <h2>활성화 시간 입력</h2>
    <el-row>
      <el-col :span="6">
        활성화 되는 시각
      </el-col>
      <el-col :span="6">
        <el-time-picker v-model="activeTime" :default-value="defaultTime" :clearable="false" placeholder="00:00:00" />
      </el-col>

      <el-col :span="6">
        활성화 지속 시간
      </el-col>
      <el-col :span="6">
        <el-time-picker v-model="activeDurationTime" :default-value="defaultTime" :clearable="false" format="mm분 ss초" placeholder="0분 0초" />
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="6">
        History 기능 : <br/>
        {{ scHistoryMode }}
      </el-col>
      <el-col :span="6">
        <el-radio-group v-model="historyMode">
          <el-radio-button label="true">켜기</el-radio-button>
          <el-radio-button label="false">끄기</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ScActiveTimeEditor',
  data() {
    // TODO: translate
    return {
      defaultTime: new Date(0, 0, 0),
    };
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem', 'updateHistoryMode']),
    onClick(type) {
      const vm = this;
      vm.updateHistoryMode({
        mode: type,
      });
    },
  },
  computed: {
    ...mapState('teacher', ['currentEditingScItem', 'currentEditingScItemIndex', 'scHistoryMode']),
    activeTime: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.activeTime || new Date(0, 0, 0);
        }
        return new Date(0, 0, 0);
      },
      set(activeTime) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            activeTime,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    activeDurationTime: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.activeDurationTime || new Date(0, 0, 0);
        }
        return new Date(0, 0, 0);
      },
      set(activeDurationTime) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            activeDurationTime,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    historyMode: {
      get() {
        const vm = this;
        return vm.scHistoryMode;
      },
      set(value) {
        const vm = this;
        vm.updateHistoryMode({
          mode: value,
        });
      },
    },
  },
};
</script>
