<template>
    <el-col :span="16">
    <div class="grid-content bg-white">
        강의 시나리오 목록<hr>
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="num"
            label="번호"
            sortable
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="강의 시나리오"
            sortable
            width="180">
        </el-table-column>
        <el-table-column
            prop="date"
            label="강의 날짜"
            sortable>
        </el-table-column>
        <el-table-column
            prop="understanding"
            label="수강생 이해도(평균)"
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
        <router-link to="/a/teacher/lecture/new">
        <br /><br />
        <el-button>강의 시나리오 추가</el-button>
        </router-link>
    </div>
    </el-col>
</template>

<script>
export default {
  name: 'LectureList',
  props: ['tableData'],
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