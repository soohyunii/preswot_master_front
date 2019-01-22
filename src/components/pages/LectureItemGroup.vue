<template>
  <div id="lecture_item_group" class="bt-container">
    <h2>
      아이템 그룹화
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
    <div>
      <el-table :data="lcConnectionList" style="width: 1150px;">
        <el-table-column label="연결된 아이템 목록">
          <template slot-scope="scope">
            <el-tag v-for="(k, index) in scope.row" :key="index" style="margin-right: 5px;">{{ k.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120px">
          <template slot-scope="scope">
            <el-button @click="newGroup(scope.row)">그룹화</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="ifGroupMode">
      <el-tag v-for="(k, index) in newGroupList" :key="index">{{ k.name }}</el-tag>
      <el-time-picker v-model="startTime" placeholder="활성화 시간" style="width: 180px;" default-value="0" />
      ~
      <el-time-picker v-model="endTime" placeholder="비활성화 시간" style="width: 180px;" default-value="0" />
      <el-button type="primary" @click="onClick('GROUP_LC_ITEM')">
        그룹화
      </el-button>
      <el-button @click="onClick('CANCEL_GROUP_MODE')">
        취소
      </el-button>
      <!--<p>&#42; 연결된 아이템일 경우, 맨 앞의 아이템이 대표로 나타납니다.</p>-->
    </div>
    <div style="height: 30px;" />
    <div>
      <el-table :data="groupList" style="width: 1150px;">
        <el-table-column label="아이템 그룹화 목록">
          <template slot-scope="scope">
            <el-tag v-for="(k, index) in scope.row.list" :key="index">{{ k.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="활성화 시간" v-if="lectureType !== 0" width="150px" prop="start" />
        <el-table-column label="비활성화 시간" v-if="lectureType !== 0" width="150px" prop="end" />
        <el-table-column width="150px">
          <template slot-scope="scope">
            <el-button @click="onClick('DELETE_GROUP', scope.row)">그룹화 해제</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')" style="margin-right: 20px;">뒤로 가기</el-button>
      </a>
    </div>
  </div>
</template>


<script>
import lectureItemService from '../../services/lectureItemService';
import lectureService from '../../services/lectureService';

export default {
  name: 'LectureItemGroup',
  data() {
    return {
      groupList: [], // 연결된 그룹 리스트
      newGroupList: [], // 새로 연결할 그룹 리스트
      ifGroupMode: false, // 아이템 그룹 모드인지
      lcConnectionList: [],
      itemList: [],
      lccNum: -1,
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
      lectureType: '', // 0-유인 1-무인단체 2-무인개인
      startTime: '', // 무인강의에서 지정해 줄 아이템 시작시간
      endTime: '', // 무인강의에서 지정해 줄 아이템 끝시간
    };
  },
  async created() {
    const vm = this;
    const lecture = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    vm.itemList = lecture.data.lecture_items;

    vm.itemList.forEach((x) => {
      x.listId = ''; // eslint-disable-line
    });

    // 셔플방지 연결된 문항 판별
    const res = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    res.data.forEach((x) => {
      // 연결 문항에 대해
      if (x.linked_list.includes('<$!<>')) {
        // 연결 문항이 여러 개
        const splicedItem = x.linked_list.split('<$!<>');
        splicedItem.forEach((y) => {
          vm.itemList.forEach((z) => {
            if (z.lecture_item_id === parseInt(y, 10)) {
              z.listId = x.lecture_item_list_id; // eslint-disable-line
            }
          });
        });
      } else if (x.linked_list !== '') {
        // 연결 문항이 한 개
        vm.itemList.forEach((y) => {
          if (y.lecture_item_id === parseInt(x.linked_list, 10)) {
            y.listId = x.lecture_item_list_id; // eslint-disable-line
          }
        });
      }
    });

    // 아이템 순서대로 정렬
    vm.itemList.sort((a, b) => {
      const aItemSequence = Number(a.sequence);
      const bItemSequence = Number(b.sequence);
      return aItemSequence - bItemSequence;
    });
    // 타입 수정
    vm.itemList.forEach((x) => {
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

    /* 기능 삭제 - 181214
    // 아이템 리스트 처음부터 보면서 linkId 없으면 생성
    vm.itemList.forEach((x) => {
      if (x.listId === '') {
        const tmp = [];
        tmp.push(x.lecture_item_id);
        lectureItemService.makeConnection({
          lectureId: vm.lectureId,
          iList: tmp,
        });
      }
    });
    // 새로운 연결 - 연결 안된 단독 아이템들에 linkId 부여
    const ress = await lectureItemService.showConnection({
      lectureId: vm.lectureId,
    });
    ress.data.forEach((x) => {
      vm.itemList.forEach((y) => {
        if (y.listId === '' && y.lecture_item_id === x.item_id) {
          y.listId = x.lecture_item_list_id; // eslint-disable-line
        }
      });
    });
    */

    // lecture type === 0-유인 1-무인단체 2-무인개인
    const tm = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    vm.lectureType = tm.data.type;

    const staT = new Date(tm.data.start_time);
    const endT = new Date(tm.data.end_time);
    const diffT = (endT - staT) / 1000; // 단위는 초
    console.log(diffT);

    // 아이템 리스트 만들기
    let lin = [];
    vm.itemList.forEach((x) => {
      if (x.listId !== '') {
        if (vm.lccNum === -1) {
          // 첫 아이템인 경우
          lin.push(x);
          vm.lccNum = x.listId;
        } else if (vm.lccNum === x.listId) {
          // 연결되는 아이템
          lin.push(x);
        } else if (vm.lccNum !== x.listId) {
          // 새로운 연결
          vm.lcConnectionList.push(lin);
          lin = [];
          lin.push(x);
          vm.lccNum = x.listId;
        }
      }
    });
    vm.lcConnectionList.push(lin);

    vm.refreshGroupList();
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.lectureId, 10);
    },
  },
  methods: {
    async newGroup(data) {
      const vm = this;
      if (vm.ifGroupMode === false) {
        // 첫번째 아이템 추가라면
        vm.ifGroupMode = true;
        data.forEach((x) => {
          vm.newGroupList.push(x);
        });
      } else {
        // 이후 아이템 추가라면
        if (vm.newGroupList.includes(data[0])) { // eslint-disable-line
          vm.$notify({
            title: '알림',
            message: '이미 선택한 아이템입니다.',
            type: 'warning',
          });
        } else {
          data.forEach((x) => {
            vm.newGroupList.push(x);
          });
        }
      }
    },
    async refreshGroupList() {
      // 이미 만들어진 그룹 정보 가져오기
      const vm = this;
      const rest = await lectureItemService.showGroup({
        lectureId: vm.lectureId,
      });
      rest.data.list.forEach((x) => {
        const tempt = {};
        tempt.gid = x.group_id;
        tempt.list = [];
        if (vm.lectureType !== 0) { // 무인강의일 경우
          const s = x.start;
          const e = x.end;
          let sS = s % 60;
          const sM = (s - sS) / 60;
          let eS = e % 60;
          const eM = (e - eS) / 60;
          if (sS < 10) { sS = `0${sS}`; }
          if (eS < 10) { eS = `0${eS}`; }
          tempt.start = `${sM}:${sS}`;
          tempt.end = `${eM}:${eS}`;
        }
        x.list_ids.forEach((y) => {
          vm.itemList.forEach((z) => {
            if (z.listId === parseInt(y, 10)) {
              const newf = {};
              newf.id = z.listId;
              newf.name = z.name;
              tempt.list.push(newf);
            }
          });
        });
        vm.groupList.push(tempt);
      });
    },
    async onClick(type, data) {
      const vm = this;
      switch (type) {
        // 새로운 아이템 그룹화
        case 'GROUP_LC_ITEM': {
          // 그룹화할 아이템이 없는 경우
          if (vm.newGroupList.length < 1) {
            vm.$notify({
              title: '알림',
              message: '그룹화할 아이템을 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 시간 설정 안했을 경우 오류 메시지
          if (vm.startTime === '' || vm.endTime === '') {
            vm.$notify({
              title: '알림',
              message: '아이템의 활성화 시간과 비활성화 시간을 설정해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 아이템 그룹의 활성화 시간과 비활성화 시간 설정
          const startT = (vm.startTime.getTime() / 1000) - 946652400;
          const endT = (vm.endTime.getTime() / 1000) - 946652400;
          // 아이템 활성화 시간이 비활성화 시간보다 늦다면 아이템이 종료되지 않음 -> 막아야 함
          if (startT > endT) {
            vm.$notify({
              title: '알림',
              message: '아이템 활성화 시간이 비활성화 시간보다 늦습니다.',
              type: 'warning',
            });
            break;
          }
          // 중복 검사
          let dup = false;
          vm.newGroupList.forEach((x) => {
            vm.groupList.forEach((y) => {
              y.list.forEach((z) => {
                if (x.listId === z.id) {
                  dup = true;
                }
              });
            });
          });
          if (dup === true) {
            vm.$notify({
              title: '알림',
              message: '이미 그룹화된 아이템입니다.',
              type: 'error',
            });
            vm.newGroupList = [];
            break;
          }
          const tmp = [];
          vm.newGroupList.forEach((x) => {
            if (tmp.includes(x.listId) === false) {
              tmp.push(x.listId);
            }
          });
          lectureItemService.makeGroup({
            lectureId: vm.lectureId,
            iList: tmp,
            start: startT,
            end: endT,            
          }).then(() => {
            // 성공했을 경우 알림 메시지
            vm.$notify({
              title: '알림',
              message: '성공적으로 그룹화되었습니다.',
              type: 'success',
            });
            // 프론트 갱신
            vm.groupList = [];
            vm.refreshGroupList();
            // 성공했을 경우 아이템 연결 리스트 삭제
            vm.newGroupList = [];
            vm.ifGroupMode = false;
          });
          break;
        }
        // 아이템 그룹화 삭제
        case 'DELETE_GROUP': {
          const gid = data.gid;
          // 서버에서 삭제
          lectureItemService.deleteGroup({
            groupId: gid,
          }).then(() => {
            // 성공했을 경우 알림 메시지
            vm.$notify({
              title: '알림',
              message: '성공적으로 해제되었습니다.',
              type: 'success',
            });
            // 프론트 갱신
            let deleteGNum = -1;
            vm.groupList.forEach((x, index) => {
              if (x.gid === gid) {
                deleteGNum = index;
              }
            });
            vm.groupList.splice(deleteGNum, 1);
          });
          break;
        }
        // 그룹화 취소
        case 'CANCEL_GROUP_MODE': {
          vm.ifGroupMode = false;
          vm.newGroupList = [];
          vm.startTime = '';
          vm.endTime = '';
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