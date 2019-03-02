<template>
  <div id="bank-lecture-item-container">
    <div v-show="!isAdd">
      <h3>강의 아이템 은행</h3>
      <el-table
        ref="multipleTable"
        :data="bankLectureItemList"
        max-height="400">
        <el-table-column label="아이템 명">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="타입" width="150px">
          <template slot-scope="scope">{{ scope.row.typename }}</template>
        </el-table-column>
        <el-table-column label="소속 그룹" width="150px">
          <template slot-scope="scope">{{ scope.row.group_name }}</template>
        </el-table-column>
        <!--<el-table-column label="저작일" width="120px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="저장일" width="120px">
          <template slot-scope="scope">{{ scope.row.storeTime }}</template>
        </el-table-column>-->
      </el-table>
      <div style="height: 10px;" />
      <el-button type="primary" @click="onClick('ADD_NEW_LECTURE_ITEM')">강의 아이템 저장</el-button>
    </div>
    <div v-show="isAdd">
      <h3>강의 아이템 저장하기</h3>
      <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      <div style="height: 10px;" />
      <el-tabs type="card" @tab-click="onClick('TAB_CHANGE')">
        <el-tab-pane label="아이템명으로 검색">
          <el-input placeholder="아이템명으로 검색" prefix-icon="el-icon-search" v-model="searchName" style="width: 300px;"></el-input>
          <el-button type="primary" @click="onClick('SEARCH_BY_NAME')">검색</el-button>
          <el-button @click="onClick('RESET_SEARCH')">초기화</el-button>
        </el-tab-pane>
        <el-tab-pane label="소속 과목명으로 검색">
          <el-input placeholder="소속 과목명으로 검색" prefix-icon="el-icon-search" v-model="searchClass" style="width: 300px;"></el-input>
          <el-button type="primary" @click="onClick('SEARCH_BY_CLASS')">검색</el-button>
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
      <el-table ref="multipleTable" :data="resultLectureItemList" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="아이템명">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="타입" width="80px">
          <template slot-scope="scope">{{ scope.row.type }}</template>
        </el-table-column>
        <el-table-column label="소속 과목">
          <template slot-scope="scope">{{ scope.row.class }}</template>
        </el-table-column>
        <el-table-column label="소속 강의">
          <template slot-scope="scope">{{ scope.row.lecture }}</template>
        </el-table-column>
        <el-table-column label="저작일" width="180px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="최종 수정일" width="180px">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column width="110px">
          <template slot-scope="scope">
            <el-popover :title="scope.row.name" trigger="click" width="500px">
              <teacher-lecture-live-item
                :lectureItemId="scope.row.id"
                :onClick="onClick"
                style="width: 500px;"
                v-if="ifShow"
              />
              <el-button size="small" slot="reference" @click="onClick('SHOW')">미리 보기</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 10px;" />
      <el-select v-model="selectGroup" placeholder="그룹 선택">
        <el-option v-for="item in group" :key="item.group_id" :label="item.name" :value="item.group_id"></el-option>
      </el-select>
      <el-button type="primary" @click="saveLectureItem()">아이템 저장하기</el-button>
    </div>
  </div>
</template>

<script>
import bankService from '../../services/bankService';
import TeacherLectureLiveItem from '../partials/TeacherLectureLiveItem';

