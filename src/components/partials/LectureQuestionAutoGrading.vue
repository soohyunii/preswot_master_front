<template>
  <div>
    <div v-if="page === 0">
      <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      <h5>학생 최소 지지도 비율 (0~1 사이 실수)</h5>
      <el-input v-model="argument"></el-input>
      <el-button type="primary" @click="onClick('EXTRACT_ANSWER')">채점용 답안 추출</el-button>
    </div>
    <div v-if="page === 1">
      <h3>잠시만 기다려주세요...</h3>
      <i style="font-size: 30px" class="fas el-icon-loading"></i>
    </div>
    <div v-if="page === 2">
      <el-row>
        <el-col :span="12">
          <h5>강사 답안 기준 자동채점</h5>
          <el-table :data="test1">
            <el-table-column label="단어" prop="word">
            </el-table-column>
            <el-table-column label="중요도" prop="score">
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button type="danger">불용어 추가</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <h5>학생 답안 기준 자동채점</h5>
          <el-table :data="test2">
            <el-table-column label="단어" prop="word">
            </el-table-column>
            <el-table-column label="중요도" prop="score">
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button type="danger">불용어 추가</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-button type="primary">채점하기</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LectureQuestionAutoGrading',
  data() {
    return {
      test1: '',
      test2: '',
      page: 0,
      argument: '',
    };
  },
  methods: {
    onClick(type) {
      const vm = this;
      switch (type) {
        case 'BACK': {
          break;
        }
        case 'EXTRACT_ANSWER': {
          vm.page = 1;
          setTimeout(() => {
            vm.page = 2;
          }, 2000);
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
  },
};
</script>

<style>

</style>
