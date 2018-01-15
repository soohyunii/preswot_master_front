<template>
  <div>
    <h1>Lecture Element Sequence Template</h1>
    <el-row :gutter="10">
      <template v-for="(item, index, key) in lectureElementSequence">
        <el-col :span="3" :key="key" align="center">
          <!-- TODO: change icons -->
          <!-- TODO: Translate tooltip -->
          <i :class="getIconsByType(item.type)" style="font-size: 50px;"></i>
          <i class="el-icon-error" style="color:red; vertical-align:top" @click="onClick(index)"></i><br/>
          <!-- TODO: change bg color, time variable -->
          <el-tag color="#DCDFE6">time</el-tag><br/>

          <!-- TODO: change bg color, duration variable -->
          <el-tag color="#F2F6FC">duration</el-tag><br/>
        </el-col>
        <el-col :span="1" :key="key" align="center" v-if="index + 1 < Object.keys(lectureElementSequence).length">
          <br/><br/>
          <i class="el-icon-minus" style="font-size: 30px;"/>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LectureElementSequnce',
  computed: {
    ...mapState('teacher', ['lectureElementSequence']),
  },
  methods: {
    // TODO: edit lecture element
    // TODO: add drag/drop function
    ...mapMutations('teacher', ['deleteLectureElement']),
    onClick(index) {
      const vm = this;
      if (index < Object.keys(vm.lectureElementSequence).length) {
        vm.deleteLectureElement({
          lectureElementIndex: index,
        });
      }
      window.console.log(index);
    },
    getIconsByType(type) {
      let icon;
      switch (type) {
        case 'A': {
          icon = 'el-icon-question';
          break;
        }
        case 'B': {
          icon = 'el-icon-info';
          break;
        }
        case 'C': {
          icon = 'el-icon-document';
          break;
        }
        case 'D':
        default: {
          icon = 'el-icon-setting';
          break;
        }
      }
      return icon;
    },
  },
};
</script>
