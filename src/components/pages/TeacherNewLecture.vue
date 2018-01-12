<template>
  <div>
    <el-container>
      <el-aside width="100px">
        <el-row>
          <!-- TODO: translation -->
          <div>강의중인 과목 목록</div>
        </el-row>
      </el-aside>
      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row>
          <!-- TODO: translation -->
          <el-col :span="24"><div class="lecture-number-name">4강 (배열)</div></el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="16">
            <lecture-element-sequence />
          </el-col>
          <el-col :span="8">
            <lecture-element-group />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <!-- TODO: translation -->
            <div class="lecture-number-name">새 문항 입력하기</div>
            <div>문항에 관련된 사항 입력 공간</div>
          </el-col>
          <el-col :span="8">
            <div>
              <!-- TODO: translation -->
              <div class="lecture-number-name">활성화 방식</div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <!-- 이 메인은 맞음 끝 -->
    </el-container>

  </div>
</template>

<script>
import LectureElementGroup from '../partials/LectureElementGroup';
import LectureElementSequence from '../partials/LectureElementSequence';

export default {
  name: 'TeacherNewLecture',
  components: {
    LectureElementGroup,
    LectureElementSequence,
  },
};
</script>


<style scoped>
  .lecture-number-name {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: darkorange;
  }
</style>