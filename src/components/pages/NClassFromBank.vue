<template>
  <div id="class_from_bank_wrapper" class="bt-container">
    <h2>과목은행에서 가져오기</h2>
    <div style="height: 10px;" />
    <el-tabs type="card" @tab-click="onClick('TAB_CHANGE')">
      <el-tab-pane label="과목명으로 검색">
        <el-input placeholder="과목명으로 검색" prefix-icon="el-icon-search" v-model="searchName" style="width: 300px;"></el-input>
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
    <el-table ref="multipleTable" :data="resultClassList" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="과목명">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="과목 소개">
        <template slot-scope="scope">{{ scope.row.desc }}</template>
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
      <el-button type="primary" @click="onClick('BRING_CLASS')">선택된 과목들 가져오기</el-button>
      <router-link :to="`/a/teacher/NNClass`">
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
      resultClassList: [],
      bankClassList: [],
    };
  },
  computed: {
    ...mapState('NNclass', [
      'teachingClassList',
    ]),
    ...mapActions('NNclass', [
      'getMyClassLists',
    ]),
    classId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.classId, 10);
    },
  },
  async mounted() {
    const vm = this;
    vm.isAdd = false;
    const res = await bankService.getBankClass();
    res.data.classList.forEach((x) => {
      const classInfo = {};
      classInfo.name = x.name;
      classInfo.desc = x.description;
      classInfo.classId = x.class_id;
      const cr1 = x.created_at.substr(0, 10);
      const cr2 = x.created_at.substr(11, 8);
      classInfo.createTime = cr1.concat(' ', cr2);
      const up1 = x.updated_at.substr(0, 10);
      const up2 = x.updated_at.substr(11, 8);
      classInfo.updateTime = up1.concat(' ', up2);
      classInfo.groupId = x.bank_group.group_id;
      classInfo.groupName = x.bank_group.name;
      vm.bankClassList.push(classInfo);
    });
    vm.resultClassList = vm.bankClassList;
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
        // 과목명으로 검색
        case 'SEARCH_BY_NAME': {
          if (vm.searchName === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 과목명을 입력해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultClassList = [];
          const res = bankService.getBankClassByName({
            name: vm.searchName,
          });
          res.then(function(sre) {  // eslint-disable-line
            sre.data.classList.forEach((x) => {
              const classInfo = {};
              classInfo.name = x.name;
              classInfo.desc = x.description;
              classInfo.classId = x.class_id;
              const cr1 = x.created_at.substr(0, 10);
              const cr2 = x.created_at.substr(11, 8);
              classInfo.createTime = cr1.concat(' ', cr2);
              const up1 = x.updated_at.substr(0, 10);
              const up2 = x.updated_at.substr(11, 8);
              classInfo.updateTime = up1.concat(' ', up2);
              classInfo.groupId = x.bank_group.group_id;
              classInfo.groupName = x.bank_group.name;
              vm.resultClassList.push(classInfo);
            });
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
          vm.resultClassList = [];
          const res = bankService.getBankClassByGroup({
            id: vm.selectGroup,
          });
          res.then(function(sre) {  // eslint-disable-line
            sre.data.classList.forEach((x) => {
              const classInfo = {};
              classInfo.name = x.name;
              classInfo.desc = x.description;
              classInfo.classId = x.class_id;
              const cr1 = x.created_at.substr(0, 10);
              const cr2 = x.created_at.substr(11, 8);
              classInfo.createTime = cr1.concat(' ', cr2);
              const up1 = x.updated_at.substr(0, 10);
              const up2 = x.updated_at.substr(11, 8);
              classInfo.updateTime = up1.concat(' ', up2);
              classInfo.groupId = x.bank_group.group_id;
              classInfo.groupName = x.bank_group.name;
              vm.resultClassList.push(classInfo);
            });
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
          vm.resultClassList = [];
          const res = bankService.getBankClassByKeyword({
            keyArray: vm.searchKeywordList,
          });
          res.then(function(sre) {  // eslint-disable-line
            sre.data.classList.forEach((x) => {
              const classInfo = {};
              classInfo.name = x.name;
              classInfo.desc = x.description;
              classInfo.classId = x.class_id;
              const cr1 = x.created_at.substr(0, 10);
              const cr2 = x.created_at.substr(11, 8);
              classInfo.createTime = cr1.concat(' ', cr2);
              const up1 = x.updated_at.substr(0, 10);
              const up2 = x.updated_at.substr(11, 8);
              classInfo.updateTime = up1.concat(' ', up2);
              classInfo.groupId = x.bank_group.group_id;
              classInfo.groupName = x.bank_group.name;
              vm.resultClassList.push(classInfo);
            });
          });
          break;
        }
        // 검색 결과 초기화  & 선택 내용 초기화
        case 'INIT_RESULT': {
          vm.searchName = '';
          vm.selectGroup = '';
          vm.searchKey = '';
          vm.searchKeywordList = [];
          vm.resultClassList = vm.bankClassList;
          vm.$refs.multipleTable.clearSelection();
          break;
        }
        // 선택된 과목들 가져오기
        case 'BRING_CLASS': {
          // 선택된 과목이 없을 경우
          if (vm.multipleSelection.length === 0) {
            vm.$notify({
              title: '알림',
              message: '선택된 과목이 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.multipleSelection.forEach((x) => {
            bankService.bankToClass({
              class_id: x.classId,
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

