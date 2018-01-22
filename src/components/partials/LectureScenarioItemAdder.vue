<template>
  <div>
    <el-row>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('문제지')">
          <i class="el-icon-question"></i><br/>문제지
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('강의자료')">
          <i class="el-icon-info"></i><br/>강의자료
        </el-button>
      </el-col>
      <el-col align="center" :span="6">
        <!-- TODO: Translate, change icon -->
        <el-button @click="onClick('숙제')">
          <i class="el-icon-document"></i><br/>숙제
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

<style lang="scss" scoped>

</style>


<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LectureScenarioItemAdder',
  methods: {
    ...mapMutations('teacher', ['pushLectureElement']),
    onClick(type) {
      const vm = this;
      const validTypeList = ['문제지', '강의자료', '숙제'];
      if (validTypeList.includes(type)) {
        vm.pushLectureElement({
          type,
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