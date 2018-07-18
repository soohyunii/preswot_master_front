<template>
  <div id="teacher_lecture_new_wrapper">

    <h2>
      강의 가져오기
    </h2>

    <!-- {{ input }}<br /><br /> -->

    <el-form ref="elForm" label-width="125px" style="max-width: 1300px;">
      
      <el-form-item label="기존 과목 목록">
        <el-select v-model="selectedClassId" placeholder="과목">
          <el-option
            v-for="item in teachingClassList"
            :label="item.name"
            :value="item.class_id">
            <span style="float: left; min-width: 150px;">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.start_time ? new Date(item.start_time).toLocaleDateString('ko-KR') : '미정' }} 
            ~
            {{ item.end_time ? new Date(item.end_time).toLocaleDateString('ko-KR') : '미정' }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="기존 강의 목록">
        <el-table
          :row-class-name="selectedLectureClass"
          :data="lectureList">

          <el-table-column
            prop="name"
            label="강의"
            min-width="300"
            align="center"
          >
          </el-table-column>

          <el-table-column
            label="기간"
            min-width="300"
            align="center"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row.intended_start ? new Date(scope.row.intended_start).toLocaleDateString('ko-KR') : '미정' }} // Legacy : 필요없다면 지워주세요.-->
              {{ scope.row.start_time ? new Date(scope.row.start_time).toLocaleDateString('ko-KR') : '미정' }}
              ~
              <!-- {{ scope.row.intended_end ? new Date(scope.row.intended_end).toLocaleDateString('ko-KR') : '미정' }} // Legacy : 필요없다면 지워주세요. -->
              {{ scope.row.end_time ? new Date(scope.row.end_time).toLocaleDateString('ko-KR') : '미정' }}
            </template>
          </el-table-column>

          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" :disabled="scope.row.isSelected" size="mini" @click="onClick('SELECT', scope.row)">{{ scope.row.isSelected ? '선택' : '추가'}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>

      <el-form-item label="가져올 강의 목록">
        <el-table
          :data="selectedLectureList">

          <el-table-column
            label="기존 과목명"
            min-width="150"
            align="center"
            prop="className"
          >
          </el-table-column>

          <el-table-column
            label="기존 강의명"
            min-width="150"
            align="center"
            prop="name"
          >
          </el-table-column>

          <el-table-column
            label="새로운 강의명"
            min-width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-input :placeholder="scope.row.name" v-model="scope.row.newName"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="강의 시작 시각"
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.lcStartDate"
                type="datetime"
              ></el-date-picker>
            </template>
          </el-table-column>

          <el-table-column
            label="강의 종료 시각"
            min-width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.lcEndDate"
                type="datetime"
              ></el-date-picker>
            </template>
          </el-table-column>

          <el-table-column
          width="80"
          align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click="onClick('DELETE',scope.row)" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">가져오기</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import utils from '../../utils';
import classService from '../../services/classService';
import lectureService from '../../services/lectureService';

export default {
  name: 'TeacherLectureNewOri',
  data() {
    return {
      selectedClassId: '',
      selectedLectureList: [],
    }
  },
  computed: {
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
  },
  asyncComputed: {
    async lectureList() {
      const vm = this;
      if (vm.selectedClassId === '') {
        return [];
      }
      vm.selectedClassId = { id: vm.selectedClassId };
      const res = await classService.getClass(vm.selectedClassId);
      const currentClass = res.data;
      if (currentClass && currentClass.lectures) {
        return currentClass.lectures.map((item) => {
          item.isSelected = vm.selectedLectureList.filter(lec => (lec.lecture_id === item.lecture_id)).length > 0 ? true : false;
          item.lcStartDate = new Date();
          item.lcEndDate = new Date();
          item.newName = item.name;
          item.className = currentClass.name;
          return item;
        });
      }
    },
  },
  methods: {
    onClick(type, row) {
      const vm = this;

      switch (type) {
        case 'SELECT':
          row.isSelected = true;
          vm.selectedLectureList.push(row);
          break;
        case 'DELETE':
          const lecId = row.lecture_id;
          let lecIdx = vm.selectedLectureList.findIndex(lec => lec.lecture_id === lecId);
          vm.selectedLectureList.splice(lecIdx, 1);
          lecIdx = vm.lectureList.findIndex(lec => lec.lecture_id === lecId);
          vm.lectureList[lecIdx].isSelected = false;
          break;
      }
    },
    async onSubmit() {
      const vm = this;
      const classId = vm.$route.query.classId;
      let sucNum = 0, errNum = 0, totalNum = vm.selectedLectureList.length;
      const newLecArray = vm.selectedLectureList.map((lec) => {
        return {
          classId: classId,
          oriLecId: lec.lecture_id,
          type: lec.type,
          name: lec.newName,
          start_time: lec.lcStartDate,
          end_time: lec.lcEndDate,
        };
      });

      try {
        await lectureService.postLectureFromOrigin(newLecArray);
        vm.$notify({
          title: '강의 수정 성공',
          message: '성공적으로 강의가 수정됨',
          type: 'success',
        });
        vm.$router.go(-1);
      } catch (error) {
        console.log(error);
        vm.$notify({
          title: '강의 수정 실패',
          message: error.toString(),
          type: 'error',
          duration: 0,
        });
      }
      /* await vm.selectedLectureList.forEach(async (lec) => {
        try {
            await lectureService.postLecture({
              classId,
              type: lec.type,
              name: lec.newName,
              start_time: lec.lcStartDate,
              end_time: lec.lcEndDate,
            });
            sucNum++;
          } catch (error) {
            console.log(error);
            errNum++;
          }
          if (sucNum+errNum === totalNum) {
            vm.$notify({
              title: `강의 ${totalNum}개 중 ${sucNum}개 가져오기 성공`,
              message: '성공적으로 강의가 추가됨',
              type: 'success',
            });
            vm.$router.go(-1);
          }
      }); */
    },
    selectedLectureClass({ row }) {
      if (row.isSelected) return 'selected-lc-class';
      return '';
    },
  },
};

</script>

<style>
.el-table .selected-lc-class {
  background: #ADD8E6;
}
</style>