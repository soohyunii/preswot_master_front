<template>
  <div id="tlm_tab_lecture_item_edit_wrapper">
    <!-- 존나 신기하게 functional component는 v-show를 안먹는다 -->
    <div v-show="!isEditing">
      <!-- <div class="ps-align-right">
        TODO: 자동 모드 toggle
      </div> -->
      <lecture-item-list
        @delete="onClickDeleteLectureItem"
        @edit="onClickEditLectureItem"
        @simulate="onClickSimulateLectureItem"
        type="TEACHER"
        :list="lectureItemList"
        :sortableOptions="sortableOptions"
        :lectureType="lectureType"
      />

      <el-dialog
        title="미리 보기"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        center
        width="30%">
        <lecture-live-item
          :data="lectureItem"
          :onClick="onClick"
          :answerSubmitted="isSubmitted"
          type="TEACHER"/>
        <br />
        <br />
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">닫기</el-button>
        </span>
      </el-dialog>

      <div v-if="connectMode">
        <el-tag v-for="(k, index) in connectList" :key="index">{{ k.name }}</el-tag>
        <el-button type="primary" @click="onClick('CONNECT_LC_ITEM')">
          연결
        </el-button>
        <el-button @click="onClick('CANCEL_CONNECT_MODE')">
          취소
        </el-button>
        <p>&#42; 맨 앞의 아이템이 대표 아이템으로 등록됩니다.</p>
      </div>

      <div class="ps-align-right">
        <br />
        <router-link :to="`/a/teacher/NNlecture/itemconnection?lectureId=${lectureId}`">
          <el-button type="primary">아이템 연결 관리</el-button>
        </router-link>
        <!--
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_LC_ITEM_SEQUENCE')" type="primary">
          강의 아이템 순서 저장
        </el-button>-->
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_NEW_LC_ITEM')" type="primary">
          강의 아이템 추가
        </el-button>
        <router-link :to="`/a/teacher/NNlecture/newitemfrombank?lectureId=${lectureId}`">
          <el-button type="primary" :class="$attachReactablePostfix('right-align-btn')">
            <div class="right-align-btn-layer">아이템은행에서 가져오기</div>
          </el-button>
        </router-link>
      </div>
    </div>
    <div v-if="ifShowCList">
      <el-table :data="connectedList">
        <el-table-column label="대표 아이템" width="300px">
          <template slot-scope="scope">
            <!--<el-tag v-for="(k, index) in scope.row" :key="index">{{ k.name }}</el-tag>-->
            {{ scope.row.leader }}
          </template>
        </el-table-column>
        <el-table-column label="연결된 아이템 목록">
          <template slot-scope="scope">
            <el-tag v-for="(k, index) in scope.row.list" :key="index">{{ k }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200px">
          <template slot-scope="scope">
            <el-button @click="onClick('DELETE_CONNECTION', scope.row)">연결 삭제</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ps-align-right">
        <el-button @click="onClick('CLOSE_CONNECTION_MODE')">
          닫기
        </el-button>
      </div>
    </div>
    <div v-if="isEditing">
      <el-button @click="onClick('CANCEL_EDIT')" icon="el-icon-back"> 뒤로 가기</el-button>
      <lecture-item-editor :numOfLectureItem="numOfLectureItem" />
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import LectureItemList from '../partials/LectureItemList';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';
import LectureItemEditor from '../partials/LectureItemEditor';
import LectureLiveItem from '../partials/LectureLiveItem';
import studentService from '../../services/studentService';
// import { deflateRaw } from 'zlib';
// import { POINT_CONVERSION_COMPRESSED } from 'constants';

// * 드래그 앤 드롭으로 테이블 행 순서 변경
// * https://buefy.github.io/#/extensions/sortablejs
// * TODO: 강의 순서에 대한 변수 생성(at backend) 후, start_time을 순서 변수로 변경
const createSortable = (el, options, vnode) => { //eslint-disable-line

  let sequence = []; //eslint-disable-line
  return Sortable.create(el, {
    ...options,
    // onStart() {
    //   // when the sort starts, store the initial order of the array
    //   sequence = this.toArray(); //eslint-disable-line
    // },
    onEnd(evt) {
      // when the sort ends, set the order to the initial state
      // this.sort(sequence); //eslint-disable-line
      // change the order using splice
      const data = vnode.context.lectureItemList;
      data.splice(evt.newIndex, 0, ...data.splice(evt.oldIndex, 1));
    },
  });
};

/**
 * We add a new instance of Sortable when the element
 * is bound or updated, and destroy it when it's unbound.
 */
const sortable = {
  name: 'sortable',
  bind(el, binding, vnode) {
    const table = el.querySelector('.el-table__body-wrapper');
    table._sortable = createSortable(table.querySelector('tbody'), binding.value, vnode); //eslint-disable-line
  },
  update(el, binding, vnode) {
    const table = el.querySelector('.el-table__body-wrapper');
    table._sortable.destroy(); //eslint-disable-line
    table._sortable = createSortable(table.querySelector('tbody'), binding.value, vnode); //eslint-disable-line
  },
  unbind(el) {
    const table = el.querySelector('.el-table__body-wrapper');
    table._sortable.destroy(); //eslint-disable-line
  },
};

export default {
  name: 'TlmLectureItemEditTab',
  directives: { sortable },
  components: {
    LectureItemList,
    LectureItemEditor,
    LectureLiveItem,
  },
  data() {
    return {
      sortableOptions: {
        chosenClass: 'is-selected',
      },
      dialogVisible: false,
      lectureItem: undefined,
      currentLectureItemId: -1,
      isSubmitted: false,
      lectureType: 0,
      // 아이템 연결하는 화면인지
      connectMode: false,
      // 연결할 아이템 리스트
      connectList: [],
      // 리스트의 마지막 값
      lastConnect: -1,
      // 연결된 아이템 리스트
      connectedList: [],
      // 아이템 리스트 현황 보여주는지
      ifShowCList: false,
    };
  },
  computed: {
    ...mapState('lc', [
      'lecture',
    ]),
    ...mapGetters('lcItem', [
      'isEditing',
    ]),
    lectureItemList() {
      const lecture = this.$store.state.lc.lecture;
      if (lecture && Array.isArray(lecture.lecture_items)) {
        const lectureItemList = lecture.lecture_items.map((x) => {
          x.type = utils.convertLcItemTypeKor(x.type); // eslint-disable-line no-param-reassign
          x.offset = utils.convertSecondTohhmmss(x.offset); // eslint-disable-line no-param-reassign
          return x;
        });
        // * sequence 순서대로 강의 아이템 정렬
        lectureItemList.sort((a, b) => {
          const aItemSequence = Number(a.sequence);
          const bItemSequence = Number(b.sequence);
          return aItemSequence - bItemSequence;
        });
        return lectureItemList;
      }
      return [];
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
    },
    numOfLectureItem() {
      const vm = this;
      return vm.lectureItemList.length;
    },
  },
  methods: {
    ...mapActions('lc', [
      'getLecture',
    ]),
    ...mapMutations('lcItem', [
      'updateCurrentEditingLectureItemId',
      'updateLectureItem',
    ]),
    async onClick(type, data) {
      // const vm = this;
      switch (type) {
        // 아이템 연결
        case 'CONNECT_LC_ITEM': {
          const vm = this;
          // 연결할 아이템이 없거나 한개일 경우
          if (vm.connectList.length < 2) {
            vm.$notify({
              title: '알림',
              message: '연결할 아이템을 두개 이상 선택해 주세요.',
              type: 'warning',
            });
            break;
          }
          const tmp = [];
          vm.connectList.forEach((x) => {
            tmp.push(x.id);
          });
          lectureItemService.makeConnection({
            lectureId: vm.$route.params.lectureId,
            iList: tmp,
          }).then(() => {
            // 성공했을 경우 아이템 연결 리스트 삭제
            vm.connectList = [];
            // 아이템 연결 목록 화면이 보여지고 있을 경우, 리스트 갱신
            if (vm.ifShowCList === true) {
              vm.connectLcItemList();
            }
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
        // 아이템 연결 삭제
        case 'DELETE_CONNECTION': {
          const vm = this;
          const delId = data.leaderId;
          // 서버에서 삭제
          lectureItemService.deleteConnection({
            lectureItemId: delId,
          });
          // 프론트에서 삭제
          let delFId = -1;
          vm.connectedList.forEach((x, index) => {
            if (x.leaderId === delId) {
              delFId = index;
            }
          });
          vm.connectedList.splice(delFId, 1);
          break;
        }
        // 아이템 연결 취소
        case 'CANCEL_CONNECT_MODE': {
          this.connectList = [];
          this.connectMode = false;
          break;
        }
        // 아이템 연결 화면 닫기
        case 'CLOSE_CONNECTION_MODE': {
          this.ifShowCList = false;
          break;
        }
        case 'ADD_LC_ITEM_SEQUENCE': {
          // 연결된 아이템이 있을 경우 순서 변경 불가
          const res = await lectureItemService.showConnection({
            lectureId: this.$route.params.lectureId,
          });
          if (res.data.length !== 0) {
            this.$notify({
              title: '알림',
              message: '연결된 아이템이 있을 경우, 아이템 순서를 변경할 수 없습니다.',
              type: 'warning',
            });
            break;
          }
          this.lectureItemList.forEach((item, index) => {
            lectureItemService.putLectureItem({
              lectureItemId: item.lecture_item_id,
              sequence: index + 1,
            });
          });
          break;
        }
        case 'ADD_NEW_LC_ITEM': {
          this.ifShowCList = false;
          this.connectMode = false;
          this.connectList = [];
          this.updateCurrentEditingLectureItemId({
            currentEditingLectureItemId: -1,
          });
          break;
        }
        case 'CANCEL_EDIT': {
          this.updateCurrentEditingLectureItemId({
            currentEditingLectureItemId: null,
          });
          break;
        }
        case 'SUBMIT': {
          this.isSubmitted = true;
          switch (this.lectureItem.type) {
            case 0: { // 문항
              studentService.submitQuestion({
                questionId: data.questionId,
                answers: data.answer,
                interval: 0,
                codeLanguage: data.language,
              });
              this.$notify({
                title: '알림',
                message: '제출하였습니다.',
                type: 'success',
              });
              this.lectureItem = undefined;
              this.refreshLectureItem(this.currentLectureItemId);
              break;
            }
            case 1: { // 설문
              studentService.submitSurvey({
                surveyId: data.surveyId,
                answer: data.answer,
              });
              this.lectureItem = undefined;
              this.refreshLectureItem(this.currentLectureItemId);
              break;
            }
            default: {
              throw new Error(`not defined type ${type}`);
            }
          }
          break;
        }
        default: {
          throw new Error(`not defined type ${type}`);
        }
      }
    },
    // 아이템 연결 리스트에 선택한 아이템 추가
    async onClickConnectLectureItem(arg) {
      const vm = this;
      const lectureItemId = arg.lecture_item_id;
      // 만약 리스트가 비어있지 않고
      if (vm.connectList.length !== 0) {
        // 리스트의 마지막 아이템의 다음 줄에 위치한 아이템이 아닐 경우
        const thisSeq = arg.sequence;
        if (vm.lastConnect !== thisSeq - 1) {
          vm.$notify({
            title: '알림',
            message: '테이블에서 연속된 아이템이 아니면 연결할 수 없습니다. 테이블 순서를 먼저 저장해주세요.',
            type: 'warning',
          });
          return;
        }
      }
      // 마지막 번호 갱신
      vm.lastConnect = arg.sequence;
      // 이미 리스트에 있다면 중복 방지
      let ifDupli = false;
      vm.connectList.forEach((x) => {
        if (x.id === lectureItemId) {
          vm.$notify({
            title: '알림',
            message: '이미 리스트에 추가된 아이템입니다.',
            type: 'warning',
          });
          ifDupli = true;
        }
      });
      if (ifDupli === true) {
        return;
      }
      // 없다면 리스트에 넣어줌
      vm.connectMode = true;
      const tmp = {};
      tmp.id = lectureItemId;
      const res = await lectureItemService.getLectureItem({ lectureItemId });
      tmp.name = res.data.name;
      vm.connectList.push(tmp);
    },
    // 아이템 연결 리스트에서 한 항목 삭제
    deleteConnectItem(index) {
      this.connectList.splice(index, 1);
    },
    // 아이템 연결 리스트 보여주기
    async connectLcItemList() {
      const vm = this;
      vm.ifShowCList = true;
      vm.connectedList = [];
      const res = await lectureItemService.showConnection({
        lectureId: vm.$route.params.lectureId,
      });
      let i = 0;
      let j = 0;
      for (i = 0; i < res.data.length; i += 1) {
        const nowConnect = {};
        const lectureItemId = res.data[i].item_id;
        nowConnect.leaderId = lectureItemId;
        const po = await lectureItemService.getLectureItem({ lectureItemId }); // eslint-disable-line
        nowConnect.leader = po.data.name;

        const namugi = res.data[i].linked_list;
        // 대표문항에 연결된 아이템들이 여러 개
        if (namugi.includes('<$!<>') === true) {
          const namugiSplit = namugi.split('<$!<>');
          const tmp = [];
          for (j = 0; j < namugiSplit.length; j += 1) {
            const lectureItemIds = namugiSplit[j];
            const pw = await lectureItemService.getLectureItem({ // eslint-disable-line
              lectureItemId: lectureItemIds,
            });
            tmp.push(pw.data.name);
          }
          nowConnect.list = tmp;
        } else { // 대표문항에 연결된 아이템이 하나
          const pws = await lectureItemService.getLectureItem({ // eslint-disable-line
            lectureItemId: namugi,
          });
          nowConnect.list = [];
          nowConnect.list.push(pws.data.name);
        }
        vm.connectedList.push(nowConnect);
      }
    },
    onClickEditLectureItem(lectureItemId) {
      this.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: lectureItemId,
      });
    },
    /**
     * 얘는 onClick에서 넘겨주면 index를 못받아와서 안됨
     */
    async onClickSimulateLectureItem(lectureItemId) {
      const vm = this;
      const res = await lectureItemService.getLectureItem({ lectureItemId });
      await lectureItemService.putLectureItem({
        lectureItemId,
        opened: 1,
      });
      vm.currentLectureItemId = lectureItemId;
      vm.dialogVisible = true;
      vm.lectureItem = res.data;
    },
    async onClickDeleteLectureItem(index) {
      const vm = this;
      const targetLectureItem = vm.lectureItemList[index];

      // 그룹이 아닌 경우 -> 그냥 삭제하면 됨
      // 단독 그룹이자 단독 리스트 -> 삭제하면서 리스트, 그룹 삭제
      // 복수 그룹이자 단독 리스트 -> 삭제 방지
      const res = await lectureItemService.showConnection({
        lectureId: this.$route.params.lectureId,
      });
      let listN;
      let mainItemId;
      let listNm;
      res.data.forEach((x) => {
        if (x.linked_list.includes('<$!<>') === true) {
          const spl = x.linked_list.split('<$!<>');
          spl.forEach((y) => {
            if (parseInt(y, 10) === targetLectureItem.lecture_item_id) {
              listN = x.lecture_item_list_id;
              listNm = spl.length;
              mainItemId = x.item_id;
            }
          });
        } else if (parseInt(x.linked_list, 10) === targetLectureItem.lecture_item_id) {
          listN = x.lecture_item_list_id;
          listNm = 1;
          mainItemId = x.item_id;
        }
      });

      const rest = await lectureItemService.showGroup({
        lectureId: this.$route.params.lectureId,
      });
      let dupGrp = false;
      let ifGrp = '';
      rest.data.list.forEach((z) => {
        // 어떤 그룹에 속하는데 다른 아이템과 함께 그룹을 이룰 경우 삭제 불가
        if (z.list_ids.includes(`${listN}`) === true) {
          ifGrp = z.group_id;
          if (listNm > 1 || z.list_ids.length > 1) {
            dupGrp = true;
          }
        }
      });
      if (dupGrp === true) {
        vm.$notify({
          title: '알림',
          message: '다른 아이템과 그룹을 이루고 있을 경우, 삭제가 불가능합니다.',
          type: 'warning',
        });
        return;
      }

      vm.$confirm('정말로 이 아이템을 삭제하시겠습니까?', `${targetLectureItem.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            // 아이템 삭제
            await lectureItemService.deleteLectureItem({
              lectureItemId: targetLectureItem.lecture_item_id,
            });
            // 연결 리스트 삭제
            await lectureItemService.deleteConnection({
              lectureItemId: mainItemId,
            });
            // 그룹 삭제 (있다면)
            if (ifGrp !== '') {
              await lectureItemService.deleteGroup({
                groupId: ifGrp,
              });
            }
            await vm.lectureItemList.forEach((item, i) => {
              if (item.sequence - 1 > index) {
                lectureItemService.putLectureItem({
                  lectureItemId: vm.lectureItemList[i].lecture_item_id,
                  sequence: item.sequence - 1,
                });
              }
            });
            // TODO: delete lectureItem from lecture.lecture_items
            await vm.getLecture({ lectureId: vm.lectureId });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '강의 아이템 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '강의 아이템 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
    refreshLectureItem(lectureItemId) {
      const vm = this;
      // opened 상태인 아이템이 있다면 보이기 : 빠른 속도로 아이템 보임/숨김 조작하는 경우 버그 해결하기위해 1초 지연
      setTimeout(async () => {
        const res3 = await lectureItemService.getLectureItem({ lectureItemId });
        if (res3.data !== null) {
          vm.lectureItem = res3.data;
        } else {
          vm.lectureItem = undefined;
        }
      }, 1000);
    },
    handleClose() {
      const vm = this;
      vm.dialogVisible = false;
      if (vm.isSubmitted) {
        if (vm.lectureItem.type === 0) {
          studentService.deleteQuestionAnswerLog({
            questionId: vm.lectureItem.questions[0].question_id,
          });
        } else if (vm.lectureItem.type === 1) {
          studentService.deleteSurveyAnswerLog({
            surveyId: vm.lectureItem.surveys[0].survey_id,
          });
        }
      }
      lectureItemService.putLectureItem({
        lectureItemId: vm.lectureItem.lecture_item_id,
        opened: 0,
      });
      vm.isSubmitted = false;
    },
  },
  async mounted() {
    await this.getLecture({ lectureId: this.lectureId });
    this.lectureType = this.lecture.type;
  },
};
</script>
