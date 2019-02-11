<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
     <div class="page-title">
      <template v-if="isEdit">
        과목 수정
      </template><template v-else>
        과목 개설
      </template>
    </div>
    <el-form :model="input" ref="elForm" label-position="left" label-width="125px" style="max-width: 800px;" class="elForm-label">
      <el-form-item label="상태" class="radio-item">
        <el-radio-group v-model.number="input.opened">
          <el-radio :label="0">공개</el-radio>
          <el-radio :label="1">비공개</el-radio>
          <el-radio :label="2">마감</el-radio>
        </el-radio-group>
        <el-popover
          style="position: relative; left: 30px; top: 3px;"
          placement="top-start"
          width="500"
          trigger="hover">
          <el-table :data="notice">
            <el-table-column width="100" property="title" label="상태"></el-table-column>
            <el-table-column width="400" property="content" label="내용"></el-table-column>
          </el-table>
          <i class="el-icon-question fa-lg" slot="reference"></i>
        </el-popover>
      </el-form-item>

      <el-form-item label="과목 제목">
        <el-input v-model="input.title" class="subject-title"></el-input>
      </el-form-item>

      <el-form-item label="과목 요약 소개">
        <el-input type="textarea" :rows="3" v-model="input.summary" class="subject-summary" ></el-input>
      </el-form-item>

      <el-form-item label="강의 기간">
        <el-date-picker
          v-model="input.activeStartDate"
          type="datetime" class="subject-startDate"
        >
        </el-date-picker>
         ~
         <el-date-picker
          v-model="input.activeEndDate"
          type="datetime" class="subject-endDate"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="정원">
        <el-input type="number" v-model.number="input.capacity" :disabled="input.capacityCheck" class="subject-capacity"></el-input>
      </el-form-item>

      <el-form-item label="정원 제한 없음">
        <el-switch v-model="input.capacityCheck"></el-switch>
      </el-form-item>

      <el-form-item label="강사 소개">
        <el-input type="textarea" :rows="3" v-model="input.lecturerDescription" class="teacher-description"></el-input>
      </el-form-item>

      <el-form-item label="과목 상세 소개">
        <el-input type="textarea" :rows="6" v-model="input.description" class="subject-description"></el-input>
      </el-form-item>

      <el-form-item>
        <!-- TODO: use button loading -->
        <el-button
          type="primary"
          @click="onSubmit"
          class="subject-btn"
        >
          <template v-if="isEdit">
            과목 수정
          </template><template v-else>
            과목 개설
          </template>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import classService from '../../services/classService';
import authService from '../../services/authService';
import utils from '../../utils';

export default {
  name: 'TeacherClassNew',
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
      opened: 0,
      summary: '',
      activeStartDate: new Date(),
      activeEndDate: new Date(),
      capacity: 0, // 0은 무제한
      capacityCheck: false,
      // TODO: teacherImage는 따로 api를 뺴야할 듯? 나중에 ㄱㄱ
      lecturerDescription: '',
      description: '',
    };
    return {
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
      notice: [{
        title: '공개',
        content: '학생의 과목 목록에 노출되며 수강신청이 가능합니다.',
      }, {
        title: '비공개',
        content: '학생의 과목 목록에 노출되지 않습니다.',
      }, {
        title: '마감',
        content: '학생의 과목 목록에 노출되나 수강신청은 불가능합니다.',
      }],
    };
  },
  async mounted() {
    const vm = this;
    if (vm.isEdit) {
      const res = await classService.getClass({ id: vm.classId });
      // console.log('res', res.data);
      vm.input.title = res.data.name || vm.initialInput.title;
      vm.input.opened = res.data.opened || vm.initialInput.opened;
      vm.input.summary = res.data.summary || vm.initialInput.summary;
      vm.input.activeStartDate = res.data.start_time || vm.initialInput.activeStartDate;
      vm.input.activeEndDate = res.data.end_time || vm.initialInput.activeEndDate;
      vm.input.capacity = res.data.capacity || vm.initialInput.capacity; // 0은 무제한
      vm.input.capacityCheck = vm.input.capacity === 0;
      vm.input.lecturerDescription = res.data.lecturer_description;
      vm.input.description = res.data.description;
    }
  },
  computed: {
    isEdit() {
      const vm = this;
      return vm.$route.fullPath.includes('/edit');
    },
    classId() {
      const vm = this;
      return vm.$route.path.split('class/')[1].split('/edit')[0];
    },
  },
  methods: {
    onSubmit() {
      const vm = this;
      // 과목 제목 입력 안했을 경우 오류 처리 - 190211
      if (vm.input.title === '') {
        vm.$notify({
          title: '오류',
          message: '과목 제목을 입력해 주세요.',
          type: 'error',
        });
        return;
      }
      // 과목 시작 시간이 끝 시간보다 빠르면 오류 처리 - 190211
      if (vm.input.activeStartDate > vm.input.activeEndDate) {
        vm.$notify({
          title: '오류',
          message: '강의 시작일이 종료일보다 늦습니다.',
          type: 'error',
        });
        return;
      }
      vm.$refs.elForm.validate(async (/* valid, fields */) => {
        // console.log('valid,', valid);
        // console.log('fields', fields);
        // TODO: if valid === true 로 감싸기
        // TODO: valid === false인 경우에 notify
        if (vm.isEdit) {
          const id = vm.classId;
          // TODO: wrap with try catch
          try {
            await classService.NNputClass({
              id,
              ...vm.input,
            });
            vm.$router.go(-1);
          } catch (error) {
            vm.$notify({
              title: '과목 수정 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        } else {
          // TODO: wrap with try catch
          try {
            await classService.NNpostClass(vm.input);
            vm.$router.go(-1);
          } catch (error) {
            vm.$notify({
              title: '과목 생성 실패',
              message: error.toString(),
              type: 'error',
              duration: 0,
            });
          }
        }
      });
    },
  },
  watch: {
    // NOTE: 이거 () => {}로 바꾸면 안됨!! vm이 다른 녀석 들어옴
    'input.capacityCheck': function handler(newVal) {
      const vm = this;
      if (newVal) {
        vm.input.capacity = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#teacher_class_new_wrapper {
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
    margin-left : 7px;
    margin-bottom : 30px;
  }
  .el-form-item__label {
    font-size: 30px;
  }
  .elForm-label el-form-item{
    text-align : left;
    font-family: SpoqaHanSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: #000000;
  }
  .subject-title{
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
  .subject-summary{
    width: 300px;
    height: 100%;
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
  .subject-startDate{
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
  .subject-endDate{
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
  .subject-capacity{
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
  .teacher-description{
    width: 300px;
    height: 100%;
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
  .subject-description{
    width: 300px;
    height: 100%;
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
  .subject-btn{
    width: 300px;
    height: 40px;
    border-radius: 3px;
    background-color: #1989fa;
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
