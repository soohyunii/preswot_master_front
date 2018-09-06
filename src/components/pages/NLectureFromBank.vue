<template>
  <div id="lecture_from_bank_wrapper" class="bt-container">
    <h2>강의은행에서 가져오기</h2>
    <div style="height: 10px;" />
    <el-tabs type="card" @tab-click="onClick('TAB_CHANGE')">
      <el-tab-pane label="강의명으로 검색">
        <el-input placeholder="강의명으로 검색" prefix-icon="el-icon-search" v-model="searchName" style="width: 300px;"></el-input>
        <el-button type="primary" @click="onClick('SEARCH_BY_NAME')">검색</el-button>
        <el-button @click="onClick('INIT_RESULT')">결과 초기화</el-button>
      </el-tab-pane>
      <el-tab-pane label="소속 그룹으로 검색">
        <el-select v-model="selectGroup" placeholder="그룹 선택">
          <el-option v-for="item in group" :key="item.group_id" :label="item.name" :value="item.group_id"></el-option>
        </el-select>
        <el-button type="primary" @click="onClick('SEARCH_BY_GROUP')">검색</el-button>
        <el-button @click="onClick('INIT_RESULT')">결과 초기화</el-button>
      </el-tab-pane>
      <el-tab-pane label="키워드로 검색">
        <el-input placeholder="검색할 키워드" prefix-icon="el-icon-search" v-model="searchKey" style="width: 300px;"></el-input>
        <el-button @click="onClick('NEW_KEYWORD', searchKey)">키워드 추가</el-button>
        <br />
        <div style="height: 10px;" />
        <el-tag v-for="(value, index) in searchKeywordList" :key="value" closable @close="deleteKeyword(index)" style="margin-right: 5px;">{{ value }}</el-tag>
        <el-button type="primary" @click="onClick('SEARCH_BY_KEYWORD')">검색</el-button>
        <el-button @click="onClick('INIT_RESULT')">결과 초기화</el-button>
      </el-tab-pane>
    </el-tabs>
    <div style="height: 50px;" />
    <el-table ref="multipleTable" :data="resultLectureList" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="강의명">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="소속 그룹">
        <template slot-scope="scope">{{ scope.row.groupName }}</template>
      </el-table-column>
      <el-table-column label="저작일">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="최종 수정일">
        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>
    </el-table>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <el-button type="primary" @click="onClick('BRING_LECTURE')">선택된 강의들 가져오기</el-button>
      <router-link :to="`/a/teacher/NNclass/${classId}}`">
        <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import bankService from '../../services/bankService';

