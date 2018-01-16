<template>
  <el-row :gutter="20">
    <el-col>
      <div class="grid-content bg-white">
        <!-- TODO: translate -->
        강의 목록<hr>
        <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
          prop="num"
          label="번호"
          sortable
          width="70">
        </el-table-column>
        <el-table-column
          prop="type"
          label="분류"
          sortable
          width="70">
          <template slot-scope="typeScope">
            <el-tag
              :type="getType(typeScope.row.type).type">
              {{ getType(typeScope.row.type).name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="lectureType"
          label="강의 타입"
          sortable>
        </el-table-column>
        <el-table-column
          prop="teacher"
          label="강사"
          sortable>
        </el-table-column>
        <el-table-column
          prop="scenarioName"
          label="시나리오명"
          sortable>
        </el-table-column>
        <el-table-column
          prop="date"
          label="기간"
          sortable>
        </el-table-column>
        <el-table-column
          prop="student"
          label="참여 수강생 수"
          sortable
          width="130">
        </el-table-column>
        <el-table-column
          prop="understanding"
          label="수강생 이해도 (평균)"
          sortable>
          <template slot-scope="scope">
          <el-progress
            v-if="scope.row.understanding === 100"
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.understanding"
            status="success">
          </el-progress>
          <el-progress
            v-else-if="scope.row.understanding > 70"
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.understanding">
          </el-progress>
          <el-progress
            v-else
            :text-inside="true"
            :stroke-width="18"
            :percentage="scope.row.understanding"
            status="exception">
          </el-progress>
          </template>
        </el-table-column>
        </el-table>

        <el-col align="center">
          <!-- TODO: Link to class scenarion adding page -->
          <router-link to="/a/teacher/lecture/new"> <!-- Link is Wrong -->
          <br /><br />
          <el-button>과목 시나리오 추가</el-button>
          </router-link>
        </el-col>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'LectureList',
  props: ['tableData'],
  methods: {
    getType(type) {
      // 과목 시나리오 유형 분류 {{ A: 강의, B: 숙제, C: 퀴즈, D: 시험 }}
      // TODO: Translate
      switch (type) {
        default:
        case 'A':
          return {
            name: '강의',
            type: '',
          };
        case 'B':
          return {
            name: '숙제',
            type: 'warning',
          };
        case 'C':
          return {
            name: '퀴즈',
            type: 'danger',
          };
        case 'D':
          return {
            name: '시험',
            type: 'info',
          };
      }
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
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>