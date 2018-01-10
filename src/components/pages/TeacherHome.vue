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
                  prop="date"
                  label="번호"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="강의 시나리오"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="강의 날짜">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="수강생 이해도(평균)">
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TeacherHome',
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }]
    };
  },
  methods: {
    onClick(type) {
      vm = this;
      switch (type) {
        case 'NEW': {
          this.reqLogin({
            email: vm.input.email,
            password: vm.input.email,
          });
          break;
        }
        default: {
        }
      }
    },
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