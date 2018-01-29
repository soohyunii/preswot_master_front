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

          <el-form-item label="선지별 선택 비율">
            <el-radio-group v-model="scItemIsResultVisible">
              <el-radio-button label="true">보이기</el-radio-button>
              <el-radio-button label="false">숨기기</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
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
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            isResultVisible: scItemIsResultVisible,
          },
        });
      },
    },
  },
};
</script>
