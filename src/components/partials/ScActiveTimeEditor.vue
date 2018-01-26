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
        History 기능 :
      </el-col>
      <el-col :span="6">
        <el-radio-group v-model="historyMode">
          <el-radio-button label="true">켜기</el-radio-button>
          <el-radio-button label="false">끄기</el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col :span="6">
        선지별 선택비율 보이기 :
      </el-col>
      <el-col :span="6">
        <el-radio-group v-model="showingResultMode">
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
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    ...mapState('teacher', ['sc', 'currentEditingScItem', 'currentEditingScItemIndex']),
    activeTime: {
      get() {
        const vm = this;
        let time = null;
        if (vm.currentEditingScItemIndex !== null) {
          time = vm.sc[vm.currentEditingScItemIndex].activeTime;
        }
        if (time) {
          return time || new Date(0, 0, 0);
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
        let time = null;
        if (vm.currentEditingScItemIndex !== null) {
          time = vm.sc[vm.currentEditingScItemIndex].activeDurationTime;
        }
        if (time) {
          return time || new Date(0, 0, 0);
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
        let mode = null;
        if (vm.currentEditingScItemIndex !== null) {
          mode = vm.sc[vm.currentEditingScItemIndex].scHistoryMode;
        }
        if (mode) {
          return mode || true;
        }
        return true;
      },
      set(scHistoryMode) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            scHistoryMode,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
    showingResultMode: {
      get() {
        const vm = this;
        let mode = null;
        if (vm.currentEditingScItemIndex !== null) {
          mode = vm.sc[vm.currentEditingScItemIndex].isShowingResult;
        }
        if (mode) {
          return mode || true;
        }
        return true;
      },
      set(isShowingResult) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            isShowingResult,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
};
</script>
