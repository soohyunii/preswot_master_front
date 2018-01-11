<template>
  <div>
    <el-container class="outline">
      <el-aside width="150px">
        <!-- TODO: translation -->
        <el-row>
          파이썬 초급
        </el-row>
        <!-- TODO: translation -->

        <el-row>
          자바
        </el-row>
        <el-row>
          <!-- TODO: Implement adding lecture part -->
          <!-- TODO: translation -->
          <el-button>과목 추가</el-button>
        </el-row>
      </el-aside>
      <el-main>
        <!-- TODO: translation -->
        <h3>자바</h3><hr>
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-white">
              <!-- TODO: translation -->
              강의 시나리오 목록<hr>
              <el-table
                :data="tableData"
                style="width: 100%">
                <!-- TODO: translation -->
                <el-table-column
                  prop="num"
                  label="번호"
                  sortable
                  width="180">
                </el-table-column>
                <!-- TODO: translation -->
                <el-table-column
                  prop="name"
                  label="강의 시나리오"
                  sortable
                  width="180">
                </el-table-column>
                <!-- TODO: translation -->
                <el-table-column
                  prop="date"
                  label="강의 날짜"
                  sortable>
                </el-table-column>
                <!-- TODO: translation -->
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
                <!-- TODO: translation -->
                <el-button>강의 시나리오 추가</el-button>
              </router-link>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-white">
              <!-- TODO: translation -->
              <el-col :span="16">수강생 목록</el-col>
              <el-col :span="8" style="text-align: right;">8명</el-col>
              <hr>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <!-- TODO: translation -->
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
        date: '2018-01-02',
        name: '1강',
        understanding: 100,
      }, {
        num: '2',
        date: '2018-01-09',
        name: '2강',
        understanding: 86,
      }, {
        num: '3',
        date: '2018-01-13',
        name: '3강',
        understanding: 57,
      }, {
        num: '4',
        date: '2018-01-15',
        name: '4강',
        understanding: 72,
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
    min-height: 340px;
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