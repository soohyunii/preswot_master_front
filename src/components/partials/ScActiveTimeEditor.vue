<template>
  <div>
    <!-- TODO: translation -->
    <h2>* 활성화 편집</h2>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="120px">
          <el-form-item label="순서">
            <el-radio-group
              v-model="scItemOrder"
              @change="onChange('ORDER')"
            >
              <el-radio-button :label="0">예습</el-radio-button>
              <el-radio-button :label="1">본강의</el-radio-button>
              <el-radio-button :label="2">복습</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.ORDER" />

          <el-form-item label="활성화 시각">
            <el-date-picker
              v-model="scItemStartDate"
              type="datetime"
              @change="onChange('START_DATE')"
            >
            </el-date-picker>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.START_DATE" />

          <el-form-item label="비활성화 시각">
            <el-date-picker
              v-model="scItemEndDate"
              type="datetime"
              :disabled="!shouldDeactivated"
              @change="onChange('END_DATE')"
            >
            </el-date-picker>
            <el-radio-group v-model="shouldDeactivated" @change="changeShouldDeactivated">
              <el-radio-button :label="true">비활성화</el-radio-button>
              <el-radio-button :label="false" :disabled="scItemOrder === 2">계속 활성화</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.END_DATE" />
          <div v-if="scItemOrder === 2" style="text-indent: 120px; color: red;">
            <h5>
              복습에는 비활성화 시각이 반드시 필요합니다.
              <span style="text-indent: 0px;">
              <el-tooltip class="item" effect="dark" content="이 시간을 기준으로 서버에서 자동채점이 수행됩니다" placement="right">
                <i class="el-icon-warning" />
              </el-tooltip>
              </span>
            </h5>
          </div>


          <el-form-item
            v-if="['문항', '설문'].includes(type)"
            :label="showingResultLabel"
          >
            <el-radio-group v-model="scItemIsResultVisible" @change="onChange('RESULT')">
              <el-radio-button :label="true">공개</el-radio-button>
              <el-radio-button :label="false">비공개</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.RESULT" />

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ScActiveTimeEditor',
  props: ['type'],
  data() {
    return {
      shouldDeactivated: true,
      loading: {
        ORDER: false,
        START_DATE: false,
        END_DATE: false,
        RESULT: false,
      },
    };
  },
  methods: {
    ...mapMutations('scItem', ['assignCurrentEditingScItem']),
    ...mapActions('scItem', ['putScItem']),
    changeShouldDeactivated(label) {
      const vm = this;
      if (!label) {
        vm.scItemEndDate = null;
      }
      vm.onChange('END_DATE');
    },
    async onChange(type) {
      const vm = this;
      try {
        vm.loading[type] = true;
        await vm.putScItem();
      } catch (error) {
        vm.$notify({
          title: '저장 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      } finally {
        vm.loading[type] = false;
      }
    },
  },
  computed: {
    ...mapState('sc', ['scStartDate']),
    ...mapState('scItem', ['sc']),
    ...mapGetters('scItem', ['currentEditingScItem']),
    input() {
      const res = {};
      const vm = this;
      res.scItemOrder = vm.scItemOrder;
      res.scItemStartDate = vm.scItemStartDate;
      res.scItemEndDate = vm.scItemEndDate;
      return res;
    },
    showingResultLabel() {
      const vm = this;
      if (vm.type === '설문') {
        return '설문결과';
      } else if (vm.type === '문항') {
        return '문항결과';
      }
      return null;
    },
    scItemOrder: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return 1;
        }
        return item.order;
      },
      set(scItemOrder) {
        const vm = this;
        if (scItemOrder === 2) {
          vm.shouldDeactivated = true;
        }
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
    scItemStartDate: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return null;
        }
        if (!vm.scStartDate) {
          return null;
        }
        const startOffsetSec = item.activeStartOffsetSec;
        if (!startOffsetSec) {
          return null;
        }
        // console.log('startOffsetSec', startOffsetSec);
        return new Date(vm.scStartDate.getTime() + (startOffsetSec * 1000));
      },
      set(scItemStartDate) {
        const vm = this;
        if (!vm.scStartDate) {
          vm.$notify({
            // TODO: translate
            title: '오류!',
            message: '활성화 시각이 비어있음',
            type: 'error',
          });
          return;
        }
        const scActiveStartDate = new Date(scItemStartDate);
        const offsetSec = (scActiveStartDate.getTime() - vm.scStartDate.getTime()) / 1000;
        vm.assignCurrentEditingScItem({
          currentEditingScItem: {
            activeStartOffsetSec: offsetSec,
          },
        });
      },
    },
    scItemEndDate: {
      get() {
        const vm = this;
        const item = vm.currentEditingScItem;
        if (!item) {
          return null;
        }
        if (!vm.scStartDate) {
          return null;
        }
        const endOffsetSec = item.activeEndOffsetSec;
        if (!endOffsetSec) {
          return null;
        }
        return new Date(vm.scStartDate.getTime() + (endOffsetSec * 1000));
      },
      set(scItemEndDate) {
        const vm = this;
        if (!vm.scStartDate) {
          vm.$notify({
            // TODO: translate
            title: '오류!',
            message: '활성화 시각이 비어있음',
            type: 'error',
          });
          return;
        }
        const scActiveEndDate = new Date(scItemEndDate);
        let offsetSec = (scActiveEndDate.getTime() - vm.scStartDate.getTime()) / 1000;
        if (!scItemEndDate) {
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
