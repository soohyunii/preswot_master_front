<template>
  <div>
    <el-row>
      <el-col :span="6">
        <!-- TODO: translate -->
        제목
      </el-col>
      <el-col :span="18">
        <!-- TODO: translate -->
        <el-input placeholder="제목" v-model="scTitle"></el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <!-- TODO: translation -->
        설명
      </el-col>
      <el-col :span="18">
        <!-- TODO: translation -->
        <el-input
          type="textarea"
          :rows="3"
          v-model="scDescription"
          placeholder="dd"
        >
          <!-- v-model="description" -->
        </el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <!-- TODO: translation -->
        지식맵
      </el-col>
      <el-col :span="18">
        <!-- TODO: translation -->
        <!-- TODO: implement 지식맵 -->
        <el-input
          type="textarea"
          :rows="3"
          v-model="scDescription"
          placeholder="dd"
        >
        </el-input>
      </el-col>
    </el-row>
    {{ scTitle }}
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
    ...mapMutations('teacher', ['updateScTitle', 'updateScDescription']),
  },
};
</script>
