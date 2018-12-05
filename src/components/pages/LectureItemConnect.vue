<template>
  <div id="lecture_item_connect" class="bt-container">
    <h2>
      아이템 연결하기
      <el-popover
        style="position: relative; left: 30px; top: 3px;"
        placement="top-start"
        width="600"
        trigger="hover">
        <el-table :data="notice">
          <el-table-column width="120" property="title" label="상태"></el-table-column>
          <el-table-column width="480" property="content" label="내용"></el-table-column>
        </el-table>
        <i class="el-icon-question fa-lg" slot="reference"></i>
      </el-popover>
    </h2>
    <!--<lecture-item-list :list="lectureItemList" />-->
    <el-table :data="lectureItemList">
      <el-table-column label="번호" prop="sequence" width="80px" align="center"></el-table-column>
      <el-table-column label="타입" prop="type" width="100px" align="center"></el-table-column>
      <el-table-column label="이름" prop="name" align="center"></el-table-column>
      <el-table-column label="아이템 그룹" width="100px" align="center"></el-table-column>
      <el-table-column label="연결 아이템" prop="shuffle" width="100px" align="center"></el-table-column>
      <el-table-column label="" width="80px" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="newGroup(scope.row)">그룹화</el-button>
        </template>
      </el-table-column>
      <el-table-column label="" width="80px" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="newConnect(scope.row)">연결</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="ifConnectMode">
      <el-tag v-for="(k, index) in newConnectList" :key="index">{{ k.name }}</el-tag>
      <el-button type="primary" @click="onClick('CONNECT_LC_ITEM')">
        연결
      </el-button>
      <el-button @click="onClick('CANCEL_CONNECT_MODE')">
        취소
      </el-button>
      <p>&#42; 맨 앞의 아이템이 대표 아이템으로 등록됩니다.</p>
    </div>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')">뒤로 가기</el-button>
      </a>
    </div>
  </div>
</template>

<script>
import lectureItemService from '../../services/lectureItemService';

export default {
  name: 'LectureItemConnect',
  data() {
    return {
      headerItem: [], // 셔플방지 연결된 대표문항
      linkedItem: [], // 셔플방지 연결된 하위문항들
      newGroupList: [], // 새로 그룹화할 아이템 리스트
      ifGroupMode: false, // 아이템 그룹화 모드인지
      newConnectList: [], // 새로 연결할 아이템 리스트
      ifConnectMode: false, // 아이템 연결 모드인지
      lectureItemList: [],
      notice: [{ // 강사용 도움말
        title: '아이템 그룹화',
        content: '강사가 "아이템 보이기"를 할 경우 같은 그룹에 속한 아이템들은 순서가 랜덤하게 ' +
                  '섞여 같이 보여집니다. 그룹이 설정되지 않은 아이템은 단독으로 보여집니다.',
      }, {
        title: '아이템 연결',
        content: '그룹 내에서 순서를 유지시킬 아이템들을 선택할 수 있습니다. ' +
                  '한 그룹 내에서 연결된 아이템들은 그 순서가 유지됩니다.',
      }],
    };
  },
  async created() {
    const vm = this;
    const lecture = vm.$store.state.lc.lecture;
    const itemList = lecture.lecture_items;

    // 셔플방지 연결된 문항 판별해서 headerItem과 linkedItem으로
    const res = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    res.data.forEach((x) => {
      vm.headerItem.push(x.item_id);
      const tmpLinkedItem = [];
      if (x.linked_list.includes('<$!<>')) {
        // 하위문항이 여러개
        const splicedItem = x.linked_list.split('<$!<>');
        splicedItem.forEach((y) => {
          tmpLinkedItem.push(parseInt(y, 10));
        });
        vm.linkedItem.push(tmpLinkedItem);
      } else {
        // 하위문항이 한개
        tmpLinkedItem.push(parseInt(x.linked_list, 10));
        vm.linkedItem.push(tmpLinkedItem);
      }
    });

    itemList.forEach((x) => {
      // 아이템 하나마다 대표문항or하위문항 판별해서 기록
      if (vm.headerItem.includes(x.lecture_item_id) === true) {
        // 대표문항이라면
        const numb = vm.headerItem.indexOf(x.lecture_item_id);
        x.shuffle = '그룹 ' + (numb + 1); // eslint-disable-line
      } else {
        // 하위문항이라면
        let checkIfLinked = false;
        vm.linkedItem.forEach((y, index) => {
          if (y.includes(x.lecture_item_id)) {
            checkIfLinked = index;
          }
        });
        if (checkIfLinked !== false) {
          x.shuffle = '그룹 ' + (checkIfLinked + 1);  // eslint-disable-line
        } else {
          x.shuffle = ''; // eslint-disable-line
        }
      }
    });
    // 아이템 순서대로 정렬
    itemList.sort((a, b) => {
      const aItemSequence = Number(a.sequence);
      const bItemSequence = Number(b.sequence);
      return aItemSequence - bItemSequence;
    });
    vm.lectureItemList = itemList;
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
  },
  methods: {
    // 새로운 아이템 연결 생성
    async newConnect(data) {
      const vm = this;
      if (vm.ifGroupMode === true) {
        // 만약 이미 그룹화중이라면 진행 불가
        vm.$notify({
          title: '알림',
          message: '그룹화가 진행중입니다.',
          type: 'warning',
        });
        return;
      }
      if (vm.ifConnectMode === false) {
        // 첫번째 아이템 추가라면
        vm.ifConnectMode = true;
        vm.newConnectList.push(data);
      } else {
        // 이후 아이템 추가라면
        const len = vm.newConnectList.length - 1;
        const lastSeq = vm.newConnectList[len].sequence;
        if (data.sequence !== lastSeq + 1) {
          // 기존의 마지막 아이템의 다음 아이템만 추가 가능
          vm.$notify({
            title: '알림',
            message: '연속된 아이템만 연결할 수 있습니다.',
            type: 'warning',
          });
          return;
        }
        vm.newConnectList.push(data);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async onClick(type) {
      const vm = this;
      switch (type) {
        // 연결 추가
        case 'CONNECT_LC_ITEM': {
          // 연결할 아이템이 없거나 한개일 경우
          if (vm.newConnectList.length < 2) {
            vm.$notify({
              title: '알림',
              message: '연결할 아이템을 두개 이상 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          const tmp = [];
          vm.newConnectList.forEach((x) => {
            tmp.push(x.lecture_item_id);
          });
          lectureItemService.makeConnection({
            lectureId: vm.lectureId,
            iList: tmp,
          }).then(() => {
            // 성공했을 경우 아이템 연결 리스트 삭제
            vm.newConnectList = [];
            // 성공했을 경우 알림 메시지
            vm.$notify({
              title: '알림',
              message: '성공적으로 연결되었습니다.',
              type: 'success',
            });
          }).catch(() => {
            // 오류 발생
            vm.$notify({
              title: '알림',
              message: '이미 리스트에 존재하는 아이템입니다.',
              type: 'warning',
            });
          });
          break;
        }
        // 연결 취소
        case 'CANCEL_CONNECT_MODE': {
          vm.ifConnectMode = false;
          vm.newConnectList = [];
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
  },
};
</script>