export default {
  name: 'NLectureFromBank',
  data() {
    return {
      isAdd: false,
      searchName: '',
      selectGroup: '',
      searchKey: '',
      searchKeywordList: [],
      multipleSelection: [],
      group: [],
      resultLectureList: [],
      bankLectureList: [],
    };
  },
  computed: {
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
  },
  async mounted() {
    const vm = this;
    vm.isAdd = false;
    const res = await bankService.getBankLecture();
    console.log(res);
    res.data.lectureList.forEach((x) => {
      const lectureInfo = {};
      lectureInfo.name = x.name;
      lectureInfo.lectureId = x.lecture_id;
      /* const cr1 = x.created_at.substr(0, 10);
      const cr2 = x.created_at.substr(11, 8);
      lectureInfo.createTime = cr1.concat(' ', cr2);
      const up1 = x.updated_at.substr(0, 10);
      const up2 = x.updated_at.substr(11, 8);
      lectureInfo.updateTime = up1.concat(' ', up2); */
      lectureInfo.groupId = x.bank_group.group_id;
      lectureInfo.groupName = x.bank_group.name;
      vm.bankLectureList.push(lectureInfo);
    });
    vm.resultLectureList = vm.bankLectureList;
    // 내 그룹 받아오기
    const myg = await bankService.getMyGroup();
    vm.group = myg.data.groupList;
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onClick(type) {
      const vm = this;
      switch (type) {
        // 탭 변경
        case 'TAB_CHANGE': {
          vm.searchName = '';
          vm.searchKey = '';
          vm.searchGroup = '';
          vm.searchKeywordList = [];
          vm.$refs.multipleTable.clearSelection();
          break;
        }
        // 강의명으로 검색
        case 'SEARCH_BY_NAME': {
          if (vm.searchName === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 강의명을 입력해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureList = [];
          const res = bankService.getBankLectureByName({
            name: vm.searchName,
          });
          res.data.lectureList.forEach((x) => {
            const lectureInfo = {};
            lectureInfo.name = x.name;
            lectureInfo.classId = x.class_id;
            const cr1 = x.created_at.substr(0, 10);
            const cr2 = x.created_at.substr(11, 8);
            lectureInfo.createTime = cr1.concat(' ', cr2);
            const up1 = x.updated_at.substr(0, 10);
            const up2 = x.updated_at.substr(11, 8);
            lectureInfo.updateTime = up1.concat(' ', up2);
            lectureInfo.groupId = x.bank_group.group_id;
            lectureInfo.groupName = x.bank_group.name;
            vm.resultLectureList.push(lectureInfo);
          });
          break;
        }
        // 소속 그룹으로 검색
        case 'SEARCH_BY_GROUP': {
          if (vm.selectGroup === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 그룹을 선택해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureList = [];
          console.log(vm.selectGroup);
          const res = bankService.getBankLectureByGroup({
            id: vm.selectGroup,
          });
          res.data.lectureList.forEach((x) => {
            const lectureInfo = {};
            lectureInfo.name = x.name;
            lectureInfo.classId = x.class_id;
            const cr1 = x.created_at.substr(0, 10);
            const cr2 = x.created_at.substr(11, 8);
            lectureInfo.createTime = cr1.concat(' ', cr2);
            const up1 = x.updated_at.substr(0, 10);
            const up2 = x.updated_at.substr(11, 8);
            lectureInfo.updateTime = up1.concat(' ', up2);
            lectureInfo.groupId = x.bank_group.group_id;
            lectureInfo.groupName = x.bank_group.name;
            vm.resultLectureList.push(lectureInfo);
          });
          break;
        }
        // 검색할 키워드 추가
        case 'NEW_KEYWORD': {
          // 빈 키워드 입력
          if (vm.searchKey === '') {
            vm.$notify({
              title: '알림',
              message: '키워드를 입력해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 키워드 추가시 중복 검사
          if (vm.searchKeywordList.includes(vm.searchKey) === true) {
            vm.$notify({
              title: '알림',
              message: '이미 추가된 키워드입니다.',
              type: 'warning',
            });
            break;
          }
          // 중복이 아닐 경우 검색 목록에 추가
          vm.searchKeywordList.push(vm.searchKey);
          vm.searchKey = '';
          break;
        }
        // 입력한 키워드들로 검색
        case 'SEARCH_BY_KEYWORD': {
          // 키워드가 없으면 검색이 되지 않음
          if (vm.searchKeywordList.length === 0) {
            vm.$notify({
              title: '알림',
              message: '검색에 사용할 키워드를 추가해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureList = [];
          const res = bankService.getBankLectureByKeyword({
            keyArray: vm.searchKeywordList,
          });
          res.data.lectureList.forEach((x) => {
            const lectureInfo = {};
            lectureInfo.name = x.name;
            lectureInfo.classId = x.class_id;
            const cr1 = x.created_at.substr(0, 10);
            const cr2 = x.created_at.substr(11, 8);
            lectureInfo.createTime = cr1.concat(' ', cr2);
            const up1 = x.updated_at.substr(0, 10);
            const up2 = x.updated_at.substr(11, 8);
            lectureInfo.updateTime = up1.concat(' ', up2);
            lectureInfo.groupId = x.bank_group.group_id;
            lectureInfo.groupName = x.bank_group.name;
            vm.resultLectureList.push(lectureInfo);
          });
          break;
        }
        // 검색 결과 초기화  & 선택 내용 초기화
        case 'INIT_RESULT': {
          vm.searchName = '';
          vm.selectGroup = '';
          vm.searchKey = '';
          vm.searchKeywordList = [];
          vm.resultLectureList = vm.bankLectureList;
          vm.$refs.multipleTable.clearSelection();
          break;
        }
        // 선택된 강의들 가져오기
        case 'BRING_LECTURE': {
          // 선택된 강의가 없을 경우
          if (vm.multipleSelection.length === 0) {
            vm.$notify({
              title: '알림',
              message: '선택된 강의가 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.multipleSelection.forEach((x) => {
            bankService.bankToLecture({
              lecture_id: x.lectureId,
              target_class_id: vm.classId,
            });
          });
          break;
        }
        // 뒤로 가기
        case 'BACK': {
          break;
        }
        default: {
          break;
        }
      }
    },
    // 추가한 키워드 삭제
    deleteKeyword(arg) {
      const vm = this;
      vm.searchKeywordList.splice(arg, 1);
    },
  },
};
</script>

