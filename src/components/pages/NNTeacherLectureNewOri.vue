<template>
  <div id="teacher_lecture_new_wrapper">

    <h2>
      강의 가져오기
    </h2>

    <!-- {{ input }}<br /><br /> -->

    <el-form ref="elForm" label-width="125px" style="max-width: 1000px;">
      
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
              <el-button type="primary" :disabled="scope.row.isSelected" size="mini" @click="onClick(scope.row)">{{ scope.row.isSelected ? '선택' : '추가'}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>

      <el-form-item label="가져올 강의 목록">
        <el-table
          :data="selectedLectureList">

          <el-table-column
            label="강의명"
            min-width="400"
            align="center"
          >
            <template slot-scope="scope">
              <el-input></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import utils from '../../utils';
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
    ...mapGetters('NNclass', [
      'currentTeachingClass',
    ]),
    lectureList() {
      const vm = this;
      if (!vm.selectedClassId) {
        return [];
      }
      const currentClass = vm.currentTeachingClass(vm.selectedClassId);
      if (currentClass && currentClass.lectures) {
        return currentClass.lectures.map((item) => {
          item.isSelected = vm.selectedLectureList.filter(lec => (lec.lecture_id === item.lecture_id)).length > 0 ? true : false;
          return item;
        });
      }
      return [];
    },
  },
  methods: {
    onClick(lec) {
      const vm = this;
      console.log(lec);
      vm.selectedLectureList.push(lec);
    },
  },
};

</script>