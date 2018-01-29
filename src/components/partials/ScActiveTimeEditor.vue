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

          <el-form-item label="활성화 시각">
            <el-date-picker
              v-model="activeDatetimeInterval"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="To"
              start-placeholder="시작"
              end-placeholder="종료"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
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
    const vm = this;
    return {
      defaultTime: vm.scStartDatetime,
      scItemOrder: '본강의', // TODO: delete
      activeDatetimeInterval: null,
    };
  },
  mounted() {
    const vm = this;
    vm.$watch('activeDatetimeInterval', (newVal) => {
      if (newVal) {
        if (newVal[0]) {
          vm.updateCurrentEditingScItem({
            currentEditingScItem: {
              activeStartDatetime: newVal[0],
            },
          });
        }
        if (newVal[1]) {
          vm.updateCurrentEditingScItem({
            currentEditingScItem: {
              activeEndDatetime: newVal[1],
            },
          });
        }
      }
    }, {
      deep: true,
    });
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex', 'scStartDatetime']),
    ...mapGetters('teacher', ['currentEditingScItem']),
    input() {
      const res = {};
      const vm = this;
      res.scItemOrder = vm.scItemOrder;
      res.scItemActiveStartDatetime = vm.scItemActiveStartDatetime;
      res.scItemActiveEndtDatetime = vm.scItemActiveEndtDatetime;
      return res;
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
