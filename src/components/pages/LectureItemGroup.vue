<template>
  <div id="lecture_item_group" class="bt-container">
    <h2>
      아이템 활성화 시간 설정 (무인)
      <!--
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
      </el-popover>-->
    </h2>
    <!--
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
    </div>-->
    <div>
      <el-table :data="groupList" style="width: 1150px;">
        <el-table-column label="아이템 그룹화 목록">
          <template slot-scope="scope">
            <el-tag v-for="(k, index) in scope.row.list" :key="index">{{ k.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="활성화 시간" v-if="lectureType !== 0" width="150px" prop="start" />
        <el-table-column label="비활성화 시간" v-if="lectureType !== 0" width="150px" prop="end" />
        <el-table-column width="160px">
          <template slot-scope="scope">
            <el-button size="small" @click="onClick('NEW_TIME', scope.row)">활성화 시간 변경</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 10px;" />
    <div v-if="ifTimeMode">
      <el-tag v-for="(k, index) in newGroupList" :key="index">{{ k.name }}</el-tag>
      <el-time-picker v-model="startTime" v-if="lectureType !== 0" placeholder="활성화 시간" style="width: 150px; margin-left: 20px;" default-value="0" />
      <el-time-picker v-model="endTime" v-if="lectureType !== 0" placeholder="비활성화 시간" style="width: 150px;" default-value="0" />
      <el-button type="primary" @click="onClick('GROUP_LC_ITEM')">
        시간 변경
      </el-button>
      <el-button @click="onClick('CANCEL_GROUP_MODE')">
        취소
      </el-button>
      <p>&#42; 활성화/비활성화 시간은 강의 시작 시점이 기준입니다.</p>
      <p>예) 아이템을 강의 시작후 5분째에 보여주고 10분째에 내리고 싶을 경우, 활성화 시간은 00:05:00, 비활성화 시간은 00:10:00으로 설정해주세요.</p>
    </div>
    <div style="height: 10px;" />
    <div>
    <div v-if="videoLink === ''">
      등록된 영상이 없습니다.
    </div>
    <div v-else>
      강의 영상
      <youtube
        id="video"
        :video-id="youtubeId"
        player-width="480px"
        player-height="360px"
        :player-vars="{ autoplay: 1, modestbranding: 1 }"
        :mute="true">
      </youtube>
    </div></div>
    <div style="text-align: right;">
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')" style="margin-right: 20px;">뒤로 가기</el-button>
      </a>
    </div>
  </div>
  
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed';
import lectureItemService from '../../services/lectureItemService';
import lectureService from '../../services/lectureService';

export default {
  name: 'LectureItemGroup',
  data() {
    return {
      groupList: [], // 연결된 그룹 리스트
      newGroupList: [], // 새로 연결할 그룹 리스트
      ifTimeMode: false, // 시간 변경 모드인지
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
      lectureStart: '', // 강의 시작 시간 - 무인[단체]
      lectureEnd: '', // 강의 끝 시간 - 무인[단체]
      gid: -1, // 시간 변경할 그룹의 id
      gList: [], // 그룹의 linked list
      videoLink: '',
    };
  },
  async created() {
    const vm = this;
    const lecture = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    // 아이템 리스트
    vm.itemList = lecture.data.lecture_items;
    vm.itemList.forEach((x) => {
      x.listId = ''; // eslint-disable-line
    });

    // 비디오 링크
    if (lecture.data.video_link !== null) {
      vm.videoLink = lecture.data.video_link;
    }

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

    // [무인] 단체에서 강의 그룹화 시간 제한
    if (vm.lectureType === 1) {
      vm.lectureStart = tm.data.start_time;
      vm.lectureEnd = tm.data.end_time;
    }

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
    youtubeId() {
      const vm = this;
      return getIdFromURL(vm.videoLink);
    },
  },
  methods: {
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
        // 시간 변경 확정
        case 'GROUP_LC_ITEM': {
          let startT = 0;
          let endT = 0;
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
          startT = (vm.startTime.getTime() / 1000) - 946652400;
          endT = (vm.endTime.getTime() / 1000) - 946652400;
          // 아이템 활성화 시간이 비활성화 시간보다 늦다면 아이템이 종료되지 않음 -> 막아야 함
          if (startT > endT) {
            vm.$notify({
              title: '알림',
              message: '아이템 활성화 시간이 비활성화 시간보다 늦습니다.',
              type: 'warning',
            });
            break;
          }
          // 활성화-비활성화 시간이 강의 시간 내에 있는지
          const s = new Date(vm.lectureStart);
          const e = new Date(vm.lectureEnd);
          // 총 강의 시간
          const lectureTime = (e - s) / 1000;
          if (endT >= lectureTime) {
            // 총 강의 시간보다 아이템이 늦게 종료되면 안 됨
            vm.$notify({
              title: '알림',
              message: '아이템은 강의 시간 내에서 활성화/비활성화 되어야 합니다.',
              type: 'warning',
            });
            break;
          }

          // 기존의 아이템 그룹과 시간 겹치는지 테스트
          let overlap = false;
          vm.groupList.forEach((x) => {
            // 현재 변경하는 아이템 그룹과는 겹쳐도 됨 (당연히)
            if (x.gid !== vm.gid) {
              const sM = parseInt((x.start.split(':')[0]), 10);
              const sS = parseInt((x.start.split(':')[1]), 10);
              const eM = parseInt((x.end.split(':')[0]), 10);
              const eS = parseInt((x.end.split(':')[1]), 10);
              const sT = (sM * 60) + sS; // 초 단위로 변환
              const eT = (eM * 60) + eS; // 초 단위로 변환
              if (!((startT < sT && endT < sT) || (startT > eT && endT > eT))) {
                // 새 그룹의 시작시간과 끝시간이 기존 그룹의 시작시간보다 빠르거나
                // 새 그룹의 시작시간과 끝시간이 기존 그룹의 끝시간보다 느리면 통과
                // 둘 다 해당 안 될 경우 시간이 겹친다는 의미
                overlap = true;
              }
            }
          });
          if (overlap === true) {
            vm.$notify({
              title: '알림',
              message: '이미 존재하는 아이템 그룹과 활성화 시간이 겹칩니다. 그룹 간 최소 시간 간격은 1초입니다.',
              type: 'error',
            });
            break;
          }
          const tmp = [];
          vm.newGroupList.forEach((x) => {
            if (tmp.includes(x.listId) === false) {
              tmp.push(x.listId);
            }
          });
          lectureItemService.editGroup({
            lectureId: vm.lectureId,
            iList: vm.gList,
            groupId: vm.gid,
            start: startT,
            end: endT,
          }).then(() => {
            // 성공했을 경우 알림 메시지
            vm.$notify({
              title: '알림',
              message: '성공적으로 변경되었습니다.',
              type: 'success',
            });
            // 프론트 갱신
            vm.groupList = [];
            vm.refreshGroupList();
            // 성공했을 경우 아이템 연결 리스트 삭제
            vm.newGroupList = [];
            vm.ifTimeMode = false;
            vm.gid = -1;
            vm.gList = [];
          });
          break;
        }
        // 아이템 시간 변경
        case 'NEW_TIME': {
          if (vm.ifTimeMode === true) {
            vm.$notify({
              title: '알림',
              message: '이미 시간 변경중입니다.',
              type: 'error',
            });
            break;
          }
          vm.ifTimeMode = true;
          vm.gid = data.gid;
          const grp = await lectureItemService.showGroup({
            lectureId: vm.lectureId,
          });
          grp.data.list.forEach((x) => {
            if (x.group_id === vm.gid) {
              x.list_ids.forEach((y) => {
                vm.gList.push(parseInt(y, 10));
              });
            }
          });
          data.list.forEach((x) => {
            vm.newGroupList.push(x);
          });
          break;
        }
        // 그룹화 취소
        case 'CANCEL_GROUP_MODE': {
          vm.ifTimeMode = false;
          vm.newGroupList = [];
          vm.startTime = '';
          vm.endTime = '';
          vm.gid = -1;
          vm.gList = [];
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