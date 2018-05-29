<template>
  <div id="tlm_lecture_item_edit_tab_wrapper">
    This is tlm_lecture_item_edit_tab_wrapper template
    <div class="ps-align-right">
      TODO: 자동 모드 toggle
    </div>
    <!-- 존나 신기하게 functional component는 v-show를 안먹는다 -->
    <div v-show="!isEditing">
      <lecture-item-list
        v-show="null"
        @delete="onClickDeleteLectureItem"
        @edit="onClickEditLectureItem"
        type="TEACHER"
        :list="lectureItemList"
      />
      <div class="ps-align-right">
        <br />
        <el-button @click="onClick('ADD_NEW_LC_ITEM')" type="primary">
          강의 아이템 추가
        </el-button>
      </div>
    </div>
    <div v-show="isEditing">
      <el-button @click="TODOdeleteClick">TODO: Delete this el-button and click listener</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import LectureItemList from '../partials/LectureItemList';
import utils from '../../utils';
import lectureItemService from '../../services/lectureItemService';

export default {
  name: 'TlmLectureItemEditTab',
  components: {
    LectureItemList,
  },
  computed: {
    ...mapGetters('lcItem', [
      'isEditing',
    ]),
    lectureItemList() {
      const lecture = this.$store.state.lc.lecture;
      if (lecture && Array.isArray(lecture.lecture_items)) {
        return lecture.lecture_items.map((x) => {
          x.type = utils.convertScType(x.type); // eslint-disable-line no-param-reassign
          return x;
        });
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('lcItem', [
      'updateCurrentEditingLectureItemId',
      'updateLectureItem',
    ]),
    TODOdeleteClick() {
      this.updateCurrentEditingLectureItemId({
        currentEditingLectureItemId: null,
      });
    },
    onClick(type) {
      // const vm = this;
      switch (type) {
        case 'ADD_NEW_LC_ITEM': {
          this.updateCurrentEditingLectureItemId({
            currentEditingLectureItemId: -1,
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
            vm.$notify({
              title: '삭제됨',
              message: '과목이 삭제됨',
              type: 'success',
              duration: 3000,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            vm.$notify({
              title: '과목 삭제 실패',
              message: error.toString(),
              type: 'error',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          vm.$notify({
            title: '취소됨',
            message: '과목 삭제 취소됨',
            type: 'info',
            duration: 3000,
          });
        });
    },
  },
};
</script>



