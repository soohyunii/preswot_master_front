<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="120px">
          <el-form-item label="제목" prop="scTitle">
            <!-- :disabled during loading.TITLE -->
            <el-input
              v-model.lazy="scTitle"
              @change="onChange('TITLE')"
            ></el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TITLE" />

          <el-form-item label="활성화 시각" prop="scStartDate">
            <el-date-picker
              v-model.lazy="scStartDate"
              type="datetime"
              @change="onChange('START_DATE')"
            >
            </el-date-picker>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.START_DATE" />


          <el-form-item label="비활성화 시각" prop="scEndDate">
            <el-date-picker
              v-model.lazy="scEndDate"
              type="datetime"
              @change="onChange('END_DATE')"
            >
            </el-date-picker>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.END_DATE" />


          <el-form-item label="타입" prop="scType">
            <el-radio-group
              v-model.lazy="scType"
              @change="onChange('TYPE')"
            >
              <el-radio-button label="강의"></el-radio-button>
              <el-radio-button label="숙제"></el-radio-button>
              <el-radio-button label="퀴즈"></el-radio-button>
              <el-radio-button label="시험"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.TYPE" />

          <el-form-item label="설명" prop="scDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model.lazy="scDescription"
              placeholder="dd"
              @change="onChange('DESCRIPTION')"
            >
            </el-input>
          </el-form-item>
          <i class="el-icon-loading" v-if="loading.DESCRIPTION" />
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

// function delay(delayMillisec) {
//   return new Promise((fulfill) => {
//     setTimeout(fulfill, delayMillisec);
//   });
// }

export default {
  name: 'ScEditor',
  data() {
    return {
      loading: {
        TITLE: false,
        START_DATE: false,
        END_DATE: false,
        TYPE: false,
        DESCRIPTION: false,
      },
    };
  },
  computed: {
    input() {
      const res = {};
      const vm = this;
      res.scTitle = vm.scTitle;
      res.scType = vm.scType;
      res.scDescription = vm.scDescription;
      return res;
    },
    scTitle: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scTitle;
      },
      set(scTitle) {
        const vm = this;
        vm.updateScTitle({
          scTitle,
        });
      },
    },
    scStartDate: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scStartDate;
      },
      set(scStartDate) {
        const vm = this;
        vm.updateScStartDate({
          scStartDate,
        });
      },
    },
    scEndDate: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scEndDate;
      },
      set(scEndDate) {
        const vm = this;
        vm.updateScEndDate({
          scEndDate,
        });
      },
    },
    scType: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scType;
      },
      set(scType) {
        const vm = this;
        vm.updateScType({
          scType,
        });
      },
    },
    scDescription: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scDescription;
      },
      set(scDescription) {
        const vm = this;
        vm.updateScDescription({
          scDescription,
        });
      },
    },
  },
  methods: {
    ...mapMutations('sc', [
      'updateScTitle',
      'updateScDescription',
      'updateScType',
      'updateScStartDate',
      'updateScEndDate',
    ]),
    ...mapActions('teacher', [
      'putScTitle',
      'putScStartDate',
      'putScEndDate',
      'putScType',
      'putScDescription',
      'putSc',
    ]),
    async onChange(type) {
      const vm = this;
      try {
        vm.loading[type] = true;
        await vm.putSc();
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
};
</script>
