<template>
  <div id="teacher_lecture_new_wrapper" :class="{ 'bt-container': isManage }">

    <h2 v-if="isManage === false">
      강의 추가
    </h2>

    <!-- {{ input }}<br /><br /> -->

    <el-form :model="input" ref="elForm" label-width="125px" style="max-width: 800px;">
      <!-- 20180629 강의 타입 제거
      <el-form-item label="타입">
        <el-radio-group v-model.number="input.type">
          <el-radio-button :label="0">본강</el-radio-button>
          <el-radio-button :label="1">숙제</el-radio-button>
          <el-radio-button :label="2">시험</el-radio-button>
        </el-radio-group>
      </el-form-item>
      -->

      <el-form-item label="강의 타이틀">
        <el-input v-model="input.title"></el-input>
      </el-form-item>

      <el-form-item label="강의 시작 시각">
        <el-date-picker
          v-model="input.lcStartDate"
          type="datetime"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="강의 종료 시각">
        <el-date-picker
          v-model="input.lcEndDate"
          type="datetime"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          {{ isManage ? '강의 수정하기' : '강의 추가하기'}}
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import lectureService from '../../services/lectureService';

export default {
  name: 'TeacherLectureNew',
  data() {
    const initialInput = {
      title: '',
      type: 0,
      lcStartDate: new Date(),
      lcEndDate: new Date(),
    };

    return {
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
    };
  },
  async mounted() {
    const vm = this;
    if (vm.isManage) {
      // TODO: getLecture({ lectureId: }) 그 액션으로 가져오기
      // TODO: 그리고 onSubmit 마지막에 updateLecture null 조져주기
      await vm.getLecture({ lectureId: vm.lectureId });
      vm.input.title = vm.lecture.name || vm.initialInput.title;
      vm.input.type = vm.lecture.type || vm.initialInput.type;
      vm.input.lcStartDate = vm.lecture.start_time || vm.initialInput.lcStartDate;
      vm.input.lcEndDate = vm.lecture.end_time || vm.initialInput.lcEndDate;
    } else {
      vm.input.type = 0; // 20180629 강의 타입 제거
    }
  },
  methods: {
    ...mapActions('lc', [
      'getLecture',
    ]),
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false 인 경우 notify
        // TODO: isManage === true 인 경우 post하지 말고...
        const classId = vm.$route.query.classId;
        if (vm.isManage) {
          try {
            await lectureService.putLecture({
              lectureId: vm.lectureId,
              type: vm.input.type,
              name: vm.input.title,
              startTime: vm.input.lcStartDate,
              endTime: vm.input.lcEndDate,
            });
            vm.$notify({
              title: '강의 수정 성공',
              message: '성공적으로 강의가 수정됨',
              type: 'success',
            });
            vm.$router.go(-1);
          } catch (error) {
            vm.$notify({
              title: '강의 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          try {
            await lectureService.postLecture({
              classId,
              type: vm.input.type,
              name: vm.input.title,
              start_time: vm.input.lcStartDate,
              end_time: vm.input.lcEndDate,
            });
            vm.$notify({
              title: '강의 추가 성공',
              message: '성공적으로 강의가 추가됨',
              type: 'success',
            });
            vm.$router.go(-1);
          } catch (error) {
            vm.$notify({
              title: '강의 추가 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        }
      });
    },
  },
  computed: {
    ...mapState('lc', [
      'lecture',
    ]),
    isManage() {
      const vm = this;
      return vm.$route.fullPath.includes('/manage');
    },
    lectureId() {
      const vm = this;
      return vm.$route.params.lectureId;
    },
  },
};
</script>

