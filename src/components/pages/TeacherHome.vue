<template>
  <div>
    <el-container class="outline">
      <el-aside width="150px">
        <!-- TODO: Implement dummy response about class list -->
        <el-row>
          파이썬 초급
        </el-row>

        <el-row>
          자바
        </el-row>
        <el-row>
          <!-- TODO: Implement adding lecture part -->
          <el-button>과목 추가</el-button>
        </el-row>
      </el-aside>
      <el-main>
        <h3>자바</h3><hr>
        <!-- TODO: translation -->
        <el-button>과목지식맵</el-button>
        <el-button>과목큐레이션</el-button>
        <el-button>과목저널링</el-button>
        <br /><br />
        <el-row :gutter="20">
          <!-- TODO: Implement dummy response about lecture list -->
          <lecture-list :tableData="tableData"></lecture-list>
          <el-col :span="8">
            <div class="grid-content bg-white">
              <!-- TODO: translation -->
              <el-col :span="16">수강생 목록</el-col>
              <el-col :span="8" style="text-align: right;">8명</el-col>
              <hr>
            </div>
          </el-col>
        </el-row>
          <!-- TODO: Implement dummy response about lecture statistics -->
          <lecture-statistics></lecture-statistics>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import LectureList from '../partials/LectureList';
import LectureStatistics from '../partials/LectureStatistics';

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
  components: {
    LectureList,
    LectureStatistics,
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
    min-height: 500px;
    padding: 25px;
    margin-bottom: 30px;
  }
</style>