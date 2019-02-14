<template>
  <div id="class_index_wrapper">
    <div>
      <el-table class="elTable" :data="page" style="width: 100%">
      <el-table-column prop="userId" label="학생ID" width="100px">
      </el-table-column>
      <el-table-column prop="name" label="학생이름" width="110px">
      </el-table-column>
      <el-table-column prop="sex" label="성별" width="80px">
      </el-table-column>
      <el-table-column prop="age" label="나이" width="80px">
      </el-table-column>
      <el-table-column prop="subject" label="이수과목" width="200px">
      </el-table-column>
      <el-table-column prop="teacher" label="담당강사" width="110px">
      </el-table-column>
      <el-table-column prop="credit" label="학점" width="90px">
      </el-table-column>
      <el-table-column prop="understanding" label="이해도" width="100px">
      </el-table-column>
      <el-table-column prop="concentrating" label="집중도" width="100px">
      </el-table-column>
      <el-table-column prop="participation" label="참여도" width="100px">
      </el-table-column>
      <el-table-column prop="final-score" label="최종성적" width="100px">
      </el-table-column>
      </el-table>
      <br>
    </div>
    <div id="pagination" style="display: block; text-align: center;">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="listCount"
        :current-page.sync="pageNum"
        >
        </el-pagination>
      </div>
      <br>
      <div class="right-align">
      <router-link to="/a/register/student">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">학생 등록하기</div>
        </el-button>
      </router-link>
      <router-link to="/a/view/studentScore">
        <el-button  type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">전체 학생 성적표 조회</div>
        </el-button>
      </router-link>
      <router-link to="/">
        <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')" style="width: 33%">
          <div class="right-align-btn-layer">홈으로</div>
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import utils from '../../utils';

export default {
  name: 'MasterStudentScore',
  props: ['list', 'onClick'],
  data() {
    return {
      pageNum: 1,
    };
  },
  computed: {
    listCount() {
      return this.list.length;
    },
    page() {
      const vm = this;
      return vm.list.slice((vm.pageNum - 1) * 10, vm.pageNum * 10);
    },
  },
  methods: {
    formatDate: utils.formatDate,
  },
};
</script>


<style lang="scss" scoped>
#class_index_wrapper {
  .elTable-label {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    text-align: center;
  }
  .elTable-label tr {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    text-align: center;
  }
  .elTable-label td {
    font-family: SpoqaHanSans;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #606266;
    text-align: center;
  }
}
</style>
