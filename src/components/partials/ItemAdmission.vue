<template>
  <div>
    <el-form :model="manageForm" label-width="80px">
      <el-form-item label="문제 출제">
        <el-checkbox v-model="checked">출제 허용</el-checkbox>
      </el-form-item>
      <el-form-item label="문항 유형">
        <el-checkbox-group v-model="questionTypeList">
          <el-checkbox label="SHORT_ANSWER">단답</el-checkbox>
          <el-checkbox label="MULTIPLE_CHOICE">객관</el-checkbox>
          <el-checkbox label="DESCRIPTION">서술</el-checkbox>
          <el-checkbox label="SQL">SQL</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="최대 갯수">
        <el-input-number v-model="maxNum" :min="1" :max="5"> </el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">제출</el-button>
        <el-button>취소</el-button>
      </el-form-item>
    </el-form>
    <br>
    <h2>학생 출제 리스트</h2>
    <el-table :data="studentQuizList" height="400">
      <el-table-column type="index" label="번호" align="center" width="100"> </el-table-column>
      <el-table-column prop="student_id" label="학번" align="center" width="150"> </el-table-column>
      <el-table-column prop="type" label="문항 유형" align="center" width="150"> </el-table-column>
      <el-table-column prop="name" label="문항 이름" align="center" width="200"> </el-table-column>
      <el-table-column prop="submitTime" label="최초 제출 시간" align="center" width="200"> </el-table-column>
      <el-table-column label="선택/해제" align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="onClick(scope.$index)" size="small">버튼</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="isCheck" label="상태" align="center" width="150"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import studentService from '../../services/studentService';

export default {
  name: 'ItemAdmission',
  data() {
    return {
      questionTypeList: [],
      checked: false,
      maxNum: 1,
      studentQuizList: [],
      checkbox: [],
    };
  },
  async mounted() {
    const vm = this;
    const lid = vm.$route.params.lectureId;
    const res = await studentService.getQuestion({ id: lid });
    for (let i = 0; i < res.data.length; i += 1) {
      vm.studentQuizList.push(res.data[i]);
      const date = new Date(res.data[i].createdAt);
      vm.studentQuizList[i].submitTime = date.toString().split(' GMT')[0];
      if (res.data[i].type === 0) {
        vm.studentQuizList[i].type = '객관';
      } else if (res.data[i].type === 1) {
        vm.studentQuizList[i].type = '단답';
      } else if (res.data[i].type === 2) {
        vm.studentQuizList[i].type = '서술';
      } else if (res.data[i].type === 4) {
        vm.studentQuizList[i].type = 'SQL';
      }
      if (res.data[i].isCheck === 0) {
        vm.studentQuizList[i].isCheck = '선택 안됨';
      } else {
        vm.studentQuizList[i].isCheck = '선택됨';
      }
    }
  },
  methods: {
    onSubmit() {
      const vm = this;
      if (this.checked) {
        if (this.questionTypeList.length !== 0) {
          vm.$notify({
            title: 'Submint',
            message: '출제 허용함',
            type: 'success',
          });
        } else {
          vm.$notify({
            title: 'Warning',
            message: '문항 유형을 설정하십시오',
            type: 'warning',
          });
        }
      } else {
        vm.$notify({
          title: 'Submit',
          message: '출제 허용하지 않음',
          type: 'success',
        });
      }
    },
    async onClick(index) {
      const vm = this;
      const lid = vm.$route.params.lectureId;
      const res = await studentService.getQuestion({ id: lid });
      if (!res.data[index].isCheck) {
        await studentService.putQuestion({
          id: lid,
          qId: res.data[index].student_question_id,
          isCheck: 1,
        });
        vm.$message.success('해당 문항을 선택합니다');
        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        await studentService.putQuestion({
          id: lid,
          qId: res.data[index].student_question_id,
          isCheck: 0,
        });
        vm.$message.warning('해당 문항의 선택을 해제합니다');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    },
  },
};
</script>