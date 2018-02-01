<template>
  <div>
    <h1>과목 생성</h1>
    {{ newClass }}
    <el-row>
      <el-col style="max-width: 600px;">
        <el-form :model="input" ref="elForm" label-width="125px">
          <el-form-item label="과목 제목">
            <el-input v-model="title"></el-input>
          </el-form-item>

          <el-form-item label="강사 목록">
            <el-input v-model="teacherIdList"></el-input>
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

          <el-form-item>
            <!-- TODO: use button loading -->
            <el-button
              type="primary"
              :disabled="!isNewClassValid"
              @click="onSubmit"
            >
              강의 생성하기
            </el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';
// import authService from '../../services/authService';

export default {
  name: 'TeacherClassNew',
  // async mounted() {
  //   const res = await authService.test();
  //   console.log(res);
  // },
  data() {
    return {
      test: '',
      shouldDeactivated: true,
    };
  },
  methods: {
    ...mapMutations('teacher', [
      'updateNewClass',
    ]),
    ...mapActions('teacher', [
      'createClass',
    ]),
    changeShouldDeactivated(label) {
      const vm = this;
      if (!label) {
        vm.activeEndDate = null;
      }
    },
    onSubmit() {
      const vm = this;
      vm.createClass();
    },
  },
  computed: {
    ...mapState('teacher', [
      'newClass',
    ]),
    ...mapGetters('teacher', [
      'isNewClassValid',
    ]),
    input() {
      const res = {};
      const vm = this;
      res.todo = vm.todo; // TODO: delete
      return res;
    },
    title: {
      get() {
        const vm = this;
        return vm.newClass.title;
      },
      set(title) {
        const vm = this;
        vm.updateNewClass({
          newClass: {
            title,
          },
        });
      },
    },
    teacherIdList: {
      get() {
        const vm = this;
        if (!vm.newClass.teacherIdList) {
          return null;
        }
        return vm.newClass.teacherIdList.join(', ');
      },
      set(teacherIdList) {
        const vm = this;
        vm.updateNewClass({
          newClass: {
            teacherIdList: teacherIdList.split(',')
              .map(value => value.trim())
              .filter(value => value)
              .map(value => Number.parseInt(value, 10))
              .filter(value => !Number.isNaN(value)),
          },
        });
      },
    },
    description: {
      get() {
        const vm = this;
        return vm.newClass.description;
      },
      set(description) {
        const vm = this;
        vm.updateNewClass({
          newClass: {
            description,
          },
        });
      },
    },
    activeStartDate: {
      get() {
        const vm = this;
        // const activeStartDate = new Date(vm.newClass.activeStartDate);
        return vm.newClass.activeStartDate;
      },
      set(activeStartDate) {
        const vm = this;
        vm.updateNewClass({
          newClass: {
            activeStartDate,
          },
        });
      },
    },
    activeEndDate: {
      get() {
        const vm = this;
        return vm.newClass.activeEndDate;
      },
      set(activeEndDate) {
        const vm = this;
        vm.updateNewClass({
          newClass: {
            activeEndDate,
          },
        });
      },
    },
  },
};
</script>
