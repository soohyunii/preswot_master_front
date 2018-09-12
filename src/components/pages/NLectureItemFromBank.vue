<template>
  <div id="lecture_item_from_bank_wrapper" class="bt-container">
    <h2>아이템은행에서 가져오기</h2>
    <div style="height: 10px;" />
    <el-tabs type="card" @tab-click="onClick('TAB_CHANGE')">
      <el-tab-pane label="아이템명으로 검색">
        <el-select v-model="selectType" placeholder="타입 선택">
          <el-option v-for="item in typelist" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input placeholder="아이템명으로 검색" prefix-icon="el-icon-search" v-model="searchName" style="width: 300px;"></el-input>
        <el-button type="primary" @click="onClick('SEARCH_BY_NAME')">검색</el-button>
        <el-button @click="onClick('INIT_RESULT')">결과 초기화</el-button>
      </el-tab-pane>
      <el-tab-pane label="소속 그룹으로 검색">
        <el-select v-model="selectType" placeholder="타입 선택">
          <el-option v-for="item in typelist" :key="item" :label="item" :value="item"></el-option>
        </el-select>
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
        <el-select v-model="selectType" placeholder="타입 선택">
          <el-option v-for="item in typelist" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-tag v-for="(value, index) in searchKeywordList" :key="value" closable @close="deleteKeyword(index)" style="margin-right: 5px;">{{ value }}</el-tag>
        <el-button type="primary" @click="onClick('SEARCH_BY_KEYWORD')">검색</el-button>
        <el-button @click="onClick('INIT_RESULT')">결과 초기화</el-button>
      </el-tab-pane>
    </el-tabs>
    <div style="height: 50px;" />
    <el-table ref="multipleTable" :data="resultLectureItemList" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="아이템명">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="타입">
        <template slot-scope="scope">{{ scope.row.typename }}</template>
      </el-table-column>
      <el-table-column label="소속 그룹">
        <template slot-scope="scope">{{ scope.row.groupName }}</template>
      </el-table-column>
      <!--<el-table-column label="저작일">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="최종 수정일">
        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>-->
    </el-table>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <el-button type="primary" @click="onClick('BRING_LECTURE_ITEM')">선택된 아이템들 가져오기</el-button>
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      </a>
    </div>
  </div>
</template>

