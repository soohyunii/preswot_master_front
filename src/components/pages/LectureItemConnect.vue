<template>
  <div id="lecture_item_connect" class="bt-container">
    <h2>
      아이템 그룹화/순서화
      <el-popover
        style="position: relative; left: 30px; top: 3px;"
        placement="top-start"
        width="600"
        trigger="hover">
        <el-table :data="notice">
          <el-table-column width="150" property="title" label="상태"></el-table-column>
          <el-table-column width="450" property="content" label="내용"></el-table-column>
        </el-table>
        <i class="el-icon-question fa-lg" slot="reference"></i>
      </el-popover>
    </h2>
    <el-table :data="lectureItemList" style="width: 1150px;">
      <el-table-column label="번호" prop="sequence" width="80px" align="center"></el-table-column>
      <el-table-column label="타입" prop="type" width="100px" align="center"></el-table-column>
      <el-table-column label="이름" prop="name" align="center"></el-table-column>
      <el-table-column label="그룹" prop="group" width="80px" align="center"></el-table-column>
      <el-table-column label="" width="100px" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.group === ''" size="small" @click="newGroup(scope.row)">그룹화</el-button>
          <el-button v-else size="small" @click="delGroup(scope.row)">해제</el-button>
        </template>
      </el-table-column>
      <el-table-column label="순서 연결" prop="fix" width="80px" align="center"></el-table-column>
      <el-table-column label="" width="100px" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fix === ''" size="small" @click="newConnect(scope.row)">순서화</el-button>
          <el-button v-else size="small" @click="delConnect(scope.row)">해제</el-button>
        </template>
      </el-table-column>
      <!-- 작업 중 임시로 그룹 id, 리스트 id 확인하기 위해 넣은 column
      <el-table-column label="그룹" prop="gN" width="80px" align="center"></el-table-column>
      <el-table-column label="리스트" prop="list" width="80px" align="center"></el-table-column> -->
    </el-table>
    <div v-if="ifConnectMode">
      <el-tag v-for="(k, index) in newConnectList" :key="index">{{ k.name }}</el-tag>
      <el-button type="primary" @click="onClick('CONNECT_LC_ITEM')">
        순서화
      </el-button>
      <el-button @click="onClick('CANCEL_CONNECT_MODE')">
        취소
      </el-button>
      <!--<p>&#42; 맨 앞의 아이템이 대표 아이템으로 등록됩니다.</p>-->
    </div>
    <div v-if="ifGroupMode">
      <el-tag v-for="(k, index) in newGroupList" :key="index">{{ k.name }}</el-tag>
        <el-button type="primary" @click="onClick('GROUP_LC_ITEM')">
          그룹화
        </el-button>
        <el-button @click="onClick('CANCEL_GROUP_MODE')">
          취소
        </el-button>
    </div>
    <div>
      <!--
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
      </el-table>-->
    </div>
    <div style="height: 10px;" />
    <div style="text-align: right;">
      <a href="javascript:history.back();">
        <el-button @click="onClick('BACK')" style="margin-right: 20px;">뒤로 가기</el-button>
      </a>
      <!--
      <router-link :to="`/a/teacher/NNlecture/itemgroup?lectureId=${lectureId}`" v-if="lectureType !== 0">
        <el-button type="primary" style="margin-right: 20px;">활성화 시간 설정</el-button>
      </router-link>-->
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
      groupList: [], // 연결된 아이템 리스트
      newGroupList: [], // 새로 그룹화할 아이템 리스트
      connectList: [], // 연결된 아이템 리스트
      newConnectList: [], // 새로 연결할 아이템 리스트
      ifGroupMode: false, // 그룹화 모드인지
      ifConnectMode: false, // 아이템 연결 모드인지
      lectureItemList: [],
      // ifGroupExist: false, // 그룹화가 존재하는지
      lectureType: '', // 0-유인 1-무인단체 2-무인개인
      notice: [{ // 강사용 도움말
        title: '1단계 - 아이템 그룹화',
        content: '아이템은 그룹 단위로 보여집니다. ' +
                  '강의 중 보여줄 순서대로 그룹을 설정해주세요. ' +
                  '그룹에 속하지 않은 아이템은 강의 중 활성화되지 않습니다.',
      }, {
        title: '2단계 - 아이템 순서화',
        content: '그룹 안의 아이템들은 기본적으로 순서가 랜덤하게 셔플되는데, ' +
                  '같은 순서화로 묶인 아이템들은 순서가 셔플되지 않고 유지됩니다. ' +
                  '같은 그룹에 속한 아이템 내에서만 순서화가 가능합니다.',
      }, {
        title: '3단계 - 그룹 시간 설정 (무인강의 전용)',
        content: '강사가 수동으로 아이템을 활성화하지 않는 무인 강의의 경우, ' +
                  '그룹별로 활성화 시간을 설정해주는 추가 작업이 필요합니다.',
      },
      ],
    };
  },
  async created() {
    const vm = this;
    // lecture type === 0-유인 1-무인단체 2-무인개인
    const tm = await lectureService.getLecture({
      lectureId: vm.lectureId,
    });
    vm.lectureType = tm.data.type;
    vm.renewal();
  },
  computed: {
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.query.lectureId, 10);
    },
  },
  methods: {
    // 페이지 새로고침
    async renewal() {
      const vm = this;
      const lecture = await lectureService.getLecture({
        lectureId: vm.lectureId,
      });
      const itemList = lecture.data.lecture_items;

      // 아이템 순서대로 정렬
      itemList.sort((a, b) => {
        const aItemSequence = Number(a.sequence);
        const bItemSequence = Number(b.sequence);
        return aItemSequence - bItemSequence;
      });

      // 타입 수정
      itemList.forEach((x) => {
        // 아이템 그룹 초기화
        x.group = ''; // eslint-disable-line
        x.fix = ''; // eslint-disable-line
        x.fixx = 0; // eslint-disable-line
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
      // 강의 아이템 목록, 과목, 강의명 가져오기
      /*
      const res = await lectureService.getLecture({
        lectureId: vm.lectureId,
      }); */
      const grp = await lectureItemService.showGroup({
        lectureId: vm.lectureId,
      });
      const seq = await lectureItemService.showConnection({
        lectureId: vm.lectureId,
      });
      let groupNum = 1;
      let listNum = 1;
      let listSubNum = 1;
      grp.data.list.forEach((x) => {
        x.list_ids.forEach((y) => {
          seq.data.forEach((z) => {
            if (parseInt(y, 10) === z.lecture_item_list_id) {
              // 연결리스트 아이템이 여러개라면
              if (z.linked_list.includes('<$!<>')) {
                const spl = z.linked_list.split('<$!<>');
                spl.forEach((w) => {
                  // 연결리스트에 속하는 각 아이템에 대해
                  itemList.forEach((v) => {
                    if (parseInt(w, 10) === v.lecture_item_id) {
                      v.fix = `${listNum} - ${listSubNum}`; // eslint-disable-line
                      v.group = groupNum; // eslint-disable-line
                      v.gN = x.group_id; // eslint-disable-line
                      v.fixx = 1; // eslint-disable-line
                    }
                  });
                  listSubNum += 1;
                });
                listNum += 1;
                listSubNum = 1;
              } else {
                // 연결리스트 아이템이 한 개 - 고정 X
                itemList.forEach((v) => {
                  if (parseInt(z.linked_list, 10) === v.lecture_item_id) {
                    v.fix = ''; // eslint-disable-line
                    v.group = groupNum; // eslint-disable-line
                    v.gN = x.group_id; // eslint-disable-line
                    v.fixx = 1; // eslint-disable-line
                  }
                });
              }
            }
          });
        });
        groupNum += 1;
      });

      // 연결 리스트는 모든 아이템에 있지만 그룹은 없을 수도 있음
      seq.data.forEach((z) => {
        // 연결리스트 아이템이 여러개라면
        if (z.linked_list.includes('<$!<>')) {
          const spl = z.linked_list.split('<$!<>');
          spl.forEach((w) => {
            // 연결리스트에 속하는 각 아이템에 대해
            itemList.forEach((v) => {
              if (parseInt(w, 10) === v.lecture_item_id) {
                v.list = z.lecture_item_list_id; // eslint-disable-line
                v.fixx = 1; // eslint-disable-line
              }
            });
          });
          listNum += 1;
        } else {
          // 연결리스트 아이템이 한 개 - 고정 X
          itemList.forEach((v) => {
            if (parseInt(z.linked_list, 10) === v.lecture_item_id) {
              v.list = z.lecture_item_list_id; // eslint-disable-line
              v.fixx = 1; // eslint-disable-line
            }
          });
        }
      });

      // 혹시 연결 리스트 설정 안 된 아이템이 있다면 단일 연결 리스트로 다 묶어주기
      for (let i = 0; i < itemList.length; i += 1) {
        const x = itemList[i];
        if (x.fixx === 0) {
          const tmp = [];
          tmp.push(x.lecture_item_id);
          const a = await lectureItemService.makeConnection({ // eslint-disable-line
            lectureId: vm.lectureId,
            iList: tmp,
          });
          itemList[i].fixx = 1;
          itemList[i].fix = ''; // 단일 아이템 추가
          itemList[i].list = a.data.lecture_item_list_id;
        }
      }
      vm.lectureItemList = itemList;
    },
    // 새로운 아이템 그룹화
    async newGroup(data) {
      const vm = this;
      if (vm.ifConnectMode === true) {
        // 연결화 진행중이라면
        vm.$notify({
          title: '알림',
          message: '아이템 연결이 진행중입니다.',
          type: 'warning',
        });
        return;
      }
      if (vm.ifGroupMode === false) {
        // 첫번째 아이템 추가라면
        vm.ifGroupMode = true;
        vm.newGroupList.push(data);
      } else {
        // 이후 아이템 추가라면 중복인지 찾아봐야 함
        const thisId = data.lecture_item_id;
        let ok = true;
        vm.newGroupList.forEach((x) => {
          if (x.lecture_item_id === thisId) {
            ok = false;
          }
        });
        // 중복 아니면 넣어주고
        if (ok === true) {
          vm.newGroupList.push(data);
        } else { // 중복이면 out
          vm.$notify({
            title: '알림',
            message: '이미 선택된 아이템입니다.',
            type: 'warning',
          });
        }
      }
    },
    // 새로운 아이템 연결 생성
    async newConnect(data) {
      const vm = this;
      if (vm.ifGroupMode === true) {
        // 그룹화 진행중이라면
        vm.$notify({
          title: '알림',
          message: '아이템 그룹화가 진행중입니다.',
          type: 'warning',
        });
        return;
      }
      if (vm.ifConnectMode === false) {
        // 첫번째 아이템 추가라면
        vm.ifConnectMode = true;
        vm.newConnectList.push(data);
      } else {
        // 이후 아이템 추가라면 중복인지 찾아봐야 함
        const thisId = data.lecture_item_id;
        let ok = true;
        vm.newConnectList.forEach((x) => {
          if (x.lecture_item_id === thisId) {
            ok = false;
          }
        });
        // 중복 아니면 넣어주고
        if (ok === true) {
          vm.newConnectList.push(data);
        } else { // 중복이면 out
          vm.$notify({
            title: '알림',
            message: '이미 선택된 아이템입니다.',
            type: 'warning',
          });
        }
      }
    },
    // 아이템 그룹 해제
    async delGroup(data) {
      const vm = this;
      const gN = data.gN;
      vm.$confirm('이 그룹을 해제하시겠습니까? 그룹에 속한 아이템 연결도 함께 해제됩니다.', '그룹화 해제', {
        confirmButtonText: '해제',
        cancelButtonText: '취소',
        type: 'warning',
      }).then(() => {
        // 우선 그룹 해제
        lectureItemService.deleteGroup({
          groupId: gN,
        });
        // 그룹에 속한 연결리스트 찾아서
        const idList = [];
        vm.lectureItemList.forEach((x) => {
          if (gN === x.gN) {
            idList.push(x.lecture_item_id);
          }
        });
        // 연결리스트 전부 해제하고 다시 각각을 연결 리스트로 만들기
        vm.tmpConnectionX(idList);
        // 알림 메시지 출력
        vm.$notify({
          title: '알림',
          message: '성공적으로 해제되었습니다.',
          type: 'warning',
        });
      }).catch(() => { // eslint-disable-line
        return; // eslint-disable-line
      });
    },
    // 아이템 연결 해제
    async delConnect(data) {
      const vm = this;
      const whatGroup = data.group;
      const gN = data.gN; // 그룹 번호
      const lN = data.list; // 연결리스트 번호
      vm.$confirm('이 아이템 연결을 해제하시겠습니까?', '연결 해제', {
        confirmButtonText: '해제',
        cancelButtonText: '취소',
        type: 'warning',
      }).then(() => {
        const originalLinkedList = [];
        // 해제할 그룹에 들어있는 연결리스트 뽑아내기
        vm.lectureItemList.forEach((x) => {
          if (x.group === whatGroup) {
            if (originalLinkedList.includes(x.list) === false) {
              originalLinkedList.push(x.list);
            }
          }
        });
        // 삭제할 연결리스트 빼고 기존 연결리스트만 남기기
        const pe = originalLinkedList.indexOf(lN);
        originalLinkedList.splice(pe, 1);

        vm.tmpConnectionZ(gN, lN, originalLinkedList);
      }).catch(() => { // eslint-disable-line
        return; // eslint-disable-line
      });
    },
    // 그룹화 해제 - 비동기 문제 때문에 연결리스트 해제하고 다시 만들고 새로고침하는 부분 별도의 함수로
    async tmpConnectionX(idList) {
      const vm = this;
      for (let i = 0; i < idList.length; i += 1) {
        const x = idList[i];
        await lectureItemService.deleteConnection({ // eslint-disable-line
          lectureItemId: x,
        });
      }
      idList.forEach((x) => {
        const tmp = [];
        tmp.push(x);
        lectureItemService.makeConnection({
          lectureId: vm.lectureId,
          iList: tmp,
        });
      });
      vm.renewal();
    },
    // 연결 - 비동기 문제 때문에 연결리스트 해제하고 하나로 합치는 부분 별도의 함수로
    // 연결 리스트 전부 해제 -> 연결리스트 묶고 -> 그룹 정보 수정
    async tmpConnectionY(idList, originalLinkedList) {
      const vm = this;
      const origin = originalLinkedList;
      const gg = idList[0].gN;
      // 연결리스트 전부 해제
      for (let i = 0; i < idList.length; i += 1) {
        const x = idList[i].lecture_item_id;
        await lectureItemService.deleteConnection({ // eslint-disable-line
          lectureItemId: x,
        });
      }
      // 연결리스트 다시 하나로 묶고
      const tmp = [];
      idList.forEach((x) => {
        tmp.push(x.lecture_item_id);
      });
      const newLL = await lectureItemService.makeConnection({
        lectureId: vm.lectureId,
        iList: tmp,
      });
      origin.push(newLL.data.lecture_item_list_id);
      // 그룹 정보 수정
      await lectureItemService.editGroupNo({
        lectureId: vm.lectureId,
        iList: origin,
        groupId: gg,
      });
      // 성공했을 경우 알림 메시지
      vm.$notify({
        title: '알림',
        message: '성공적으로 연결되었습니다.',
        type: 'success',
      });
      // 프론트 갱신
      vm.newConnectList = [];
      vm.ifConnectMode = false;
      vm.renewal();
    },
    // 연결 해제 - 비동기 문제 때문에 연결리스트 해제하고 각각 묶고 그룹화하는 부분 별도의 함수로
    // 연결 리스트 해제 -> 각각 연결 리스트로 다시 묶기 -> 그룹 정보 수정
    async tmpConnectionZ(gN, lN, originalLinkedList) {
      const vm = this;
      const origin = originalLinkedList;
      const reList = [];
      // 해제할 리스트의 아이템 아이디들
      vm.lectureItemList.forEach((x) => {
        if (x.list === lN) {
          reList.push(x.lecture_item_id);
        }
      });
      // 연결 리스트 해제
      const cnn = await lectureItemService.showConnection({
        lectureId: vm.lectureId,
      });
      // 삭제할 리스트의 대표 아이템
      let delN;
      cnn.data.forEach((x) => {
        if (x.lecture_item_list_id === lN) {
          delN = x.item_id;
        }
      });
      await lectureItemService.deleteConnection({
        lectureItemId: delN,
      });
      // 각각 연결 리스트로 다시 묶기
      for (let i = 0; i < reList.length; i += 1) {
        const x = reList[i];
        const tmp = [];
        tmp.push(x);
        // 아이템 연결
        const newLL = await lectureItemService.makeConnection({ // eslint-disable-line
          lectureId: vm.lectureId,
          iList: tmp,
        });
        // 새 연결 리스트의 id 추가
        origin.push(newLL.data.lecture_item_list_id);
      }
      // 그룹 정보 수정
      await lectureItemService.editGroupNo({
        lectureId: vm.lectureId,
        iList: origin,
        groupId: gN,
      });
      // 바로 새로고침할 경우 반영이 안 돼서 1초 강제 시간 지연
      setTimeout(() => {
        // 성공했을 경우 알림 메시지
        vm.$notify({
          title: '알림',
          message: '연결이 해제되었습니다.',
          type: 'success',
        });
        // 프론트 갱신
        vm.lectureItemList = [];
        vm.renewal();
      }, 1000);
    },
    async onClick(type) {
      const vm = this;
      switch (type) {
        // 그룹화
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
          // 선택한 아이템들의 연결 리스트 id를 골라서 묶어주기
          const tmp = [];
          vm.newGroupList.forEach((x) => {
            tmp.push(x.list);
          });
          lectureItemService.makeGroupNo({
            lectureId: vm.lectureId,
            iList: tmp,
          }).then(() => {
            // 성공했을 경우 알림 메시지
            if (vm.lectureType === 0) {
              // 유인강의에서 메시지
              vm.$notify({
                title: '알림',
                message: '성공적으로 그룹화되었습니다.',
                type: 'success',
              });
            } else {
              // 무인강의에서 메시지 - 활성화 시간 설정 안내
              vm.$notify({
                title: '알림',
                message: '성공적으로 그룹화되었습니다. "활성화 시간 설정"에서 활성화 시간을 설정해주세요.',
                type: 'success',
              });
            }
            // 프론트 갱신
            vm.renewal();
            // 성공했을 경우 아이템 그룹화 리스트 삭제
            vm.newGroupList = [];
            vm.ifGroupMode = false;
          });
          break;
        }
        // 새로운 연결 추가
        case 'CONNECT_LC_ITEM': {
          // 연결할 아이템이 없거나 하나인 경우
          if (vm.newConnectList.length < 2) {
            vm.$notify({
              title: '알림',
              message: '연결할 아이템을 두 개 이상 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          // 동일 그룹인지 체크
          let checkSameGroup = true;
          const whatGroup = vm.newConnectList[0].group;
          vm.newConnectList.forEach((x) => {
            if (x.group !== whatGroup) {
              checkSameGroup = false;
            }
          });
          if (checkSameGroup === false) {
            vm.$notify({
              title: '알림',
              message: '동일한 그룹에 속한 아이템만 연결할 수 있습니다.',
              type: 'warning',
            });
            break;
          }
          // 그룹에 속하지 않은 아이템들이라면
          if (whatGroup === '') {
            vm.$notify({
              title: '알림',
              message: '그룹에 속한 아이템만 연결할 수 있습니다.',
              type: 'warning',
            });
            break;
          }
          // 우선 그룹 해제하기
          const originalLinkedList = [];
          // 해제할 그룹에 들어있는 연결리스트 뽑아내기
          vm.lectureItemList.forEach((x) => {
            if (x.group === whatGroup) {
              if (originalLinkedList.includes(x.list) === false) {
                originalLinkedList.push(x.list);
              }
            }
          });
          // 삭제할 연결리스트 빼고 기존 연결리스트만 남기기
          vm.newConnectList.forEach((x) => {
            if (originalLinkedList.includes(x.list) === true) {
              const pe = originalLinkedList.indexOf(x.list);
              originalLinkedList.splice(pe, 1);
            }
          });
          // 연결 리스트 전부 해제 -> 연결리스트 묶고 -> 그룹 정보 수정
          vm.tmpConnectionY(vm.newConnectList, originalLinkedList);
          break;
        }
        /* 아이템 연결 삭제
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
        } */
        // 그룹화 취소
        case 'CANCEL_GROUP_MODE': {
          vm.ifGroupMode = false;
          vm.newGroupList = [];
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