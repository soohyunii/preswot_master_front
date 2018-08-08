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
      />

      <el-dialog
        title="미리 보기"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        center
        width="30%">
        <lecture-live-item
          :data="lectureItem"
          :onClick="onClick"/>
        <br />
        <br />
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">닫기</el-button>
        </span>
      </el-dialog>

      <div class="ps-align-right">
        <br />
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_LC_ITEM_SEQUENCE')" type="primary">
          강의 아이템 순서 저장
        </el-button>
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_NEW_LC_ITEM')" type="primary">
          강의 아이템 추가
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

import { mapGetters, mapMutations, mapActions } from 'vuex';
import LectureItemList from '../partials/LectureItemList';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';
import LectureItemEditor from '../partials/LectureItemEditor';
import LectureLiveItem from '../partials/LectureLiveItem';
import studentService from '../../services/studentService';
import { EventBus } from '../../event-bus';

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
    };
  },
  computed: {
    ...mapGetters('lcItem', [
      'isEditing',
    ]),
    lectureItemList() {
      const lecture = this.$store.state.lc.lecture;
      if (lecture && Array.isArray(lecture.lecture_items)) {
        const lectureItemList = lecture.lecture_items.map((x) => {
          x.type = utils.convertLcItemTypeKor(x.type); // eslint-disable-line no-param-reassign
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
    onClick(type, data) {
      // const vm = this;
      switch (type) {
        // TODO: 강의 순서에 대한 변수 생성(at backend) 후, start_time을 순서 변수로 변경
        case 'ADD_LC_ITEM_SEQUENCE': {
          this.lectureItemList.forEach((item, index) => {
            lectureItemService.putLectureItem({
              lectureItemId: item.lecture_item_id,
              sequence: index + 1,
            });
          });
          break;
        }
        case 'ADD_NEW_LC_ITEM': {
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
          switch (data[0]) {
            case 0: { // 문항
              studentService.submitQuestion({
                questionId: data[1],
                answers: data[2][0],
                interval: 0,
                codeLanguage: data[3],
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
                surveyId: data[1],
                answer: [data[3]],
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
    onClickEditLectureItem(lectureItemId) {
      console.log('lectureItemId', lectureItemId); // eslint-disable-line
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
      EventBus.$emit('clearAnswer');
      vm.currentLectureItemId = lectureItemId;
      vm.dialogVisible = true;
      vm.lectureItem = res.data;
    },
    onClickDeleteLectureItem(index) {
      const vm = this;
      const targetLectureItem = vm.lectureItemList[index];

      vm.$confirm('정말로 이 아이템을 삭제하시겠습니까?', `${targetLectureItem.name || ''} 삭제`, {
        confirmButtonText: '예, 삭제합니다.',
        cancelButtonText: '아니요, 삭제하지 않습니다.',
        type: 'warning',
      })
        .then(async () => {
          try {
            await lectureItemService.deleteLectureItem({
              lectureItemId: targetLectureItem.lecture_item_id,
            });
            await vm.lectureItemList.forEach((item, i) => {
              if (item.sequence - 1 > index) {
                lectureItemService.putLectureItem({
                  lectureItemId: vm.lectureItemList[i].lecture_item_id,
                  sequence: item.sequence - 1,
                });
              }
            });
            // TODO: delete lectureItem from lecture.lecture_items
            vm.$notify({
              title: '삭제됨',
              message: '강의 아이템이 삭제됨',
              type: 'success',
              duration: 3000,
            });
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
    // TODO: 백엔드 부분에서 선생님이 제출한 로그 삭제하는 api 추가되면, close시 제출 로그 삭제하는 기능 구현하기
    handleClose() {
      const vm = this;
      vm.dialogVisible = false;
    },
  },
};
</script>



