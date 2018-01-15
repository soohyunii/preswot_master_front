<template>
  <div>
    <el-container>
      <el-aside width="100px">
        <template v-for="(item, key) in teachingClassList">
          <el-row :key="key">
            <el-col align="center">
            <!-- TODO: link to each class -->
            <i :class="dummyIcons()" style="font-size: 50px;" @click="dummy(item)"></i><br/>
            {{ item.className | truncate(10) }}
            </el-col>
          </el-row>
        </template>

        <el-row>
          <el-col align="center">
          <!-- TODO: Implement adding lecture part -->
          <!-- TODO: translation -->
          <i class='el-icon-circle-plus' style="font-size: 50px;" @click="dummy('과목추가')"></i><br/>
          과목 추가
          </el-col>
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
            <lecture-element-button-group />
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
import LectureElementSequence from '../partials/LectureElementSequence';
import LectureElementButtonGroup from '../partials/LectureElementButtonGroup';
import classService from '../../services/classService';

export default {
  name: 'TeacherNewLecture',
  data() {
    return {
      teachingClassList: [],
    };
  },
  methods: {
    dummyIcons() {
      return 'el-icon-document';
    },
    dummy(index) {
      window.console.log(index);
    },
  },
  async mounted() {
    const vm = this;
    vm.teachingClassList = await classService.fetchTeachingClassList();
  },
  components: {
    LectureElementSequence,
    LectureElementButtonGroup,
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