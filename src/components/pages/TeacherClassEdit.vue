<template>
  <div>
    <h1>과목 수정</h1>
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form label-width="125px">
          <el-form-item label="과목 제목">
            <el-input v-model="title"></el-input>
          </el-form-item>

          <el-form-item label="과목 소개">
            <el-input type="textarea" :rows="3" v-model="description"></el-input>
          </el-form-item>

          <el-form-item label="과목 활성화 시각">
            <el-date-picker
              v-model="activeStartDate"
              type="datetime"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="과목 비활성화 시각">
            <el-date-picker
              v-model="activeEndDate"
              type="datetime"
              :disabled="!shouldDeactivated"
            >
            </el-date-picker>
            <el-radio-group v-model="shouldDeactivated" @change="changeShouldDeactivated">
              <el-radio-button :label="true">비활성화</el-radio-button>
              <el-radio-button :label="false">계속 활성화</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="과목 공개 여부">
            <el-radio-group v-model="opened">
              <el-radio-button label="0">비공개</el-radio-button>
              <el-radio-button label="1">공개(닫힘)</el-radio-button>
              <el-radio-button label="2">진행중(열림)</el-radio-button>
              <el-radio-button label="3">종료</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <!-- TODO: use button loading -->
            <el-button
              type="primary"
              @click="onSubmit"
            >
              강의 수정하기
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
// import authService from '../../services/authService';
// import utils from '../../utils';

export default {
  name: 'TeacherClassEdit',
  // async mounted() {
  //   const res = await authService.test();
  //   console.log(res);
  // },
  data() {
    return {
      shouldDeactivated: true,
      test: '',
    };
  },
  methods: {
    ...mapMutations('class', ['assignCurrentClass']),
    ...mapActions('class', ['putClass']),
    changeShouldDeactivated(label) {
      const vm = this;
      if (!label) {
        vm.activeEndDate = null;
      }
    },
    async onSubmit() {
      const vm = this;
      try {
        await vm.putClass();
        vm.$notify({
          title: '과목 수정 성공',
          message: '성공적으로 과목이 수정됨',
          type: 'success',
        });
        vm.$router.push('/a/teacher/class');
      } catch (error) {
        vm.$notify({
          title: '과목 수정 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      }
    },
  },
  computed: {
    ...mapGetters('class', ['currentClass']),
    input() {
      const res = {};
      const vm = this;
      res.todo = vm.todo; // TODO: delete
      return res;
    },
    title: {
      get() {
        const vm = this;
        return vm.currentClass.name;
      },
      set(name) {
        const vm = this;
        vm.assignCurrentClass({
          currentClass: {
            name,
          },
        });
      },
    },
    description: {
      get() {
        const vm = this;
        return vm.currentClass.description;
      },
      set(description) {
        const vm = this;
        vm.assignCurrentClass({
          currentClass: {
            description,
          },
        });
      },
    },
    activeStartDate: {
      get() {
        const vm = this;
        return vm.currentClass.start_time;
      },
      set(activeStartDate) {
        const vm = this;
        vm.assignCurrentClass({
          currentClass: {
            start_time: activeStartDate,
          },
        });
      },
    },
    activeEndDate: {
      get() {
        const vm = this;
        return vm.currentClass.end_time;
      },
      set(activeEndDate) {
        const vm = this;
        vm.assignCurrentClass({
          currentClass: {
            end_time: activeEndDate,
          },
        });
      },
    },
    opened: {
      get() {
        const vm = this;
        return vm.currentClass.opened;
      },
      set(opened) {
        const vm = this;
        vm.assignCurrentClass({
          currentClass: {
            opened,
          },
        });
      },
    },
  },
};
</script>
