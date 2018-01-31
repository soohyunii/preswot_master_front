<template>
  <div>
    <h1>과목 생성</h1>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="140px">
          <el-form-item label="과목 제목">
            <el-input v-model="test"></el-input>
          </el-form-item>

          <el-form-item label="강사 목록">
            <el-input v-model="test"></el-input>
          </el-form-item>

          <el-form-item label="과목 소개">
            <el-input type="textarea" :rows="3" v-model="test"></el-input>
          </el-form-item>

          <el-form-item label="과목 활성화 시작 시각">
            <el-date-picker
              v-model="test"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="과목 활성화 종료 시각">
            <el-date-picker
              v-model="test"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TeacherClassNew',
  data() {
    return {
      test: '',
    };
  },
  computed: {
    input() {
      return {};
    },
  },
};
</script>