<script>
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
      resultLectureItemList: [],
      bankLectureItemList: [],
      typelist: ['전체', '문항', '설문', '실습', '자료', '토론'],
      selectType: '',
    };
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.lectureId, 10);
    },
  },
  async mounted() {
    const vm = this;
    vm.isAdd = false;
    const res = await bankService.getBankLectureItem({
      type: 'question',
    });
    res.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '문항';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
    const res1 = await bankService.getBankLectureItem({
      type: 'survey',
    });
    res1.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '설문';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
    const res2 = await bankService.getBankLectureItem({
      type: 'codepractice',
    });
    res2.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '실습';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
    const res3 = await bankService.getBankLectureItem({
      type: 'discussion',
    });
    res3.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '토론';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
    const res4 = await bankService.getBankLectureItem({
      type: 'note',
    });
    res4.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '자료';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
    const res5 = await bankService.getBankLectureItem({
      type: 'homework',
    });
    res5.data.lectureItemList.forEach((x) => {
      const lectureItemInfo = {};
      lectureItemInfo.name = x.name;
      lectureItemInfo.type = x.type;
      lectureItemInfo.typename = '과제';
      lectureItemInfo.id = x.lecture_item_id;
      lectureItemInfo.groupId = x.bank_group.group_id;
      lectureItemInfo.groupName = x.bank_group.name;
      vm.bankLectureItemList.push(lectureItemInfo);
    });
    vm.resultLectureItemList = vm.bankLectureItemList;
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
          vm.selectGroup = '';
          vm.selectType = '';
          vm.searchKeywordList = [];
          vm.$refs.multipleTable.clearSelection();
          break;
        }
        // 아이템명으로 검색
        case 'SEARCH_BY_NAME': {
          if (vm.searchName === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 아이템명을 입력해주세요.',
              type: 'warning',
            });
            break;
          }
          if (vm.selectType === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 아이템 타입을 선택해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureItemList = [];
          if (vm.selectType === '전체') {
            vm.resultLectureItemList = [];
            const res = bankService.getBankLectureItemByName({
              type: 'question',
              name: vm.searchName,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res1 = bankService.getBankLectureItemByName({
              type: 'codepractice',
              name: vm.searchName,
            });
            res1.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res2 = bankService.getBankLectureItemByName({
              type: 'survey',
              name: vm.searchName,
            });
            res2.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res3 = bankService.getBankLectureItemByName({
              type: 'discussion',
              name: vm.searchName,
            });
            res3.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res4 = bankService.getBankLectureItemByName({
              type: 'note',
              name: vm.searchName,
            });
            res4.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '문항') {
            const res = bankService.getBankLectureItemByName({
              type: 'question',
              name: vm.searchName,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '실습') {
            const res = bankService.getBankLectureItemByName({
              type: 'codepractice',
              name: vm.searchName,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '설문') {
            const res = bankService.getBankLectureItemByName({
              type: 'survey',
              name: vm.searchName,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '토론') {
            const res = bankService.getBankLectureItemByName({
              type: 'discussion',
              name: vm.searchName,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '자료') {
            const res = bankService.getBankLectureItemByName({
              type: 'note',
              name: vm.searchName,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          }
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
          if (vm.selectType === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 아이템 타입을 선택해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureItemList = [];
          if (vm.selectType === '전체') {
            vm.resultLectureItemList = [];
            const res = bankService.getBankLectureItemByGroup({
              type: 'question',
              id: vm.selectGroup,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res1 = bankService.getBankLectureItemByGroup({
              type: 'codepractice',
              id: vm.selectGroup,
            });
            res1.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res2 = bankService.getBankLectureItemByGroup({
              type: 'survey',
              id: vm.selectGroup,
            });
            res2.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res3 = bankService.getBankLectureItemByGroup({
              type: 'discussion',
              id: vm.selectGroup,
            });
            res3.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res4 = bankService.getBankLectureItemByGroup({
              type: 'note',
              id: vm.selectGroup,
            });
            res4.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '문항') {
            const res = bankService.getBankLectureItemByGroup({
              type: 'question',
              id: vm.selectGroup,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '실습') {
            const res = bankService.getBankLectureItemByGroup({
              type: 'codepractice',
              id: vm.selectGroup,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '설문') {
            const res = bankService.getBankLectureItemByGroup({
              type: 'survey',
              id: vm.selectGroup,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '토론') {
            const res = bankService.getBankLectureItemByGroup({
              type: 'discussion',
              id: vm.selectGroup,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '자료') {
            const res = bankService.getBankLectureItemByGroup({
              type: 'note',
              id: vm.selectGroup,
            });
            vm.resultLectureItemList = [];
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          }
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
          if (vm.selectType === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 아이템 타입을 선택해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureItemList = [];
          if (vm.selectType === '전체') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'question',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res1 = bankService.getBankLectureItemByKeyword({
              type: 'codepractice',
              keyArray: vm.searchKeywordList,
            });
            res1.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res2 = bankService.getBankLectureItemByKeyword({
              type: 'survey',
              keyArray: vm.searchKeywordList,
            });
            res2.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res3 = bankService.getBankLectureItemByKeyword({
              type: 'discussion',
              keyArray: vm.searchKeywordList,
            });
            res3.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
            const res4 = bankService.getBankLectureItemByKeyword({
              type: 'note',
              keyArray: vm.searchKeywordList,
            });
            res4.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '문항') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'question',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '문항';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '실습') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'codepractice',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '실습';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '설문') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'survey',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '설문';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '토론') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'discussion',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '토론';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          } else if (vm.selectType === '자료') {
            const res = bankService.getBankLectureItemByKeyword({
              type: 'note',
              keyArray: vm.searchKeywordList,
            });
            res.then(function(sre) {  // eslint-disable-line
              sre.data.lectureItemList.forEach((x) => {
                const lectureItemInfo = {};
                lectureItemInfo.name = x.name;
                lectureItemInfo.type = x.type;
                lectureItemInfo.typename = '자료';
                lectureItemInfo.id = x.lecture_item_id;
                lectureItemInfo.groupId = x.bank_group.group_id;
                lectureItemInfo.groupName = x.bank_group.name;
                vm.resultLectureItemList.push(lectureItemInfo);
              });
            });
          }
          break;
        }
        // 검색 결과 초기화  & 선택 내용 초기화
        case 'INIT_RESULT': {
          vm.searchName = '';
          vm.selectGroup = '';
          vm.searchKey = '';
          vm.searchKeywordList = [];
          vm.selectType = '';
          vm.resultLectureItemList = vm.bankLectureItemList;
          vm.$refs.multipleTable.clearSelection();
          break;
        }
        // 선택된 강의들 가져오기
        case 'BRING_LECTURE_ITEM': {
          // 선택된 강의가 없을 경우
          if (vm.multipleSelection.length === 0) {
            vm.$notify({
              title: '알림',
              message: '선택된 아이템이 없습니다.',
              type: 'warning',
            });
            break;
          }
          vm.multipleSelection.forEach((x) => {
            bankService.bankToLectureItem({
              lecture_item_id: x.id,
              target_lecture_id: vm.lectureId,
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

