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
    <el-table :data="lectureItemList" style="width: 1150px;">
      <el-table-column label="번호" prop="sequence" width="80px" align="center"></el-table-column>
      <el-table-column label="타입" prop="type" width="100px" align="center"></el-table-column>
      <el-table-column label="이름" prop="name" align="center"></el-table-column>
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
      <!--<p>&#42; 맨 앞의 아이템이 대표 아이템으로 등록됩니다.</p>-->
    </div>
    <div style="height: 30px;" />
    <div>
      <el-table :data="connectList" style="width: 1150px;">
        <el-table-column label="연결된 아이템 목록">
          <template slot-scope="scope">
            <el-tag v-for="(k, index) in scope.row" :key="index">{{ k.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120px">
          <template slot-scope="scope">
            <el-button @click="onClick('DELETE_CONNECTION', scope.row)">연결 삭제</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')" style="margin-right: 20px;">뒤로 가기</el-button>
      </a>
      <router-link :to="`/a/teacher/NNlecture/itemgroup?lectureId=${lectureId}`">
        <el-button type="primary" style="margin-right: 20px;">아이템 그룹화</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import lectureItemService from '../../services/lectureItemService';
import lectureService from '../../services/lectureService';

export default {
  name: 'LectureItemConnect',
  data() {
    return {
      connectList: [], // 연결된 아이템 리스트
      newConnectList: [], // 새로 연결할 아이템 리스트
      ifConnectMode: false, // 아이템 연결 모드인지
      lectureItemList: [],
      ifGroupExist: false, // 그룹화가 존재하는지
      notice: [{ // 강사용 도움말
        title: '아이템 연결',
        content: '순서를 유지시킬 아이템들을 선택할 수 있습니다. ' +
                  '함께 연결된 아이템들은 셔플되지 않고 그 순서가 유지됩니다. ' +
                  '아이템을 단독으로라도 연결 목록에 추가해야 그룹화가 가능합니다. ' +
                  '아이템 연결 작업이 모두 끝난 뒤 그룹화를 진행해 주세요.',
      }, {
        title: '아이템 그룹화',
        content: '강사가 "아이템 보이기"를 할 경우 같은 그룹에 속한 아이템들은 순서가 랜덤하게 ' +
                  '섞여 같이 보여집니다. 연결되어 있는 아이템은 순서가 유지됩니다. ' +
                  '단독으로 보여줄 아이템은 단독으로 그룹화해주세요.',
      }],
    };
  },
  async created() {
    const vm = this;
    const lecture = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    const itemList = lecture.data.lecture_items;

    // 셔플방지 연결된 문항 판별
    const res = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    for (let i = 0; i < res.data.length; i += 1) {
      const x = res.data[i];

      const tmpLinkedItem = [];
      /*
      const cItem = {};
      cItem.id = x.item_id;
      const itemInfo = await lectureItemService.getLectureItem({ // eslint-disable-line
        lectureItemId: x.item_id,
      });
      cItem.name = itemInfo.data.name;
      cItem.listId = x.lecture_item_list_id;
      tmpLinkedItem.push(cItem);
      */

      if (x.linked_list.includes('<$!<>')) {
        // 연결문항이 여러개
        const splicedItem = x.linked_list.split('<$!<>');
        for (let j = 0; j < splicedItem.length; j += 1) {
          const y = splicedItem[j];
          const cItem1 = {};
          const itemInfo1 = await lectureItemService.getLectureItem({ // eslint-disable-line
            lectureItemId: parseInt(y, 10),
          });
          cItem1.id = parseInt(y, 10);
          cItem1.name = itemInfo1.data.name;
          tmpLinkedItem.push(cItem1);
        }
        vm.connectList.push(tmpLinkedItem);
      } else if (x.linked_list !== '') {
        // 연결문항이 한개
        const cItem1 = {};
        const itemInfo1 = await lectureItemService.getLectureItem({ // eslint-disable-line
          lectureItemId: parseInt(x.linked_list, 10),
        });
        cItem1.id = parseInt(x.linked_list, 10);
        cItem1.name = itemInfo1.data.name;
        tmpLinkedItem.push(cItem1);
        vm.connectList.push(tmpLinkedItem);
      }
    }

    // 아이템 순서대로 정렬
    itemList.sort((a, b) => {
      const aItemSequence = Number(a.sequence);
      const bItemSequence = Number(b.sequence);
      return aItemSequence - bItemSequence;
    });
    // 타입 수정
    itemList.forEach((x) => {
      if (x.type === 0) {
        x.type = '문항'; // eslint-disable-line
      } else if (x.type === 1) {
        x.type = '설문'; // eslint-disable-line
      } else if (x.type === 2) {
        x.type = '실습'; // eslint-disable-line
      } else if (x.type === 3) {
        x.type = '토론'; // eslint-disable-line
      } else if (x.type === 4) {
        x.type = '자료'; // eslint-disable-line
      }
    });
    vm.lectureItemList = itemList;

    const rest = await lectureItemService.showGroup({
      lectureId: vm.lectureId,
    });
    if (rest.data.list.length === 0) {
      vm.ifGroupExist = false; // 그룹이 없음
    } else {
      vm.ifGroupExist = true; // 그룹 존재
    }
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.lectureId, 10);
    },
  },
  methods: {
    // 새로운 아이템 연결 생성
    async newConnect(data) {
      const vm = this;
      if (vm.ifGroupExist === true) {
        // 그룹이 있다면
        vm.$notify({
          title: '알림',
          message: '이미 그룹화가 되어 있을 경우, 아이템 연결이 불가능합니다.',
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
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        // 새로운 연결 추가
        case 'CONNECT_LC_ITEM': {
          // 연결할 아이템이 없는 경우
          if (vm.newConnectList.length < 1) {
            vm.$notify({
              title: '알림',
              message: '연결할 아이템을 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 중복 체크
          let checkDup = false;
          vm.newConnectList.forEach((x) => {
            vm.connectList.forEach((y) => {
              y.forEach((z) => {
                if (z.id === x.lecture_item_id) {
                  checkDup = true;
                }
              });
            });
          });
          if (checkDup === true) {
            vm.$notify({
              title: '알림',
              message: '이미 리스트에 존재하는 아이템입니다.',
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
            // 성공했을 경우 알림 메시지
            vm.$notify({
              title: '알림',
              message: '성공적으로 연결되었습니다.',
              type: 'success',
            });
            // 프론트 갱신
            const newFront = [];
            vm.newConnectList.forEach((y) => {
              const newf = {};
              newf.id = y.lecture_item_id;
              newf.name = y.name;
              newFront.push(newf);
            });
            vm.connectList.push(newFront);
            // 성공했을 경우 아이템 연결 리스트 삭제
            vm.newConnectList = [];
            vm.ifConnectMode = false;
          /*
          }).catch(() => {
            // 오류 발생
            vm.$notify({
              title: '알림',
              message: '이미 리스트에 존재하는 아이템입니다asdf.',
              type: 'warning',
            }); */
          });
          break;
        }
        // 아이템 연결 삭제
        case 'DELETE_CONNECTION': {
          if (vm.ifGroupExist === true) {
            // 그룹이 있다면
            vm.$notify({
              title: '알림',
              message: '이미 그룹화가 되어 있을 경우, 연결 삭제가 불가능합니다.',
              type: 'warning',
            });
            break;
          }
          const delId = data[0].id;
          // 서버에서 삭제
          lectureItemService.deleteConnection({
            lectureItemId: delId,
          });
          // 프론트에서 삭제
          let delFId = -1;
          vm.connectList.forEach((x, index) => {
            if (x[0].id === delId) {
              delFId = index;
            }
          });
          vm.connectList.splice(delFId, 1);
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