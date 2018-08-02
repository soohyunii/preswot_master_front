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
        type="TEACHER"
        :list="lectureItemList"
        :sortableOptions="sortableOptions"
      />
      <div class="ps-align-right">
        <br />
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_LC_ITEM_ORDER')" type="primary">
          강의 아이템 순서 저장
        </el-button>
        <el-button id="btn_add_new_lc_item" @click="onClick('ADD_NEW_LC_ITEM')" type="primary">
          강의 아이템 추가
        </el-button>
      </div>
    </div>
    <div v-if="isEditing">
      <el-button @click="onClick('CANCEL_EDIT')" icon="el-icon-back"> 뒤로 가기</el-button>
      <lecture-item-editor />
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

// * 드래그 앤 드롭으로 테이블 행 순서 변경
// * https://buefy.github.io/#/extensions/sortablejs
// * TODO: 강의 순서에 대한 변수 생성(at backend) 후, start_time을 순서 변수로 변경
const createSortable = (el, options, vnode) => { //eslint-disable-line

  let start_time = []; //eslint-disable-line
  return Sortable.create(el, {
    ...options,
    onStart() {
      // when the sort starts, store the initial order of the array
      start_time = this.toArray(); //eslint-disable-line
    },
    onEnd(evt) {
      // when the sort ends, set the order to the initial state
      this.sort(start_time); //eslint-disable-line
      // change the order using splice
      const data = vnode.context.lectureItemList;
      data.splice(evt.newIndex, 0, ...data.splice(evt.oldIndex, 1));
      // now it is safe, you can update the order parameter
      data.forEach((o, i) => {
        o.start_time = i + 1; //eslint-disable-line
      });
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
};

export default {
  name: 'TlmLectureItemEditTab',
  directives: { sortable },
  components: {
    LectureItemList,
    LectureItemEditor,
  },
  data() {
    return {
      sortableOptions: {
        chosenClass: 'is-selected',
      },
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
        // * 먼저 만든 것 기준으로 정렬하기
        // lectureItemList.sort((a, b) => {
        //   const aCreatedAt = new Date(a.createdAt);
        //   const bCreatedAt = new Date(b.createdAt);
        //   return aCreatedAt.getTime() - bCreatedAt.getTime();
        // });
        return lectureItemList;
      }
      return [];
    },
    lectureId() {
      const vm = this;
      return Number.parseInt(vm.$route.params.lectureId, 10);
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
    onClick(type) {
      // const vm = this;
      switch (type) {
        // TODO: 강의 순서에 대한 변수 생성(at backend) 후, start_time을 순서 변수로 변경
        case 'ADD_LC_ITEM_ORDER': {
          this.lectureItemList.forEach((item) => {
            lectureItemService.putLectureItem({
              lectureItemId: item.lecture_item_id,
              startTime: item.start_time,
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
  },
};
</script>



