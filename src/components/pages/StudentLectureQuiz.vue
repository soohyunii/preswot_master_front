<template>
  <div id="student_lecture_quiz_wrapper" class="bt-container">
    <h2 class ="page-title">
      문제 출제
    </h2>
    <el-table :data="quizData" height="400">
      <el-table-column prop="index" label="번호" align="center" width="100">
      </el-table-column>
      <el-table-column prop="type" label="문항 유형" align="center" width="150">
      </el-table-column>
      <el-table-column prop="name" label="문제 이름" align="center" width="200">
      </el-table-column>
      <el-table-column prop="date" label="제출 시간" align="center" width="350">
      </el-table-column>
      <el-table-column label="수정" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="small" @click="onClick('MODIFY', scope.row)">수정</el-button>
        </template>
      </el-table-column>
      <el-table-column label="미리보기" align="center" width="130">
        <template slot-scope="scope">
          <el-button size="small" @click="onClick('PREVIEW', scope.row)">미리보기</el-button>
        </template>
      </el-table-column>
      <el-table-column label="삭제" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="onClick('DELETE', scope.row)">삭제</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="ps-align-right">
      <el-select v-model="typeVal" placeholder="선택">
        <el-option v-for="qtype in qtypes" :key="qtype.typeVal" :value="qtype.typeVal">
        </el-option>
      </el-select>
      <el-button type="primary" @click="onSubmit">출제하기</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StudentLectureQuiz',
    data() {
      return {
        quizData: [{
          index: '1',
          type: '객관',
          name: '2014147515_001',
          date: '2019-01-14 15:06',
        }, {
          index: '2',
          type: '객관',
          name: '2014147515_002',
          date: '2019-01-14 16:12',
        }],
        qtypes: [{
          typeVal: '단답',
        }, {
          typeVal: '객관',
        }],
        typeVal: '',
      };
    },
    methods: {
      onClick(type) {
        const vm = this;
        switch (type) {
          case 'MODIFY' : {
            vm.$notify({
              title: '제출 완료',
              message: '수정',
              type: 'success',
            });
            break;
          }
          case 'PREVIEW' : {
            vm.$notify({
              title: '제출 완료',
              message: '미리보기',
              type: 'success',
            });
            break;
          }
          case 'DELETE' : {
            vm.$notify({
              title: '제출 완료',
              message: '삭제',
              type: 'success',
            });
            break;
          }
          default : {
            break;
          }
        }
      },
      onSubmit() {
        const vm = this;
        if (!this.typeVal) {
          vm.$notify({
            title: '제출 실패',
            message: '유형 선택 바람',
            type: 'warning',
          });
        } else {
          vm.$notify({
            title: '제출 완료',
            message: '출제 시작',
            type: 'success',
          });
        }
      },
    },
  };
</script>