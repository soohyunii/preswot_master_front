<template>
  <div id="teacher_lecture_new_wrapper" :class="{ 'bt-container': isManage }">
    <h2 v-if="isManage === false">
      강의 추가
    </h2>

    {{ input }}<br /><br />

    <el-form :model="input" ref="elForm" label-width="125px" style="max-width: 800px;">
      <el-form-item label="타입">
        <el-radio-group v-model.number="input.type">
          <el-radio-button :label="0">본강</el-radio-button>
          <el-radio-button :label="1">숙제</el-radio-button>
          <el-radio-button :label="2">시험</el-radio-button>
        </el-radio-group>
      </el-form-item>

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
          과목 추가하기
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import lectureService from '../../services/lectureService';
import utils from '../../utils';

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
      const res = await lectureService.getLecture({ lectureId: vm.lectureId });
      // console.log('res', res.data);
      vm.input.title = res.data.name || vm.initialInput.title;
      vm.input.type = res.data.type || vm.initialInput.type;
      vm.input.lcStartDate = res.data.intended_start || vm.initialInput.lcStartDate;
      vm.input.lcEndDate = res.data.intended_end || vm.initialInput.lcEndDate;
    }
  },
  methods: {
    onSubmit() {
      const vm = this;
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false 인 경우 notify
        try {
          const userId = utils.getUserIdFromJwt();
          const classId = vm.$route.query.classId;
          await lectureService.postLecture({
            classId,
            teacherId: userId,
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
      });
    },
  },
  computed: {
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

