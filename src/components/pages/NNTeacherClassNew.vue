<template>
  <div id="teacher_class_new_wrapper" class="bt-container">
    <h1>
      <template v-if="isEdit">
        과목 수정
      </template><template v-else>
        과목 생성
      </template>
    </h1>

    <el-form :model="input" ref="elForm" label-width="125px" style="max-width: 800px;">
      <el-form-item label="과목 제목">
        <el-input v-model="input.title"></el-input>
      </el-form-item>

      <el-form-item label="과목 요약 소개">
        <el-input type="textarea" :rows="3" v-model="input.summary"></el-input>
      </el-form-item>

      <el-form-item label="상태">
        <el-radio-group v-model.number="input.opened">
          <el-radio-button :label="0">활성화</el-radio-button>
          <el-radio-button :label="1">숨김</el-radio-button>
          <el-radio-button :label="2">마감</el-radio-button>
        </el-radio-group>
        <br />
        <!-- TODO: element-ui popover로 바꾸기 -->
        활성화: 과목리스트에서 보임 + 과목 수강 가능<br />
        숨김: 과목리스트에서 안 보임<br />
        마감: 과목리스트에서 보임 + 과목 수강 불가<br />
      </el-form-item>

      <el-form-item label="과목 시작 시각">
        <el-date-picker
          v-model="input.activeStartDate"
          type="datetime"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="과목 종료 시각">
        <el-date-picker
          v-model="input.activeEndDate"
          type="datetime"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="정원">
        <el-input type="number" v-model.number="input.capacity" :disabled="input.capacityCheck"></el-input>
      </el-form-item>

      <el-form-item label="정원 제한 없음">
        <el-switch v-model="input.capacityCheck"></el-switch>
      </el-form-item>

      <el-form-item label="강사 소개">
        <el-input type="textarea" :rows="3" v-model="input.teacherDescription"></el-input>
      </el-form-item>

      <el-form-item label="과목 상세 소개">
        <el-input type="textarea" :rows="6" v-model="input.description"></el-input>
      </el-form-item>

      <el-form-item>
        <!-- TODO: use button loading -->
        <el-button
          type="primary"
          @click="onSubmit"
        >
          <template v-if="isEdit">
            과목 수정하기
          </template><template v-else>
            과목 생성하기
          </template>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import classService from '../../services/classService';


export default {
  name: 'TeacherClassNew',
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
      teacherDescription: '',
      description: '',
    };
    return {
      isEdit: false,
      initialInput,
      input: Object.assign({}, initialInput), // 복사해서 넣음
    };
  },
  beforeMount() {
    const vm = this;
    vm.isEdit = vm.$route.fullPath.includes('/edit');
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
      vm.input.teacherDescription = res.data.teacher_description;
      vm.input.description = res.data.description;
    }
  },
  computed: {
    classId() {
      const vm = this;
      return vm.$route.path.split('class/')[1].split('/edit')[0];
    },
  },
  methods: {
    ...mapActions('class', [
      'NNpostClass',
      'NNputClass',
    ]),
    onSubmit() {
      const vm = this;
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
            vm.$notify({
              title: '과목 수정 성공',
              message: '성공적으로 과목이 수정됨',
              type: 'success',
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
            vm.$notify({
              title: '과목 생성 성공',
              message: '성공적으로 과목이 생성됨',
              type: 'success',
            });
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

