<template>
  <div class="grid-content bg-white">
    <h1>Lecture Element Group template</h1>
    <el-row :gutter="10">
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('A')">
          <i class="el-icon-question" style="font-size: 50px;"></i><br/>문항설문
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('B')">
          <i class="el-icon-info" style="font-size: 50px;"></i><br/>강의자료
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('C')">
          <i class="el-icon-document" style="font-size: 50px;"></i><br/>숙제
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('D')">
          <i class="el-icon-setting" style="font-size: 50px;"></i><br/>코딩
        </el-button>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="8">
        <hr/>
      </el-col>
      <!-- TODO: Translate -->
      <el-col :span="8" align="center">
        시퀀스 저작 도구
      </el-col>
      <el-col :span="8">
        <hr/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LectureScenarioItemAdder',
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

<style scoped>
  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>