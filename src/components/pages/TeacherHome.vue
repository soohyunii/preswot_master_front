<template>
  <div>
    <el-container class="outline">
      <el-aside width="100px">
        <el-row>
          파이썬 초급
        </el-row>
        <el-row>
          자바
        </el-row>
        <el-row>
          <i class="el-icon-circle-plus-outline"></i>
          과목 추가
        </el-row>
      </el-aside>
      <el-main>
        자바<hr>
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />
        <el-row :gutter="20">
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
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.understanding"></el-progress>
                  </template>
                </el-table-column>
              </el-table>
              <router-link to="/a/teacher/lecture/new">
                <br /><br />
                <div style="text-align: center;" @clink="onClick('NEW')">
                  <i class="el-icon-circle-plus-outline"></i>
                  강의 시나리오 추가
                </div>
              </router-link>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-white">수강생 목록<hr></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <div class="grid-content bg-white">과목 통계<hr></div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'TeacherHome',
  data() {
    return {
      tableData: [{
        num: '1',
        date: '2016-05-01',
        name: '1강',
        understanding: 95,
      }, {
        num: '2',
        date: '2016-05-02',
        name: '2강',
        understanding: '86',
      }, {
        num: '3',
        date: '2016-05-04',
        name: '3강',
        understanding: '57',
      }],
    };
  },
};
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: rgb(255, 255, 255);
    color: #333;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .bg-white {
    background-color: rgb(255, 255, 255);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 300px;
    padding: 25px;
    margin-bottom: 30px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>