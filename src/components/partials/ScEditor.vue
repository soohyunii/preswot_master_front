<template>
  <div>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="120px">
          <el-form-item label="제목" prop="scTitle">
            <el-input v-model="scTitle"></el-input>
          </el-form-item>

          <el-form-item label="타입" prop="scType">
            <!-- TODO: replace el-input with radio button -->
            <el-input v-model="scType"></el-input>
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
    ...mapMutations('teacher', [
      'updateScTitle',
      'updateScDescription',
      'updateScType',
    ]),
  },
};
</script>
