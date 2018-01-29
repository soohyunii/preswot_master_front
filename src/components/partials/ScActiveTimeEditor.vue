<template>
  <div>
    <!-- TODO: translation -->
    <h2>활성화 시간 입력</h2>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="120px">
          <el-form-item label="순서">
            <el-radio-group v-model="scItemOrder">
              <el-radio-button label="예습"></el-radio-button>
              <el-radio-button label="본강의"></el-radio-button>
              <el-radio-button label="복습"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
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
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ScActiveTimeEditor',
  data() {
    return {
      defaultTime: new Date(0, 0, 0),
      scItemOrder: '본강의', // TODO: delete
    };
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex']),
    input() {
      const res = {};
      const vm = this;
      res.scItemOrder = vm.scItemOrder;
      res.scItemActiveStartDatetime = vm.scItemActiveStartDatetime;
      res.scItemActiveEndtDatetime = vm.scItemActiveEndtDatetime;
      return res;
    },
    activeTime: {
      get() {
        const vm = this;
        let time = null;
        const index = vm.currentEditingScItemIndex;
        if (index !== null && index > -1) {
          time = vm.sc[vm.currentEditingScItemIndex].activeTime;
        }
        return time || new Date(0, 0, 0);
      },
      set(activeTime) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            activeTime,
          },
        });
      },
    },
    activeDurationTime: {
      get() {
        const vm = this;
        let time = null;
        const index = vm.currentEditingScItemIndex;
        if (index !== null && index > -1) {
          time = vm.currentEditingScItem.activeDurationTime;
        }
        return time || new Date(0, 0, 0);
      },
      set(activeDurationTime) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            activeDurationTime,
          },
        });
      },
    },
    historyMode: {
      get() {
        const vm = this;
        let mode = null;
        const index = vm.currentEditingScItemIndex;
        if (index !== null && index > -1) {
          mode = vm.currentEditingScItem.scHistoryMode;
        }
        return mode || true;
      },
      set(scHistoryMode) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            scHistoryMode,
          },
        });
      },
    },
    showingResultMode: {
      get() {
        const vm = this;
        let mode = null;
        const index = vm.currentEditingScItemIndex;
        if (index !== null && index > -1) {
          mode = vm.currentEditingScItem.isShowingResult;
        }
        return mode || true;
      },
      set(isShowingResult) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            isShowingResult,
          },
        });
      },
    },
  },
};
</script>
