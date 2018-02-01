<template>
  <div>
    <!-- TODO: translation -->
    <h2>* 활성화 편집</h2>
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

          <el-form-item label="활성화 시작 시각">
            <el-date-picker
              v-model="scActiveStartDatetime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="활성화 종료 시각">
            <el-date-picker
              v-model="scActiveEndDatetime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="!shouldDeactivated"
            >
            </el-date-picker>
            <el-radio-group v-model="shouldDeactivated" @change="changeShouldDeactivated">
              <el-radio-button :label="true">비활성화</el-radio-button>
              <el-radio-button :label="false">계속 활성화</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="선지별 선택 비율">
            <el-radio-group v-model="scItemIsResultVisible">
              <el-radio-button :label="true">보이기</el-radio-button>
              <el-radio-button :label="false">숨기기</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import utils from '../../utils';

export default {
  name: 'ScActiveTimeEditor',
  data() {
    return {
      shouldDeactivated: true,
    };
  },
  methods: {
    ...mapMutations('teacher', ['assignCurrentEditingScItem']),
    changeShouldDeactivated(label) {
      const vm = this;
      if (!label) {
        vm.scActiveEndDatetime = null;
      }
    },
  },
  computed: {
    ...mapState('teacher', ['sc', 'scStartDatetime']),
    ...mapGetters('teacher', ['currentEditingScItem']),
    input() {
      const res = {};
      const vm = this;
      res.scItemOrder = vm.scItemOrder;
      res.scActiveStartDatetime = vm.scActiveStartDatetime;
      res.scActiveEndDatetime = vm.scActiveEndDatetime;
      return res;
    },
    scItemOrder: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return '본강의';
        }
        return item.order;
      },
      set(scItemOrder) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            order: scItemOrder,
          },
        });
      },
    },
    scItemIsResultVisible: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return true;
        }
        return item.isResultVisible;
      },
      set(scItemIsResultVisible) {
        const vm = this;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            isResultVisible: scItemIsResultVisible,
          },
        });
      },
    },
    scActiveStartDatetime: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return null;
        }
        if (!vm.scStartDatetime) {
          return null;
        }
        const scStartDate = new Date(vm.scStartDatetime);
        const startOffsetSec = item.activeStartOffsetSec;
        if (!startOffsetSec) {
          return null;
        }
        // console.log('startOffsetSec', startOffsetSec);
        const resDate = new Date(scStartDate.getTime() + (startOffsetSec * 1000));
        return utils.formatDate(resDate);
      },
      set(scActiveStartDatetime) {
        const vm = this;
        if (!vm.scStartDatetime) {
          vm.$notify({
            // TODO: translate
            title: '오류!',
            message: '활성화 시각이 비어있음',
            type: 'error',
          });
          return;
        }
        const scStartDate = new Date(vm.scStartDatetime);
        const scActiveStartDate = new Date(scActiveStartDatetime);
        const offsetSec = (scActiveStartDate.getTime() - scStartDate.getTime()) / 1000;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            activeStartOffsetSec: offsetSec,
          },
        });
      },
    },
    scActiveEndDatetime: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return null;
        }
        if (!vm.scStartDatetime) {
          return null;
        }
        const scStartDate = new Date(vm.scStartDatetime);
        const endOffsetSec = item.activeEndOffsetSec;
        if (!endOffsetSec) {
          return null;
        }
        const resDate = new Date(scStartDate.getTime() + (endOffsetSec * 1000));
        return utils.formatDate(resDate);
      },
      set(scActiveEndDatetime) {
        const vm = this;
        if (!vm.scStartDatetime) {
          vm.$notify({
            // TODO: translate
            title: '오류!',
            message: '활성화 시각이 비어있음',
            type: 'error',
          });
          return;
        }
        const scStartDate = new Date(vm.scStartDatetime);
        const scActiveEndDate = new Date(scActiveEndDatetime);
        let offsetSec = (scActiveEndDate.getTime() - scStartDate.getTime()) / 1000;
        if (!scActiveEndDatetime) {
           // * 계속 활성화를 눌렀을 때 scActiveDatetime이 null로 들어오는데, 그 처리.
          offsetSec = null;
        }
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            activeEndOffsetSec: offsetSec,
          },
        });
      },
    },
  },
};
</script>
