<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="120px">
          <el-form-item label="제목" prop="scTitle">
            <el-input v-model="scTitle"></el-input>
          </el-form-item>

          <el-form-item label="참여 강사" prop="scTeacherList">
            <el-input v-model="scTeacherList"></el-input>
          </el-form-item>

          <el-form-item label="활성화 시각" prop="scStartDatetime">
            <el-date-picker
              v-model="scStartDatetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="타입" prop="scType">
            <el-radio-group v-model="scType">
              <el-radio-button label="강의"></el-radio-button>
              <el-radio-button label="숙제"></el-radio-button>
              <el-radio-button label="퀴즈"></el-radio-button>
              <el-radio-button label="시험"></el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="설명" prop="scDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model="scDescription"
              placeholder="dd"
            >
            </el-input>
          </el-form-item>

          <!-- TODO: implement 지식맵 -->
          <el-form-item label="지식맵" prop="scDescription">
            <el-input
              type="textarea"
              :rows="3"
              v-model="scDescription"
              placeholder="dd"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ScEditor',
  data() {
    return {};
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
    scStartDatetime: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scStartDatetime;
      },
      set(scStartDatetime) {
        const vm = this;
        vm.updateScStartDatetime({
          scStartDatetime,
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
    scTeacherList: {
      get() {
        const vm = this;
        return vm.$store.state.teacher.scTeacherList;
      },
      set(scTeacherList) {
        const vm = this;
        vm.updateScTeacherList({
          scTeacherList,
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
    ...mapMutations('teacher', [
      'updateScTitle',
      'updateScDescription',
      'updateScType',
      'updateScStartDatetime',
      'updateScTeacherList',
    ]),
  },
};
</script>
