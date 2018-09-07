<template>
  <div id="bank-class-container">
    <div v-show="!isAdd">
      <h3>과목 은행</h3>
      <el-table
        ref="multipleTable"
        :data="bankClassList"
        max-height="400">
        <el-table-column label="과목명">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="과목 소개">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="소속 그룹" width="150px">
          <template slot-scope="scope">{{ scope.row.group_name }}</template>
        </el-table-column>
        <el-table-column label="저작일" width="120px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="저장일" width="120px">
          <template slot-scope="scope">{{ scope.row.storeTime }}</template>
        </el-table-column>
      </el-table>
      <div style="height: 10px;" />
      <el-button type="primary" @click="onClick('ADD_NEW_CLASS')">과목 저장</el-button>
    </div>
    <div v-show="isAdd">
      <h3>과목 저장하기</h3>
      <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      <div style="height: 10px;" />
      <el-tabs type="card" @tab-click="onClick('TAB_CHANGE')">
        <el-tab-pane label="과목명으로 검색">
          <el-input placeholder="과목명으로 검색" prefix-icon="el-icon-search" v-model="searchName" style="width: 300px;"></el-input>
          <el-button type="primary" @click="onClick('SEARCH_BY_NAME')">검색</el-button>
          <el-button @click="onClick('RESET_SEARCH')">초기화</el-button>
        </el-tab-pane>
        <el-tab-pane label="키워드로 검색">
          <el-input placeholder="검색할 키워드" prefix-icon="el-icon-search" v-model="searchKey" style="width: 300px;"></el-input>
          <el-button @click="onClick('NEW_KEYWORD', searchKey)">키워드 추가</el-button>
          <br />
          <div style="height: 10px;" />
          <el-tag v-for="(value, index) in searchKeywordList" :key="value" closable @close="deleteKeyword(index)" style="margin-right: 5px;">{{ value }}</el-tag>
          <el-button type="primary" @click="onClick('SEARCH_BY_KEYWORD')">검색</el-button>
          <el-button @click="onClick('RESET_SEARCH')">초기화</el-button>
        </el-tab-pane>
      </el-tabs>
      <div style="height: 50px;" />
      <el-table ref="multipleTable" :data="resultClassList" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="과목명">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="과목 설명">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="저작일" width="160px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="최종 수정일" width="160px">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>
        <!--<el-table-column width="120px">
          <el-button slot-scope="scope" @click="classDetail(scope.row)">과목 상세</el-button>
        </el-table-column>-->
      </el-table>
      <div style="height: 10px;" />
      <el-select v-model="selectGroup" placeholder="그룹 선택">
        <el-option v-for="item in group" :key="item.group_id" :label="item.name" :value="item.group_id"></el-option>
      </el-select>
      <el-button type="primary" @click="saveClass()">과목 저장하기</el-button>
    </div>
  </div>
</template>

<script>
import bankService from '../../services/bankService';
import lectureService from '../../services/lectureService';

export default {
  name: 'BankClass',
  data() {
    return {
      searchName: '',
      searchKey: '',
      selectGroup: '',
      isAdd: false,
      searchKeywordList: [],
      resultClassList: [],
      myClassList: [],
      group: [],
      multipleSelection: [],
      bankClassList: [],
    };
  },
  async mounted() {
    const vm = this;
    vm.isAdd = false;
    // 은행의 과목들 받아오기
    const rew = await bankService.getBankClass();
    rew.data.classList.forEach((xx) => {
      const bankClass = {};
      bankClass.name = xx.name;
      bankClass.desc = xx.description;
      bankClass.group_id = xx.bank_group.group_id;
      bankClass.group_name = xx.bank_group.name;
      vm.bankClassList.push(bankClass);
    });
    // 내 과목들 받아오기
    const res = await bankService.getMyClassList();
    res.data.teachingClasses.forEach((x) => {
      const classId = x.class_id;
      const cInfo = bankService.getClassInfo({
        id: classId,
      });
      cInfo.then(function(result) { // eslint-disable-line
        const classInfo = {};
        classInfo.name = result.data.name;
        const cr1 = result.data.created_at.substr(0, 10);
        const cr2 = result.data.created_at.substr(11, 8);
        classInfo.createTime = cr1.concat(' ', cr2);
        const up1 = result.data.updated_at.substr(0, 10);
        const up2 = result.data.updated_at.substr(11, 8);
        classInfo.updateTime = up1.concat(' ', up2);
        classInfo.desc = result.data.description;
        classInfo.class_id = result.data.class_id;
        classInfo.key = [];
        result.data.lectures.forEach((y) => {
          const pam = y.lecture_id;
          const classKey = lectureService.getLectureKeywords({
            lectureId: pam,
          });
          classKey.then(function(keyresult) { // eslint-disable-line
            keyresult.data.forEach((z) => {
              classInfo.key.push(z.keyword);
            });
          });
        });
        vm.myClassList.push(classInfo);
      });
    });
    vm.resultClassList = vm.myClassList;
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
        // 과목을 저장소에 새로 저장하는 화면으로
        case 'ADD_NEW_CLASS': {
          vm.isAdd = true;
          break;
        }
        // 과목저장소 목록으로 돌아가기
        case 'BACK': {
          vm.isAdd = false;
          break;
        }
        // 탭 변경
        case 'TAB_CHANGE': {
          vm.searchName = '';
          vm.searchKey = '';
          vm.searchKeywordList = [];
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
          vm.myClassList.forEach((x) => {
            if (x.name.includes(vm.searchName)) {
              vm.resultClassList.push(x);
            }
          });
          break;
        }
        // 검색할 키워드 추가
        case 'NEW_KEYWORD': {
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
          vm.myClassList.forEach((x) => {
            let ifContain = true;
            vm.searchKeywordList.forEach((y) => {
              if (x.key.includes(y) === false) {
                ifContain = false;
              }
            });
            if (ifContain === true) {
              vm.resultClassList.push(x);
            }
          });
          break;
        }
        // 검색 결과 초기화
        case 'RESET_SEARCH': {
          vm.searchName = '';
          vm.searchKey = '';
          vm.searchKeywordList = [];
          vm.resultClassList = vm.myClassList;
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
    // 과목 상세보기
    classDetail() {
      const vm = this;
      vm.$alert('', '과목 상세', {
        confirmButtonText: '확인',
      });
    },
    // 과목 저장하기
    saveClass() {
      const vm = this;
      // 과목 선택을 안했을 경우
      if (vm.multipleSelection.length === 0) {
        vm.$notify({
          title: '알림',
          message: '은행에 저장할 과목을 선택해주세요.',
          type: 'warning',
        });
        return;
      }
      // 그룹 선택을 안했을 경우
      if (vm.selectGroup === '') {
        vm.$notify({
          title: '알림',
          message: '과목을 저장할 그룹을 선택해주세요.',
          type: 'warning',
        });
        return;
      }
      vm.multipleSelection.forEach((x) => {
        bankService.saveClass({
          class_id: x.class_id,
          group_id: vm.selectGroup,
        });
      });
    },
  },
};
</script>