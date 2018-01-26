<template>
  <div>
    <h1>Teacher Lecture Live Template</h1>
    <el-container>
      <el-aside width="150px">
        <teaching-class-list />
      </el-aside>

      <!-- 이 메인은 맞음 시작 -->
      <el-main>
        <el-row :gutter="5">
          <el-col :span="3">
            <!-- TODO: translate -->
            <el-button type="primary" size="medium" disabled>
              분류 : {{ lectureType }}
              <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
            </el-button>
          </el-col>

          <el-col :span="7">
            <h3 class="lecture-name">
              {{ lectureName }}
              <!-- <i class="el-icon-edit" @click="changeLectureName()"></i> -->
            </h3>
          </el-col>

          <el-col :span="7">
            <h3 class="current-lecture-time">
              {{ currentLectureTimeMillisec }}
            </h3>
          </el-col>
          <el-col :span="7">
            <h3 class="elapsed-time">
              {{ elapsedTimeMillisec }}
            </h3>
          </el-col>
        </el-row>
        <hr><br />

        <el-row :gutter="30">
          <el-col :span="16">
            <div>
              <sc />
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <sc-item-adder />
            </div>
          </el-col>
        </el-row>

        <div id="app_sc_item_summary">
          <sc-item-summary />
        </div>

        <div id="app_lecture_editor" v-show="!isScEmpty">
          <el-row :gutter="30">
            <el-col :span="24">
              <sc-material-editor />
              <sc-active-time-editor />
            </el-col>
          </el-row>
        </div>
      </el-main>
      <!-- 이 메인은 맞음 끝 -->
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.lecture-name {
  margin: 8px 0;
  // background-color: red;
}

.current-lecture-time {
  margin: 8px 0;
  background-color: red;
}

.elapsed-time {
  margin: 8px 0;
  background-color: pink;
}
</style>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import Sc from '../partials/Sc';
import ScItemAdder from '../partials/ScItemAdder';
import ScItemSummary from '../partials/ScItemSummary';
import ScMaterialEditor from '../partials/ScMaterialEditor';
import ScActiveTimeEditor from '../partials/ScActiveTimeEditor';
import TeachingClassList from '../partials/TeachingClassList';

export default {
  name: 'TeacherLectureLive',
  components: {
    Sc,
    ScItemAdder,
    ScItemSummary,
    ScMaterialEditor,
    ScActiveTimeEditor,
    TeachingClassList,
  },
  data() {
    // TODO: translate
    return {
      teachingClassList: [],
      lectureName: '4강 (배열)', // TODO: replace
      currentClassName: '',
      lectureType: '강의', // TODO: replace
    };
  },
  mounted() {
    const vm = this;
    vm.updateCurrentLectureTimeMillisec({
      currentLectureTimeMillisec: 10000,
    });
    vm.updateLiveStartTime({
      liveStartTime: new Date(),
    });
  },
  computed: {
    ...mapState('teacher', ['currentLectureTimeMillisec']),
    ...mapGetters('teacher', ['isScEmpty', 'elapsedTimeMillisec']),
  },
  methods: {
    ...mapMutations('teacher', ['updateCurrentLectureTimeMillisec', 'updateLiveStartTime']),
  },
};
</script>

