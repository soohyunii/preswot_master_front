<template>
  <div>
    <h1>Lecture Element Group template</h1>
    <el-button @click="onClick('A')">Type A</el-button>
    <el-button @click="onClick('B')">Type B</el-button>
    <el-button @click="onClick('C')">Type C</el-button>
    <el-button @click="onClick('D')">Type D</el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LectureElementButtonGroup',
  methods: {
    ...mapMutations('teacher', ['pushLectureElement']),
    onClick(type) {
      const vm = this;
      const validTypeList = ['A', 'B', 'C', 'D'];
      if (validTypeList.includes(type)) {
        vm.pushLectureElement({
          lectureElement: {
            type,
          },
        });
      } else {
        throw new Error(`not defined type ${type}`);
      }
      // switch (type) {
      //   case 'A': {
      //     break;
      //   }
      //   case 'B': {
      //     break;
      //   }
      //   case 'C': {
      //     break;
      //   }
      //   case 'D': {
      //     break;
      //   }
      //   default: {
      //     throw new Error(`not defined type ${type}`);
      //   }
      // }
    },
  },
};
</script>
