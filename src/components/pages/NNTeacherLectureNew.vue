<template>
  <div id="teacher_lecture_new_wrapper" class="bt-container">
    <h2 v-if="isManage === false" class="page-title">
      강의 추가
    </h2>
    <el-form :model="input" ref="elForm" label-width="125px" style="max-width: 800px;">

      <el-form-item label="강의 타이틀">
        <el-input v-model="input.title"  class="lecture-title"></el-input>
      </el-form-item>

      <el-form-item label="강의 유형">
        <el-radio-group v-model.number="input.type">
          <el-radio :label="0">[유인]</el-radio>
          <el-radio :label="1">[무인]단체</el-radio>
          <el-radio :label="2">[무인]개인</el-radio>
        </el-radio-group>
        <el-popover
          style="position: relative; left: 30px; top: 3px;"
          placement="top-start"
          width="400"
          trigger="hover">
          <el-table :data="notice">
            <el-table-column width="100" prop="title" label="유형"></el-table-column>
            <el-table-column width="290" prop="content" label="내용"></el-table-column>
          </el-table>
          <i class="el-icon-question fa-lg" slot="reference"></i>
        </el-popover>
      </el-form-item>

      <el-form-item label="강의 날짜 " v-if="input.type === 1">
        <el-date-picker
          v-model="input.lcStartDate"
          type="datetime"  class="lecture-startDate"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="강의 시간" v-if="input.type === 1">
        <el-time-picker
          v-model="input.lcStartDate"
          type="datetime"  class="lecture-startDate"
        ></el-time-picker>
         ~
        <el-time-picker
          v-model="input.lcEndDate"
          type="datetime"  class="lecture-endDate"
        ></el-time-picker>
      </el-form-item>

      <el-form-item label="강의 활성 기간" v-if="input.type === 2">
        <el-date-picker
          v-model="input.lcStartDate"
          type="datetime"  class="lecture-startDate"
        ></el-date-picker>
         ~
        <el-date-picker
          v-model="input.lcEndDate"
          type="datetime" class="lecture-endDate"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit" class="putLecture-btn"
        >
          <div class="putLecture-btn-layer">
            {{ isManage ? '강의 수정' : '강의 추가'}}
          </div>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import lectureService from '../../services/lectureService';
import authService from '../../services/authService';

export default {
  name: 'TeacherLectureNew',
  async created() {
    const vm = this;
    // 학생이 url로 접근하는 경우 방지
    const accessId = utils.getUserIdFromJwt();
    const accessCheck = await authService.returnUserInfo({
      userID: accessId,
    });
    if (accessCheck.data.userInfo.type === 0) {
      vm.$router.push('/');
    }
  },
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
      notice: [{
        title: '[유인]',
        content: '강의 아이템 활성화 여부를 강사가 조정합니다.',
      }, {
        title: '[무인]단체',
        content: '지정된 시각부터 강의가 자동으로 시작됩니다. \n강의 아이템 활성화 시간 설정이 필요합니다.',
      }, {
        title: '[무인]개인',
        content: '활성화 기간동안 자유롭게 수강이 가능합니다. \n강의 아이템 활성화 시간 설정이 필요합니다.',
      }],
    };
  },
  async mounted() {
    const vm = this;
    if (vm.isManage) {
      // TODO: 그리고 onSubmit 마지막에 updateLecture null 조져주기
      await vm.getLecture({ lectureId: vm.lectureId });
      vm.input.title = vm.lecture.name || vm.initialInput.title;
      vm.input.type = vm.lecture.type || vm.initialInput.type;
      vm.input.lcStartDate = new Date(vm.lecture.start_time) || vm.initialInput.lcStartDate;
      vm.input.lcEndDate = new Date(vm.lecture.end_time) || vm.initialInput.lcEndDate;
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
        const classId = vm.$route.query.classId;

        if (vm.lecture && vm.lecture.type === 1) {
          vm.input.lcEndDate.setFullYear(vm.input.lcStartDate.getFullYear());
          vm.input.lcEndDate.setMonth(vm.input.lcStartDate.getMonth());
          vm.input.lcEndDate.setDate(vm.input.lcStartDate.getDate());
        }

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

<style lang="scss" scoped>
#teacher_lecture_new_wrapper {
 .bt_container{
   margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;

    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;
 }

.page-title{
    float:left;
    width:1000px;
    height: 24px;

    font-family: SpoqaHanSans;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000000;

    margin-top : 40px;
    margin-left : 12px;
    margin-bottom : 25px;
 }


.lecture-title{
   width: 300px;
  height: 40px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dcdfe6;
  font-family: AppleSDGothicNeo;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
}

.lecture-startDate{
   width: 140px;
  height: 40px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #d8dce6;

  font-family: AppleSDGothicNeo;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
}

.lecture-endDate{
  width: 140px;
  height: 40px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #d8dce6;

  font-family: AppleSDGothicNeo;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
}
.putLecture-btn{
   width: 300px;
  height: 40px;
  border-radius: 3px;
  background-color: #1989fa;

}
.putLecture-btn-layer{
  font-family: SpoqaHanSans;
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
}
}
</style>