export default {
  name: 'BankLectureItem',
  data() {
    return {
      searchName: '',
      searchKey: '',
      searchClass: '',
      selectGroup: '',
      isAdd: false,
      searchKeywordList: [],
      resultLectureItemList: [],
      myLectureItemList: [],
      group: [],
      multipleSelection: [],
      bankLectureItemList: [],
      ifShow: true,
    };
  },
  async mounted() {
    const vm = this;
    vm.isAdd = false;
    // 은행의 강의 아이템 받아오기
    const rew = await bankService.getBankLectureItem({
      type: 'question',
    });
    rew.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '문항';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    const rew1 = await bankService.getBankLectureItem({
      type: 'survey',
    });
    rew1.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '설문';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    const rew2 = await bankService.getBankLectureItem({
      type: 'codepractice',
    });
    rew2.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '실습';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    const rew3 = await bankService.getBankLectureItem({
      type: 'discussion',
    });
    rew3.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '토론';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    const rew4 = await bankService.getBankLectureItem({
      type: 'note',
    });
    rew4.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '자료';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    const rew5 = await bankService.getBankLectureItem({
      type: 'homework',
    });
    rew5.data.lectureItemList.forEach((xx) => {
      const bankLectureItem = {};
      bankLectureItem.name = xx.name;
      bankLectureItem.type = xx.type;
      bankLectureItem.typename = '과제';
      bankLectureItem.group_id = xx.bank_group.group_id;
      bankLectureItem.group_name = xx.bank_group.name;
      vm.bankLectureItemList.push(bankLectureItem);
    });
    // 내 강의 아이템들 받아오기
    const res = await bankService.getMyClassList();
    res.data.teachingClasses.forEach((x) => {
      const classId = x.class_id;
      const cInfo = bankService.getClassInfo({
        id: classId,
      });
      cInfo.then(function(result) {  // eslint-disable-line
        result.data.lectures.forEach((y) => {
          const lectureId = y.lecture_id;
          const resitem = bankService.getLectureInfo({
            id: lectureId,
          });
          resitem.then(function(rr) {  // eslint-disable-line
            rr.data.lecture_items.forEach((z) => {
              const itemInfo = {};
              itemInfo.name = z.name;
              itemInfo.id = z.lecture_item_id;
              itemInfo.class = result.data.name;
              itemInfo.lecture = rr.data.name;
              const cr1 = z.createdAt.substr(0, 10);
              const cr2 = z.createdAt.substr(11, 8);
              itemInfo.createTime = cr1.concat(' ', cr2);
              const up1 = z.updatedAt.substr(0, 10);
              const up2 = z.updatedAt.substr(11, 8);
              itemInfo.updateTime = up1.concat(' ', up2);
              if (z.type === 0) {
                itemInfo.type = '문항';
              } else if (z.type === 1) {
                itemInfo.type = '설문';
              } else if (z.type === 2) {
                itemInfo.type = '실습';
              } else if (z.type === 3) {
                itemInfo.type = '토론';
              } else if (z.type === 4) {
                itemInfo.type = '자료';
              }
              // itemInfo.key = [];
              // console.log(z.lecture_item_id);
              // 아이템마다 키워드를 받아오는 부분 - 서버에서 검색하고 받아오기로
              /*
              const itemKey = bankService.getLectureItemKeywords({
                id: z.lecture_item_id,
              });
              itemKey.then(function(itemresult) {  // eslint-disable-line
                // console.log(itemresult);
                itemresult.data.forEach((gz) => {
                  itemInfo.key.push(gz.keyword);
                });
              });
              */
              vm.myLectureItemList.push(itemInfo);
            });
          });
        });
      });
      vm.resultLectureItemList = vm.myLectureItemList;
    });
    // 내 그룹 받아오기
    const myg = await bankService.getMyGroup();
    vm.group = myg.data.groupList;
  },
  components: {
    TeacherLectureLiveItem,
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async onClick(type) {
      const vm = this;
      switch (type) {
        // 아이템을 은행에 새로 저장하는 화면으로
        case 'ADD_NEW_LECTURE_ITEM': {
          vm.isAdd = true;
          break;
        }
        // 아이템 은행 목록으로 돌아가기
        case 'BACK': {
          vm.isAdd = false;
          location.reload(true);
          break;
        }
        // 탭 변경
        case 'TAB_CHANGE': {
          vm.searchName = '';
          vm.searchKey = '';
          vm.searchClass = '';
          vm.searchKeywordList = [];
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
          vm.resultLectureItemList = [];
          vm.myLectureItemList.forEach((x) => {
            if (x.name.includes(vm.searchName)) {
              vm.resultLectureItemList.push(x);
            }
          });
          break;
        }
        // 아이템이 속한 과목명으로 검색
        case 'SEARCH_BY_CLASS': {
          if (vm.searchClass === '') {
            vm.$notify({
              title: '알림',
              message: '검색할 과목명을 입력해주세요.',
              type: 'warning',
            });
            break;
          }
          vm.resultLectureItemList = [];
          vm.myLectureItemList.forEach((x) => {
            if (x.class.includes(vm.searchClass)) {
              vm.resultLectureItemList.push(x);
            }
          });
          vm.ifShow = false;
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
          vm.ifShow = false;
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

          vm.resultLectureItemList = [];
          vm.resultLectureItemIdList = [];
          const keywordResult = bankService.getLectureItemByKeyword({
            keyArray: vm.searchKeywordList,
          });
          keywordResult.then(function(result) {  // eslint-disable-line
            result.data.forEach((x) => {
              // 결과 리스트에 없는 아이템이라면
              if (vm.resultLectureItemIdList.includes(x.lecture_item_id) === false) {
                // 결과 리스트에 추가
                vm.resultLectureItemIdList.push(x.lecture_item_id);
                vm.myLectureItemList.forEach((y) => {
                  if (y.id === x.lecture_item_id) {
                    vm.resultLectureItemList.push(y);
                  }
                });
              }
            });
          });
          vm.ifShow = false;
          break;
        }
        // 검색 결과 초기화
        case 'RESET_SEARCH': {
          vm.searchName = '';
          vm.searchKey = '';
          vm.searchClass = '';
          vm.searchKeywordList = [];
          vm.resultLectureItemList = vm.myLectureItemList;
          break;
        }
        // 강의 아이템 미리보기에서 제출버튼 방지
        case 'SUBMIT': {
          vm.$notify({
            title: '알림',
            message: '이 버튼은 현재 수강중인 학생만 이용할 수 있습니다.',
            type: 'warning',
          });
          break;
        }
        case 'SHOW': {
          vm.ifShow = true;
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
    // 강의 아이템 저장하기
    saveLectureItem() {
      const vm = this;
      // 과목 선택을 안했을 경우
      if (vm.multipleSelection.length === 0) {
        vm.$notify({
          title: '알림',
          message: '은행에 저장할 아이템을 선택해주세요.',
          type: 'warning',
        });
        return;
      }
      // 그룹 선택을 안했을 경우
      if (vm.selectGroup === '') {
        vm.$notify({
          title: '알림',
          message: '아이템을 저장할 그룹을 선택해주세요.',
          type: 'warning',
        });
        return;
      }
      vm.multipleSelection.forEach((x) => {
        bankService.saveLectureItem({
          lecture_item_id: x.id,
          group_id: vm.selectGroup,
        });
      });
      vm.$notify({
        title: '알림',
        message: '성공적으로 저장되었습니다.',
        type: 'success',
      });
    },
  },
};
</script>