<template>
  <div class="bt-container">
      <el-breadcrumb style="font-size: 24px; margin-top: 16px; margin-bottom: 32px;" separator=">">
        <el-breadcrumb-item :to="{ path: '/a/student/NNclass/'+classId }">{{ className }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ lectureName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="itemSize+8">
          <el-tabs type="card">
           
            <el-tab-pane label="출제문항">
              <StudentSelfQuiz/>
            </el-tab-pane>

            <el-tab-pane label="문항평가">
              <StudentSelfQuizEstimate/>
            </el-tab-pane>             

          </el-tabs>
        </el-col>
      </el-row>
   
  </div>
</template>

<script>
import { mapState } from 'vuex';
import deepCopy from 'deep-copy';
import classService from '../../services/classService';
import lectureService from '../../services/lectureService';
import studentService from '../../services/studentService';
import LectureLiveItem from '../partials/LectureLiveItem';
import lectureItemService from '../../services/lectureItemService';
import LectureLiveMaterial from '../partials/LectureLiveMaterial';
import utils from '../../utils';
import automaticLectureService from '../../services/automaticLectureService';
import StudentSelfQuiz from '../partials/StudentSelfQuiz';
import StudentSelfQuizEstimate from '../partials/StudentSelfQuizEstimate';

export default {
  name: 'StudentLectureQuiz',
  computed: {
    ...mapState('studentQuestion',['lectureId']),
  },
  async created() {
    const vm = this;
    // alert('createdAt');
    const lid = vm.lectureId;
    const res = await lectureService.getLecture({
      lectureId: lid,
    });
    vm.lectureType = res.data.type;
    vm.className = res.data.name;
    vm.classId = res.data.class_id;
    vm.lectureName = res.data.name;
  },
  data() {
    return {
      className: '',
      lectureName: '',
      classId: -1,
      lectureType: null,
    };
  },
  components: {
    StudentSelfQuiz,
    StudentSelfQuizEstimate,
  },
  mounted() {

  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  border-radius: 4px;
  min-height: 500px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.statusbar {
  position:fixed;
  left:0px;
  bottom:0px;
  width:100%;
  padding: 8px 0px 5px 0px;
  background:rgba(0, 0, 0, 0.6);
  color: white;
  -webkit-transition: max-height 1s;
  -moz-transition: max-height 1s;
  -ms-transition: max-height 1s;
  -o-transition: max-height 1s;
  transition: max-height 1s;
  overflow: hidden;
  height:100%;
  max-height:25px;
}
</style>
